create table if not exists events_resources (
    event_id varchar,
    resource_id varchar,

    primary key (event_id, resource_id)
);