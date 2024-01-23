package net.csfarmer

import kotlinx.coroutines.*
import net.csfarmer.database.EventTables
import net.csfarmer.model.TrackedEvent
import net.csfarmer.model.rest.TrackedEventsRequest
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

class TrackedEventsRequestProcessor(
    val maxBufferCount: Int,
    val maxBufferMillis: Long,
    private val eventTables: EventTables
) {
    private val queue = LinkedList<TrackedEventsRequest>()
    private var queueStarted = Instant.EPOCH

    init {
        launchFlushLoop()
    }

    fun submitRequest(request: TrackedEventsRequest) {
        validateRequest(request)
        synchronized(queue) {
            val firstElement = queue.isEmpty()
            queue.add(request)
            if (firstElement) {
                queueStarted = Instant.now()
            }
        }
    }

    private fun validateRequest(request: TrackedEventsRequest) {
        try {
            throwIf(request.newEvents.isEmpty()) {
                "newEvents is empty"
            }
            val now = Instant.now()
            val firstPageLoadId = request.newEvents.first().pageLoadId
            for (event in request.newEvents) {
                try {
                    throwIf(event.order <= 0) {
                        "order is less than 1: ${event.order}"
                    }
                    val timestamp = Instant.ofEpochMilli(event.context.timestamp)
                    // due to systems being out of sync, allow timestamps to be in the future by about 30s.
                    throwIf(timestamp > now.plusSeconds(30) || timestamp < now.minus(1, ChronoUnit.HOURS)) {
                        "timestamp is not within the last hour: $timestamp"
                    }
                    throwIf(event.pageLoadId != firstPageLoadId) {
                        "pageLoadId differs from the first event's pageLoadId"
                    }
                } catch (e: Exception) {
                    throw ValidationException("Event ${event.logId} failed validation", e)
                }
            }
        } catch (e: Exception) {
            throw ValidationException("Request ${request.requestId} failed validation", e)
        }
    }

    private fun launchFlushLoop() {
        CoroutineScope(Dispatchers.IO).launch {
            while(true) {
                val requests = mutableListOf<TrackedEventsRequest>()
                synchronized(queue) {
                    val millisSinceQueueNonEmpty = Instant.now().toEpochMilli() - queueStarted.toEpochMilli()
                    val shouldFlush =
                        queue.size > maxBufferCount || (queue.size > 0 && millisSinceQueueNonEmpty > maxBufferMillis)
                    if (shouldFlush) {
                        requests.addAll(queue)
                        queue.clear()
                        val requestCount = requests.size
                        val eventCount = requests.sumOf { it.newEvents.size }
                        println("Saving $requestCount requests ($eventCount events) after buffering for $millisSinceQueueNonEmpty milliseconds")
                    }
                }
                if (requests.isNotEmpty()) {
                    val events = requests.flatMap { it.newEvents }
                    launchProcessEvents(events)
                }
                delay(Fuzz.second())
            }
        }
    }

    private fun launchProcessEvents(allEvents: List<TrackedEvent<*>>) {
        CoroutineScope(Dispatchers.IO).launch {
            supervisorScope {
                val eventsByPageLoadId = allEvents.groupBy { it.pageLoadId }
                // save each batch of events by pageLoadId separately, so multiple users' data isn't affected with one malicious user.
                eventsByPageLoadId.forEach { (pageLoadId, events) ->
                    launch {
                        try {
                            eventTables.save(events)
                            println("Saved ${events.size} events for pageLoadId=$pageLoadId")
                        } catch (e: Throwable) {
                            println("Failed to add events for pageLoadId=$pageLoadId... dropping events.")
                            println("Dropping ${events.size} events for pageLoadId=$pageLoadId: events=$events")
                            e.printStackTrace()
                        }
                    }
                }
            }
        }
    }
}
