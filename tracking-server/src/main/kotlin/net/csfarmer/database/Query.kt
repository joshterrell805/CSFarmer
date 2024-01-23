package net.csfarmer.database

import net.csfarmer.AssertionException
import net.csfarmer.throwIf
import java.util.*

class Query(
    queryFileName: String,
) {
    val rawQuery = Query::class.java.classLoader.getResource("sql/queries/$queryFileName")!!.readText()

    companion object {
        val selectTrackedEventsByKey = Query("SelectTrackedEventsByKey.sql")
        val insertOrSelectScreenState = Query("InsertOrSelectScreenState.sql")
        val insertBaseEvent = Query("InsertBaseEvent.sql")
        val insertSubEvent = Query("InsertSubEvent.sql")
    }

    /** convert the raw query (which may have "@" placeholders for collections) to a query that JDBC can handle */
    fun prepare(replacements: List<Any>): PreparedQuery {
        val idxReplacementCharPairs = rawQuery.mapIndexedNotNull { idx, char ->
            if (char == '?' || char == '@' || char == '$') idx to char else null
        }

        throwIf(idxReplacementCharPairs.size != replacements.size) {
            "the number of placeholders in rawQuery do not match the number of replacements passed"
        }

        val sb = StringBuilder()
        val newReplacements = mutableListOf<Any>()
        var nextIdx = 0
        for ((idxCharPair, replacement) in idxReplacementCharPairs.zip(replacements)) {
            val (idx, char) = idxCharPair
            when (char) {
                '$' -> {
                    throwIf( replacement !is String) { "replacement should be string when using literal $char placeholder" }
                    sb.append(rawQuery.substring(nextIdx, idx))
                    sb.append(replacement)
                }
                '?' -> {
                    sb.append(rawQuery.substring(nextIdx, idx + 1))
                    newReplacements.add(replacement)
                }
                '@' -> {
                    throwIf(replacement !is List<*>) { "replacement should be a list when placeholder is $char. Found: ${replacement::class.simpleName}" }
                    replacement as List<Any>
                    throwIf(replacement.isEmpty()) { "replacement should not be empty" }
                    sb.append(rawQuery.substring(nextIdx, idx))
                    val first = replacement.first()
                    if (first is Collection<*>) {
                        throwIf(first.size < 1) { "each sub-list in the replacement list must have at least one element" }
                        throwIf(replacement.any { it !is Collection<*> || it.size != first.size }) { "all replacements in sub-list should be of the same size" }
                        replacement as List<Collection<Any>>
                        val colTypes = calcColTypes(replacement)
                        sb.append(
                            (1..replacement.size).joinToString(", ") {
                                "(" + colTypes.joinToString(", ") { "?$it" } + ")"
                            }
                        )
                        replacement.forEach { newReplacements.addAll(it) }
                    } else {
                        sb.append((1..replacement.size).joinToString(", ") { "?" })
                        newReplacements.addAll(replacement)
                    }
                }
                else -> throw AssertionException("unexpected placeholder: $char")
            }
            nextIdx = idx + 1
        }

        sb.append(rawQuery.substring(nextIdx))
        val finalQuery = sb.toString()
        return PreparedQuery(finalQuery, newReplacements)
    }

    private fun calcColTypes(rows: List<Collection<Any>>): List<String> {
        val colTypes = rows.first().map { "" }.toMutableList()
        rows.forEach { row ->
            row.forEachIndexed { idx, col ->
                val colType = when (col) {
                    is UUID -> "::uuid"
                    else -> null
                }
                if (colType != null) {
                    if (colTypes[idx] == "") {
                        colTypes[idx] = colType
                    } else {
                        throwIf(colTypes[idx] != colType) {
                            "Types of every column in every row should match. Found ${colTypes[idx]} and $colType for column $idx"
                        }
                    }
                }
            }
        }
        return colTypes
    }
}