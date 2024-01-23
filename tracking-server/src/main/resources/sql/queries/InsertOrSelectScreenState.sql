with insert_result as (
    insert into screen_state (height_px, width_px, is_phone_mode)
           values @
    on conflict on constraint screen_state_unique_constraint do nothing
    returning *
)
select * from insert_result
    union
select * from screen_state where (height_px, width_px, is_phone_mode) in (@)