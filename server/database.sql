create database invensample;

create table item(
    item_id serial primary key,
    item_name varchar(50) unique not null,
    price numeric(12, 2) not null
);

create table orders(
    order_id serial primary key,
    ref_number varchar(50) unique not null
);

create table orders_item(
    order_id integer references orders on delete cascade,
    item_id integer references item on delete cascade,
    qty_received integer not null,
    qty_ordered integer not null,
    primary key (order_id, item_id)
);

create table brands(
    brand_id serial primary key,
    brand_name VARCHAR(20) unique not null,
    status VARCHAR(20)
);

create table category(
    cat_id serial primary key,
    cat_name VARCHAR(20) unique not null,
    status VARCHAR(20)
);