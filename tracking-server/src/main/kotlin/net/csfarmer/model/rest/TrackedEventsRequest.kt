package net.csfarmer.model.rest

import net.csfarmer.model.TrackedEvent
import java.util.*

data class TrackedEventsRequest(
    override val requestId: UUID,
    val newEvents: List<TrackedEvent<*>>,
) : HttpRequest