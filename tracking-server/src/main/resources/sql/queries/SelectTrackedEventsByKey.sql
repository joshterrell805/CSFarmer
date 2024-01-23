select jsonb_build_object(
    'pageLoadId', base.page_load_id,
    'order', base.event_order,
    'type', event_type,
    'context', jsonb_build_object(
        'timestamp', extract(epoch from event_timestamp) * 1000,
        'location', event_location,
        'screenState', event_screen_state
    ),
    'info', event_info
) #>> '{}' as event_string
from
(
    select * from tracked_events where (page_load_id, event_order) in (@)
) as base
    left join
(
    select screen_state_id, jsonb_build_object(
        'heightPx', height_px,
        'widthPx', width_px,
        'isPhoneMode', is_phone_mode
    ) as event_screen_state
    from screen_state
    where 1=1
) as ss on ss.screen_state_id = base.screen_state_id
    left join
(
    (
        select page_load_id, event_order, jsonb_build_object(
            'locationOnLoad', location_on_load,
            'siteLoadedTimestamp', extract(epoch from site_loaded_timestamp) * 1000,
            'appVersion', app_version,
            'referrer', referrer,
            'userAgent', user_agent
        ) as event_info
        from tracked_events__page_loaded
        where 1=1
    )
        union
    (
        select page_load_id, event_order, jsonb_build_object('buttonId', button_id) as event_info
        from tracked_events__button_pressed
        where 1=1
    )
        union
    (
        select page_load_id, event_order, jsonb_build_object('linkId', link_id) as event_info
        from tracked_events__link_clicked
        where 1=1
    )
        union
    (
        select page_load_id, event_order, jsonb_build_object(
            'message', message,
            'stackTrace', stack_trace
        ) as event_info
        from tracked_events__error_uncaught
        where 1=1
    )
        union
    (
        select page_load_id, event_order, jsonb_build_object(
            'scrollPercent', scroll_percent,
            'visiblePercent', visible_percent
        ) as event_info
        from tracked_events__page_scrolled
        where 1=1
    )
) as sub on sub.page_load_id = base.page_load_id and sub.event_order = base.event_order