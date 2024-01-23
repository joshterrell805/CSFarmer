package net.csfarmer.database

import net.csfarmer.JsonConverter
import net.csfarmer.model.TrackedEvent
import net.csfarmer.throwIf
import java.time.Instant
import java.util.*
import kotlin.reflect.KClass

// TODO 0009: add retry logic
class EventTables(private val database: Database) {

    // IMPORTANT ⚠
    // When adding a new type, you must also update the "select" queries to query from the new sub-tables
    private val saverByEventTypeName: Map<String, TrackedEventSaver<*>> = listOf(
        TrackedEventSaver.PageLoaded,
        TrackedEventSaver.ButtonPressed,
        TrackedEventSaver.LinkClicked,
        TrackedEventSaver.ErrorUncaught,
        TrackedEventSaver.ScreenResized,
        TrackedEventSaver.PageChanged,
        TrackedEventSaver.PageScrolled,
    ).associateBy { it.eventType.simpleName!! }


    fun save(events: List<TrackedEvent<*>>) {
        database.transaction { transaction ->
            val eventsByEventTypeName = events.groupBy { it.getType() }

            eventsByEventTypeName.forEach { (eventTypeName, eventsOfType) ->
                val saver = saverByEventTypeName[eventTypeName]
                throwIf(saver == null) { "Could not find saver for $eventTypeName" }
                saver!!.save(transaction, eventsOfType)
            }
        }
    }

    fun load(keys: List<Pair<UUID, Long>>): List<TrackedEvent<*>?> {
        if (keys.isEmpty()) return listOf()

        val preparedQuery = Query.selectTrackedEventsByKey.prepare(listOf(keys.map { it.toList() }))
        val results = database.query(preparedQuery) { rs ->
            val eventString = rs.getString(1)
            JsonConverter.deserialize<TrackedEvent<*>>(eventString)
        }
        val resultByKey = results.associateBy { it.pageLoadId to it.order }
        return keys.map { resultByKey[it] }
    }

    fun load(pageLoadId: UUID, order: Long): TrackedEvent<*> = load(listOf(pageLoadId to order)).single()!!


    private sealed class TrackedEventSaver<T: TrackedEvent<*>>(
        val eventType: KClass<T>,
        val subTableName: String? = null
    ) {
        data object PageLoaded : TrackedEventSaver<TrackedEvent.PageLoaded>(
            TrackedEvent.PageLoaded::class,
            "tracked_events__page_loaded"
        ) {
            override fun getAdditionalFields(event: TrackedEvent.PageLoaded) = listOf(
                event.info.locationOnLoad,
                Instant.ofEpochMilli(event.info.siteLoadedTimestamp),
                event.info.appVersion,
                event.info.referrer,
                event.info.userAgent,
            )
        }

        data object ButtonPressed : TrackedEventSaver<TrackedEvent.ButtonPressed>(
            TrackedEvent.ButtonPressed::class,
            "tracked_events__button_pressed",
        ) {
            override fun getAdditionalFields(event: TrackedEvent.ButtonPressed) = listOf(event.info.buttonId)
        }

        data object LinkClicked : TrackedEventSaver<TrackedEvent.LinkClicked>(
            TrackedEvent.LinkClicked::class,
            "tracked_events__link_clicked",
        ) {
            override fun getAdditionalFields(event: TrackedEvent.LinkClicked) = listOf(event.info.linkId)
        }

        data object ErrorUncaught : TrackedEventSaver<TrackedEvent.ErrorUncaught>(
            TrackedEvent.ErrorUncaught::class,
            "tracked_events__error_uncaught",
        ) {
            override fun getAdditionalFields(event: TrackedEvent.ErrorUncaught) = listOf(event.info.message, event.info.stackTrace)
        }

        data object ScreenResized : TrackedEventSaver<TrackedEvent.ScreenResized>(
            TrackedEvent.ScreenResized::class,
        )

        data object PageChanged : TrackedEventSaver<TrackedEvent.PageChanged>(
            TrackedEvent.PageChanged::class,
        )

        data object PageScrolled : TrackedEventSaver<TrackedEvent.PageScrolled>(
            TrackedEvent.PageScrolled::class,
            "tracked_events__page_scrolled"
        ) {
            override fun getAdditionalFields(event: TrackedEvent.PageScrolled) = listOf(event.info.visiblePercent, event.info.scrollPercent)
        }

        open fun getAdditionalFields(event: T): List<Any> = listOf()

        fun save(transaction: Database.Transaction, events: List<TrackedEvent<*>>) {
            throwIf(
                events.any { it::class != eventType }
            ) {
                "${this::class} expected all events to be of type $eventType. Found: ${events.map { it::class.simpleName }.toSet()}"
            }

            events as List<T>

            val screenStateIdByScreenState = insertScreenState(transaction, events)
            insertBaseEvents(transaction, events, screenStateIdByScreenState)
            insertSubEvents(transaction, events)
        }

        private fun insertScreenState(transaction: Database.Transaction, events: List<TrackedEvent<*>>): Map<TrackedEvent.ScreenState, Int> {
            val screenStates = events.mapNotNull { it.context.screenState }
            if (screenStates.isEmpty()) {
                return mapOf()
            }

            val args = screenStates.map { listOf(it.heightPx, it.widthPx, it.isPhoneMode) }
            val preparedQuery = Query.insertOrSelectScreenState.prepare(listOf(args, args))
            val results = transaction.query(preparedQuery) { rs ->
                val id = rs.getInt(1)
                val state = TrackedEvent.ScreenState(
                    rs.getInt(2),
                    rs.getInt(3),
                    rs.getBoolean(4)
                )
                state to id
            }
            return results.toMap()
        }

        private fun insertBaseEvents(transaction: Database.Transaction, events: List<TrackedEvent<*>>, screenStateIdByScreenState: Map<TrackedEvent.ScreenState, Int>) {
            val rowsToInsert = events.map {
                val screenStateId = it.context.screenState?.let { ss -> screenStateIdByScreenState[ss] }
                listOf(it.pageLoadId, it.order, it.getType(), Instant.ofEpochMilli(it.context.timestamp), it.context.location, screenStateId)
            }

            val preparedQuery = Query.insertBaseEvent.prepare(listOf(rowsToInsert))
            transaction.execute(preparedQuery)
        }

        private fun insertSubEvents(transaction: Database.Transaction, events: List<T>) {
            if (subTableName != null) {
                val subTableRows = events.map {
                    listOf(it.pageLoadId, it.order) + getAdditionalFields(it)
                }
                val preparedQuery = Query.insertSubEvent.prepare(listOf(subTableName, subTableRows))
                transaction.execute(preparedQuery)
            }
        }
    }
}