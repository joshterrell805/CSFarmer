package net.csfarmer

class ConversionException(message: String, cause: Throwable): Exception(message, cause)

class ValidationException(message: String, cause: Throwable): Exception(message, cause)

class AssertionException(message: String): Exception(message)

class IOException(message: String, cause: Throwable): Exception(message, cause)