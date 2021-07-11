create table events (
    id varchar primary key,
    label varchar,
    start_utc timestamptz,
    end_utc timestamptz
);