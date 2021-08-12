create table if not exists users (
    id varchar primary key,
    username varchar,
    password varchar,
    privileges varchar,
    key varchar
);

create unique index if not exists idx_users_key_id on users (key, id);
create unique index if not exists idx_users_username_password_id on users(username, password, id)