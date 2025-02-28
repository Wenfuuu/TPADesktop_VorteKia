-- Your SQL goes here
CREATE TABLE restaurants(
    restaurant_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuisine_type VARCHAR(50) NOT NULL,
    opening_hours TIME NOT NULL,
    closing_hours TIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    image BYTEA
)