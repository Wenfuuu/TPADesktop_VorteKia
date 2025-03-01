-- Your SQL goes here
CREATE TABLE lostandfounditems(
    item_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    item_type VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    last_seen_location VARCHAR(255) NOT NULL,
    found_location VARCHAR(255),
    owner VARCHAR(255) NOT NULL,
    finder VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    image BYTEA
)