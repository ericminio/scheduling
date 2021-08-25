delete from events
where not exists (select event_id from events_resources where event_id = events.id);