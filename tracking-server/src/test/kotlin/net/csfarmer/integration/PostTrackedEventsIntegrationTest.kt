package net.csfarmer.integration

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import net.csfarmer.*
import net.csfarmer.database.EventTables
import net.csfarmer.model.TrackedEvent
import net.csfarmer.model.rest.TrackedEventsRequest
import org.junit.jupiter.api.Test
import java.time.Instant
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue

class PostTrackedEventsIntegrationTest : IntegrationTestBase() {

    private val eventTables = EventTables(database)

    @Test
    fun validation() {
        val cases = listOf(
            TrackedEventsRequestProcessorTest.ValidationCase.SUCCESS,
            TrackedEventsRequestProcessorTest.ValidationCase.entries.filter { !it.expectPass }.random()
        )

        val postResults = cases.map { case ->
            kotlin.runCatching { postRequest(case.request) }
        }

        postResults.forEach { postResult ->
            assertTrue(postResult.isSuccess)
        }

        val keysToLoadPerEvent = cases.map { case ->
            case.request.newEvents.map { it.getKey() }
        }

        runBlocking {
            val queryResults = cases.zip(keysToLoadPerEvent).map { (case, keysToLoad) ->
                GlobalScope.async {
                    runCatching {
                        retryForSeconds(3) {
                            val savedEvents = eventTables.load(keysToLoad)
                            assertEquals(case.request.newEvents, savedEvents)
                        }
                    }
                }
            }.map { it.await() }

            cases.zip(queryResults).forEach { (case, queryResult) ->
                val e = queryResult.exceptionOrNull()
                if (case.expectPass) {
                    assertNull(e)
                } else {
                    assertTrue(e is AssertionError)
                }
            }
        }
    }

    @Test
    fun `all events can be saved`() {
        val pageLoadId = randomUUID()
        val events = TrackedEvent.eventTypes.map { randomValidEvent(it, pageLoadId)}

        val request = TrackedEventsRequest(randomUUID(), events)
        postRequest(request)

        val keys = events.map { it.getKey() }

        retryForSeconds(3) {
            val savedEvents = eventTables.load(keys)
            assertEquals(events, savedEvents)
        }
    }

    private fun randomValidEvent(
        eventType: String = TrackedEvent.eventTypes.random(),
        pageLoadId: UUID = randomUUID(),
    ): TrackedEvent<*> {
        val screenState = TrackedEvent.ScreenState(randomInt(), randomInt(), randomBool())
        val maybeScreenState = if (randomBool()) screenState else null
        val context = TrackedEvent.Context(randomString(), Instant.now().toEpochMilli(), maybeScreenState)
        val order = randomLongBetween(1L, Long.MAX_VALUE)
        return when(eventType) {
            "PageLoaded" -> TrackedEvent.PageLoaded(
                pageLoadId,
                order,
                context,
                TrackedEvent.PageLoaded.Info(randomString(), Instant.now().minusMillis(randomLongBetween(0, 60*1000)).toEpochMilli(), randomString(), randomString(), randomString())
            )
            "ButtonPressed" -> TrackedEvent.ButtonPressed(
                pageLoadId,
                order,
                context,
                TrackedEvent.ButtonPressed.Info(randomString())
            )
            "LinkClicked" -> TrackedEvent.LinkClicked(
                pageLoadId,
                order,
                context,
                TrackedEvent.LinkClicked.Info(randomString())
            )
            "ErrorUncaught" -> TrackedEvent.ErrorUncaught(
                pageLoadId,
                order,
                context,
                TrackedEvent.ErrorUncaught.Info(randomString(), randomString())
            )
            "ScreenResized" -> TrackedEvent.ScreenResized(
                pageLoadId,
                order,
                context.copy(screenState = screenState)
            )
            "PageChanged" -> TrackedEvent.PageChanged(
                pageLoadId,
                order,
                context
            )
            "PageScrolled" -> TrackedEvent.PageScrolled(
                pageLoadId,
                order,
                context,
                TrackedEvent.PageScrolled.Info(randomFloat(), randomFloat())
            )
            else -> throw AssertionException("Unhandled eventType: $eventType")
        }
    }

    private fun postRequest(request: TrackedEventsRequest) {
        val response = httpPost("/events", request)
        assertEquals("{}", response.readBody())
        assertEquals(200, response.status.value)
    }
}