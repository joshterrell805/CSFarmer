package net.csfarmer

import io.mockk.mockk
import net.csfarmer.database.EventTables
import net.csfarmer.model.TrackedEvent
import net.csfarmer.model.rest.TrackedEventsRequest
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*
import kotlin.test.assertEquals

class TrackedEventsRequestProcessorTest {

    enum class ValidationCase(
        val request: TrackedEventsRequest,
        val expectPass: Boolean = true,
    ) {
        SUCCESS(),
        NO_EVENTS(count = 0, expectPass = false),
        INVALID_ORDER(anOrder = listOf(0L, -1L).random(), expectPass = false),
        TOO_OLD(aTimestamp = Instant.now().minus(61, ChronoUnit.MINUTES).toEpochMilli(), expectPass = false),
        IN_THE_FUTURE(aTimestamp = Instant.now().plusSeconds(60).toEpochMilli(), expectPass = false),
        HARDLY_IN_THE_FUTURE(aTimestamp = Instant.now().plusSeconds(20).toEpochMilli(), expectPass = true),
        PAGE_LOAD_ID_DIFFERS(aPageLoadId = randomUUID(), expectPass = false);

        constructor(
            count: Int = 10,
            anOrder: Long? = null,
            aTimestamp: Long? = null,
            aPageLoadId: UUID? = null,
            expectPass: Boolean = true,
            pageLoadId: UUID = UUID.randomUUID(),
        ) : this(
            TrackedEventsRequest(
                UUID.randomUUID(),
                (1L..count).map {
                    TrackedEvent.PageChanged(
                        pageLoadId,
                        it,
                        TrackedEvent.Context(randomString(), Instant.now().toEpochMilli(), TrackedEvent.ScreenState(randomInt(), randomInt(), randomBool())),
                    )
                }.mapIndexed { idx, event ->
                    if (idx == 0) {
                        val order = anOrder ?: event.order
                        val timestamp = aTimestamp ?: event.context.timestamp
                        val pageLoadId = aPageLoadId ?: event.pageLoadId
                        event.copy(pageLoadId = pageLoadId, order = order, context = event.context.copy(timestamp = timestamp))
                    } else {
                        event
                    }
                }.shuffled()
            ),
            expectPass,
        )
    }
    private val eventTables = mockk<EventTables>(relaxed = true)
    private val processor = TrackedEventsRequestProcessor(100, 333, eventTables)

    @ParameterizedTest
    @EnumSource(ValidationCase::class)
    fun `validates requests`(case: ValidationCase) {
        val result = kotlin.runCatching {
            processor.submitRequest(case.request)
        }
        assertEquals(case.expectPass, result.isSuccess)
    }
}