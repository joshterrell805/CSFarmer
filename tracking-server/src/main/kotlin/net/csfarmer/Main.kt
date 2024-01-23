package net.csfarmer

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import net.csfarmer.database.Database
import javax.sql.DataSource


fun main(args: Array<String>) {
    val server = createTrackingServer()
    server.start(wait = true)
}

fun createTrackingServer(port: Int = 8080) = embeddedServer(
    Netty,
    host = "127.0.0.1",
    port = port,
    module = Application::trackingServerModule
)

fun Application.trackingServerModule() {
    val dataSource = createDataSource()
    val database = Database(dataSource)
    TrackingServer(this, database, TrackingConfig.value)
}

internal fun createDataSource(): DataSource {
    val config = HikariConfig()
    config.jdbcUrl = "jdbc:postgresql://localhost:${TrackingConfig.value.dbPort}/usage"
    config.username = "usage_server"
    val devPassword = "sadl234jeefi5fenfeief0n"
    config.password = if (TrackingConfig.value.env == Env.PROD) {
      val propName = "CSF_USAGE_SERVER_DB_PASSWORD"
      System.getenv(propName) ?: throw AssertionException("db password must be sent in $propName")
    } else {
      devPassword
    }
    return HikariDataSource(config)
}
