package net.csfarmer

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.utils.io.core.*
import net.csfarmer.database.Database
import net.csfarmer.database.EventTables
import net.csfarmer.model.rest.TrackedEventsRequest

class TrackingServer(ktorApplication: Application, database: Database, private val config: TrackingConfig) {
    init {
        ktorApplication.routing {
            options("{...}") {
                if (config.env != Env.PROD) {
                    call.response.apply {
                        header("Access-Control-Allow-Origin", "*")
                        header("Access-Control-Allow-Methods", "*")
                        header("Access-Control-Allow-Headers", "Content-Type")
                    }
                }
                call.respondText("", ContentType.Text.Any, HttpStatusCode.OK)
            }
            post("/events") {
                try {
                    val bodyBytes = call.request.receiveChannel().readRemaining().readBytes()
                    val request: TrackedEventsRequest = JsonConverter.deserialize(bodyBytes)
                    try {
                        requestProcessor.trackedEvents.submitRequest(request)
                    } catch (e: Exception) {
                        println("Dropping deserialized request due to failure. Failure message: ${e.message}. Request: $request")
                        throw e
                    }
                } catch (e: Exception) {
                    println("ERROR: Failed to process request: ${e.message}")
                    e.printStackTrace()
                }
                if (config.env != Env.PROD) {
                    call.response.header("Access-Control-Allow-Origin", "*")
                }
                call.respondText("{}", ContentType.Application.Json, HttpStatusCode.OK)
            }
        }
        println("Tracking server started with $config")
    }

    private val requestProcessor = object {
        val trackedEvents = TrackedEventsRequestProcessor(
            maxBufferCount = config.maxBufferCount,
            maxBufferMillis = config.maxBufferMillis,
            eventTables = EventTables(database),
        )
    }
}