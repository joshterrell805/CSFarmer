package net.csfarmer

import kotlin.random.Random

object Fuzz {
    fun second() = Random.nextLong(750, 1250)
}