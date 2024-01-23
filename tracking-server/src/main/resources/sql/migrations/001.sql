create table if not exists screen_state(
    screen_state_id serial primary key,
    height_px int not null,
    width_px int not null,
    is_phone_mode bool not null,
    constraint screen_state_unique_constraint unique(height_px, width_px, is_phone_mode)
);

create table if not exists tracked_events(
    page_load_id uuid not null,
    event_order bigint not null,
    event_type text not null,
    event_timestamp timestamp not null,
    event_location text not null,
    screen_state_id int references screen_state(screen_state_id),
    primary key(page_load_id, event_order)
);

create table if not exists tracked_events__page_loaded(
    page_load_id uuid not null,
    event_order bigint not null,
    location_on_load text not null,
    site_loaded_timestamp timestamp not null,
    app_version text not null,
    referrer text not null,
    user_agent text not null,
    foreign key (page_load_id, event_order) references tracked_events (page_load_id, event_order),
    primary key (page_load_id, event_order)
);

create table if not exists tracked_events__button_pressed(
    page_load_id uuid not null,
    event_order bigint not null,
    button_id text not null,
    foreign key (page_load_id, event_order) references tracked_events (page_load_id, event_order),
    primary key (page_load_id, event_order)
);

create table if not exists tracked_events__link_clicked(
    page_load_id uuid not null,
    event_order bigint not null,
    link_id text not null,
    foreign key (page_load_id, event_order) references tracked_events (page_load_id, event_order),
    primary key (page_load_id, event_order)
);

create table if not exists tracked_events__error_uncaught(
    page_load_id uuid not null,
    event_order bigint not null,
    message text not null,
    stack_trace text not null,
    foreign key (page_load_id, event_order) references tracked_events (page_load_id, event_order),
    primary key (page_load_id, event_order)
);

create table if not exists tracked_events__page_scrolled(
    page_load_id uuid not null,
    event_order bigint not null,
    visible_percent real not null,
    scroll_percent real not null,
    foreign key (page_load_id, event_order) references tracked_events (page_load_id, event_order),
    primary key (page_load_id, event_order)
);