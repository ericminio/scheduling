create table if not exists events (
    id varchar primary key,
    label varchar,
    start_time varchar,
    end_time varchar
);

create index if not exists idx_events_searh_by_date on events (start_time, end_time, id);