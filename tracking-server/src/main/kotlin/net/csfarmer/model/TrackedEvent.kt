package net.csfarmer.model

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonTypeInfo
import net.csfarmer.throwIf
import java.util.*

@JsonTypeInfo(use = JsonTypeInfo.Id.SIMPLE_NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
sealed class TrackedEvent<I> {
    abstract val pageLoadId: UUID
    abstract val order: Long
    abstract val context: Context
    abstract val info: I

    @JsonIgnore
    val logId = "($pageLoadId, $order)"

    @JsonIgnore
    fun getType() = this::class.simpleName!!

    @JsonIgnore
    fun getKey() = pageLoadId to order

    data class PageLoaded(
        override val pageLoadId: UUID,
        override val order: Long,
        override val context: Context,
        override val info: Info,
    ) : TrackedEvent<PageLoaded.Info>() {
        data class Info(
            val locationOnLoad: String,
            val siteLoadedTimestamp: Long,
            val appVersion: String,
            val referrer: String,
            val userAgent: String,
        )
    }

    data class ButtonPressed(
        override val pageLoadId: UUID,
        override val order: Long,
        override val context: Context,
        override val info: Info
    ): TrackedEvent<ButtonPressed.Info>() {
        data class Info(val buttonId: String)
    }

    data class LinkClicked(
        override val pageLoadId: UUID,
        override val order: Long,
        override val context: Context,
        override val info: Info
    ): TrackedEvent<LinkClicked.Info>() {
        data class Info(val linkId: String)
    }

    data class ErrorUncaught(
        override val pageLoadId: UUID,
        override val order: Long,
        override val context: Context,
        override val info: Info
    ): TrackedEvent<ErrorUncaught.Info>() {
        data class Info(
            val message: String,
            val stackTrace: String,
        )
    }

    data class ScreenResized(
        override val pageLoadId: UUID,
        override val order: Long,
        override val context: Context,
        override val info: Any? = null
    ): TrackedEvent<Any?>() {
        init {
            throwIf(context.screenState == null) { "screen state must be present" }
            throwIf(info != null) { "info should be null" }
        }
    }

    data class PageChanged(
        override val pageLoadId: UUID,
        override val order: Long,
        override val context: Context,
        override val info: Any? = null
    ): TrackedEvent<Any?>() {
        init {
            throwIf(info != null) { "info should be null" }
        }
    }

    data class PageScrolled(
        override val pageLoadId: UUID,
        override val order: Long,
        override val context: Context,
        override val info: Info
    ): TrackedEvent<PageScrolled.Info>() {
        data class Info(
            val visiblePercent: Float, // percent of page visible
            val scrollPercent: Float, // percent of page-length scrolled
        )
    }

    data class Context(
        val location: String,
        val timestamp: Long,
        val screenState: ScreenState? = null
    )

    data class ScreenState(
        val heightPx: Int,
        val widthPx: Int,
        val isPhoneMode: Boolean,
    )

    companion object {
        val eventTypes = TrackedEvent::class.sealedSubclasses.map { it.simpleName!! }
    }
}