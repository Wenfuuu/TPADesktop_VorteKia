-- Your SQL goes here
CREATE TABLE stores(
    store_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    opening_hours TIME NOT NULL,
    closing_hours TIME NOT NULL,
    status VARCHAR(255) NOT NULL,
    image BYTEA
)