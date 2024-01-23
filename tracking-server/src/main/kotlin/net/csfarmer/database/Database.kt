package net.csfarmer.database

import net.csfarmer.AssertionException
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet
import java.sql.Timestamp
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.*
import javax.sql.DataSource

class Database(
    private val dataSource: DataSource
) {

    fun transaction(code: (Transaction) -> Unit) {
        dataSource.connection.use { connection ->
            connection.autoCommit = false
            try {
                val transaction = Transaction(connection)
                code(transaction)
                connection.commit()
            } catch (t: Throwable) {
                connection.rollback()
                throw t
            }
        }
    }

    fun <T> query(preparedQuery: PreparedQuery, convertRow: (ResultSet) -> T): List<T> {
        dataSource.connection.use { connection ->
            return doQuery(connection, preparedQuery, convertRow)
        }
    }

    fun execute(preparedQuery: PreparedQuery) {
        dataSource.connection.use { connection ->
            doExecute(connection, preparedQuery)
        }
    }

    class Transaction(
        private val connection: Connection
    ) {
        fun <T> query(preparedQuery: PreparedQuery, convertRow: (ResultSet) -> T): List<T> {
            return doQuery(connection, preparedQuery, convertRow)
        }
        fun execute(preparedQuery: PreparedQuery) {
            doExecute(connection, preparedQuery)
        }
    }

    companion object {
        private fun <T> doQuery(connection: Connection, preparedQuery: PreparedQuery, convertRow: (ResultSet) -> T): List<T> {
            val statement = prepareStatement(connection, preparedQuery)
            val rs = statement.executeQuery()
            val results = mutableListOf<T>()
            while (rs.next()) {
                val result = convertRow(rs)
                results.add(result)
            }
            return results
        }

        private fun doExecute(connection: Connection, preparedQuery: PreparedQuery) {
            val statement = prepareStatement(connection, preparedQuery)
            statement.execute()
        }

        private fun prepareStatement(connection: Connection, preparedQuery: PreparedQuery): PreparedStatement {
            val statement = connection.prepareStatement(preparedQuery.query)
            preparedQuery.replacements.forEachIndexed { idx, replacement ->
                val oneBasedIdx = idx + 1
                when (replacement) {
                    null -> statement.setObject(oneBasedIdx, null)
                    is Long -> statement.setLong(oneBasedIdx, replacement)
                    is Int -> statement.setInt(oneBasedIdx, replacement)
                    is Boolean -> statement.setBoolean(oneBasedIdx, replacement)
                    is String -> statement.setString(oneBasedIdx, replacement)
                    is UUID -> statement.setString(oneBasedIdx, replacement.toString())
                    is Float -> statement.setFloat(oneBasedIdx, replacement)
                    is Instant -> statement.setTimestamp(oneBasedIdx, Timestamp.valueOf(ZonedDateTime.ofInstant(replacement, ZoneId.of("UTC")).toLocalDateTime()))
                    else -> throw AssertionException("Could not set placeholder value of type: ${replacement::class.simpleName}")
                }
            }
            return statement
        }
    }

}