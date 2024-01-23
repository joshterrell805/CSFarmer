package net.csfarmer.database

/**  "@" placeholders are flattened to "?" placeholders */
data class PreparedQuery(val query: String, val replacements: List<Any>)