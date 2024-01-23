package net.csfarmer.model

import com.fasterxml.jackson.databind.node.ObjectNode
import net.csfarmer.*
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.RepeatedTest
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import org.junit.jupiter.params.provider.ValueSource
import kotlin.test.assertEquals

class TrackedEventSerdeTest {

    enum class DeserializationTestCase(
        val data: Data,
    ) {
        SUCCESS,
        MISSING_REQUIRED_FIELD(
            removeContext = true,
            expectedError = true,
        ),
        TYPE_MISMATCH(
            eventType = "PageScrolled",
            expectedError = true,
        ),
        TYPE_INVALID(
            eventType = randomString(),
            expectedError = true,
        ),
        INVALID_FIELD_VALUE(
            order = "ab",
            expectedError = true,
        ),
        INVALID_TYPE(
            eventType = randomString(),
            expectedError = true,
        );

        class Data(
            val request: ByteArray,
            val expectedRequest: TrackedEvent<*>?,
            val expectedError: Boolean,
        )

        constructor(
            eventType: String = "PageLoaded",
            order: String = "1",
            removeContext: Boolean = false,
            expectedError: Boolean = false,
        ) : this(kotlin.run {
            val eventInfo = TrackedEvent.PageLoaded.Info(
                randomString(),
                randomLong(),
                randomString(),
                randomString(),
                randomString()
            )
            val orderIsDigit = order[0].isDigit()
            val request = TrackedEvent.PageLoaded(
                randomUUID(),
                if (orderIsDigit) order.toLong() else 0L,
                TrackedEvent.Context(
                    randomString(),
                    randomLong(),
                    TrackedEvent.ScreenState(randomInt(), randomInt(), randomBool())
                ),
                eventInfo
            )
            val requestJson = JsonConverter.serializeToBytes(request) {
                it.put("type", eventType)

                if (removeContext) {
                    it.remove("context")
                }

                if (orderIsDigit) {
                    it.put("order", order.toInt())
                } else {
                    it.put("order", order)
                }
            }

            Data(
                requestJson,
                if (expectedError) null else request,
                expectedError
            )
        })
    }

    @Nested
    inner class Serde {

        @ParameterizedTest
        @EnumSource(DeserializationTestCase::class)
        fun `deserialize`(case: DeserializationTestCase) {
            val result = runCatching {
                JsonConverter.deserialize<TrackedEvent<*>>(case.data.request)
            }
            if (case.data.expectedError) {
                assertTrue(result.isFailure)
            } else {
                assertFalse(result.isFailure)
                val deserialized = result.getOrThrow()
                assertEquals(case.data.expectedRequest, deserialized)
            }
        }

        @ParameterizedTest
        @ValueSource(booleans = [true, false])
        fun `screen state required for ScreenResized event`(removeScreenState: Boolean) {
            val event = TrackedEvent.ScreenResized(
                randomUUID(),
                randomLong(),
                TrackedEvent.Context(
                    randomString(),
                    randomLong(),
                    TrackedEvent.ScreenState(randomInt(), randomInt(), randomBool()))
            )

            val json = JsonConverter.convert(event, ObjectNode::class)
            if (removeScreenState) {
                (json.get("context") as ObjectNode).remove("screenState")
            }

            val string = JsonConverter.serializeToString(json)
            val result = kotlin.runCatching {
                JsonConverter.deserialize<TrackedEvent.ScreenResized>(string)
            }
            assertEquals(removeScreenState, result.isFailure)
        }

        @RepeatedTest(20)
        fun `random serde`() {
            val screenState = TrackedEvent.ScreenState(randomInt(), randomInt(), randomBool())
            val context = TrackedEvent.Context(
                randomString(),
                randomLong(),
                if (randomBool()) null else screenState
            )

            val event = listOf(
                { TrackedEvent.PageLoaded(randomUUID(), randomLong(), context,
                    TrackedEvent.PageLoaded.Info(randomString(), randomLong(), randomString(), randomString(), randomString())) },
                { TrackedEvent.LinkClicked(randomUUID(), randomLong(), context,
                    TrackedEvent.LinkClicked.Info(randomString())) },
                { TrackedEvent.ButtonPressed(randomUUID(), randomLong(), context,
                    TrackedEvent.ButtonPressed.Info(randomString())) },
                { TrackedEvent.ErrorUncaught(randomUUID(), randomLong(), context,
                    TrackedEvent.ErrorUncaught.Info(randomString(), randomString())) },
                { TrackedEvent.PageChanged(randomUUID(), randomLong(), context) },
                { TrackedEvent.ScreenResized(randomUUID(), randomLong(), context.copy(screenState = screenState)) }
            ).random().invoke()


            val deserialized: TrackedEvent<*> = if (randomBool()) {
                val string = JsonConverter.serializeToString(event)
                JsonConverter.deserialize(string)
            } else {
                val bytes = JsonConverter.serializeToBytes(event)
                JsonConverter.deserialize(bytes)
            }

            assertEquals(event, deserialized)
        }
    }
}