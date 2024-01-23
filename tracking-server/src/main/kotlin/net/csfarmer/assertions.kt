package net.csfarmer

fun throwIf(condition: Boolean, getMessage: () -> String) {
    if (condition) {
        throw AssertionException(getMessage())
    }
}