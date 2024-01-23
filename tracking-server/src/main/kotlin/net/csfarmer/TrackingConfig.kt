package net.csfarmer

enum class Env {
    PROD,
    DEV,
    TEST;
}

data class TrackingConfig(
    val env: Env,
    val maxBufferMillis: Long,
    val maxBufferCount: Int,
    val dbPort: Int,
) {
    companion object {
        private val env = System.getProperty(TrackingConfig.ENV_VAR_NAME).let {
            val env = if (it == null || it.isEmpty()) Env.DEV else Env.valueOf(it.uppercase())
            println("read ${TrackingConfig.ENV_VAR_NAME}=$it, converted to env=$env")
            env
        }
        val value = TrackingConfig(
            env,
            maxBufferMillis = when (env) {
                Env.PROD -> 60 * 1000L
                else -> 100L
            },
            maxBufferCount = 1000,
            dbPort = when (env) {
                Env.PROD -> 5432
                else -> 5055
            },
        )
        const val ENV_VAR_NAME = "environment"
    }
}

