package net.csfarmer.integration

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.engine.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import net.csfarmer.*
import net.csfarmer.database.Database
import net.csfarmer.database.PreparedQuery
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import java.time.Instant
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicReference

open class IntegrationTestBase {
    companion object {
        private val server = AtomicReference<ApplicationEngine?>(null)
        private val serverPort = AtomicReference<Int?>(null)
        private val serverUrl = AtomicReference<String?>(null)
        private val client = HttpClient()
        val database = Database(createDataSource())

        fun httpPost(path: String, body: Any): HttpResponse {
            return runBlocking {
                client.post("${serverUrl.get()}$path") {
                    this.setBody(JsonConverter.serializeToString(body))
                    this.contentType(ContentType.Application.Json)
                }
            }
        }

        @JvmStatic
        @BeforeAll
        fun setupAll() {
            throwIf(System.getProperty(TrackingConfig.ENV_VAR_NAME) != null) { "expected null env" }
            System.setProperty(TrackingConfig.ENV_VAR_NAME, "test")

            server.set(createTrackingServer(0))
            server.get()!!.start(wait = false)
            val port = retryForSeconds(5) {
                server.get()!!.resolvedConnectors().single { it.port != 0 }.port
            }
            serverPort.set(port)
            serverUrl.set("http://localhost:$port")
            println("Started HTTP server at ${serverUrl.get()} for integration tests")

            val migrationsToRun = listOf<Int>() // set migrations to run here
            if (migrationsToRun.isNotEmpty()) {
                runMigrations(migrationsToRun)
            }
        }

        @JvmStatic
        @AfterAll
        fun afterAll() {
            server.get()?.stop()
        }

        fun HttpResponse.readBody(): String = runBlocking { bodyAsText() }

        fun <T> retryForSeconds(seconds: Int, function: suspend () -> T): T {
            return runBlocking {
                val start = Instant.now().toEpochMilli()
                val maxDurationMs = TimeUnit.SECONDS.toMillis(seconds.toLong())
                var lastError: Throwable? = null
                while (Instant.now().toEpochMilli() - start < maxDurationMs) {
                    try {
                        return@runBlocking function()
                    } catch (e: Throwable) {
                        lastError = e
                        delay(randomLongBetween(100, 500))
                    }
                }
                throw lastError!!
            }
        }

        fun loadResource(path: String): String {
            try {
                return Database::class.java.classLoader.getResource(path)!!.readText()
            } catch (e: Exception) {
                throw IOException("Failed to load resource: $path", e)
            }
        }

        private fun runMigrations(versions: List<Int>) {
            val strVersions = versions.map { it.toString().padStart(3, '0') }
            println("Running migrations: $strVersions")
            strVersions.forEach { version ->
                val filename = "sql/migrations/$version.sql"
                val query = loadResource(filename)
                database.execute(PreparedQuery(query, listOf()))
            }
        }
    }
}