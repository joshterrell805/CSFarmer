package net.csfarmer

import java.util.*

val random = Random()

fun randomUUID() = UUID.randomUUID()

fun randomString(): String {
    val sb = StringBuilder()
    repeat(randomIntBetween(1, 10)) {
        sb.append(chars.all.random())
    }
    return sb.toString().toByteArray().decodeToString()
}

fun randomBool() = random.nextBoolean()

fun randomInt() = random.nextInt()
fun randomIntBetween(startInclusive: Int, endExclusive: Int) = random.nextInt(startInclusive, endExclusive)

fun randomLong() = random.nextLong()
fun randomLongBetween(startInclusive: Long, endExclusive: Long) = random.nextLong(startInclusive, endExclusive)
fun randomLongBetween(startInclusive: Int, endExclusive: Int) = randomLongBetween(startInclusive.toLong(), endExclusive.toLong())

fun randomFloat() = random.nextFloat()
fun randomFloatBetween(startInclusive: Float, endExclusive: Float) = random.nextFloat(startInclusive, endExclusive)
fun randomFloatBetween(startInclusive: Int, endExclusive: Int) = randomFloatBetween(startInclusive.toFloat(), endExclusive.toFloat())

private object chars {
    val alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toList()
    val numeric = "1234567890".toList()
    val symbol = "`~/\\-_=+&|*<>[]{}#!%".toList()
    val emoji = listOf("😎", "🦎", "🐛", "👩🏼‍🤝‍🧑🏾", "🛹", "🈺", "💲")
    val all = alpha + numeric + symbol + emoji
}