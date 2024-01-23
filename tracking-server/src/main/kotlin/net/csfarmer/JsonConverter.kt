package net.csfarmer

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import kotlin.reflect.KClass

object JsonConverter {
    fun serializeToString(data: Any): String {
        return try {
            mapper.writeValueAsString(data)
        } catch (e: Exception) {
            throw ConversionException("Failed to serialize ${data::class.simpleName} to string", e)
        }
    }

    fun serializeToBytes(data: Any): ByteArray = serializeToBytes(data) { it }

    fun serializeToBytes(data: Any, transform: (ObjectNode) -> Unit): ByteArray {
        return try {
            val node = mapper.convertValue(data, ObjectNode::class.java)
            transform(node)
            mapper.writeValueAsBytes(node)
        } catch (e: Exception) {
            throw ConversionException("Failed to serialize ${data::class.simpleName} to bytes", e)
        }
    }

    inline fun <reified T: Any>deserialize(data: String): T {
        return try {
            mapper.readValue(data, T::class.java)
        } catch (e: Exception) {
            throw ConversionException("Failed to deserialize string to ${T::class.simpleName}", e)
        }
    }

    inline fun <reified T: Any>deserialize(data: ByteArray): T {
        return try {
            mapper.readValue(data, T::class.java)
        } catch (e: Exception) {
            throw ConversionException("Failed to deserialize bytes to ${T::class.simpleName}", e)
        }
    }

    fun <T: Any>convert(data: Any, type: KClass<T>): T  {
        return try {
            mapper.convertValue(data, type.java)
        } catch (e: Exception) {
            throw ConversionException("Failed to convert ${data::class.simpleName} to ${type.simpleName}", e)
        }
    }


    val mapper = jacksonObjectMapper().apply {
        setSerializationInclusion(JsonInclude.Include.NON_NULL)
    }
}