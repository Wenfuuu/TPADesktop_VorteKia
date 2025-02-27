-- Your SQL goes here
CREATE TABLE lostandfounditems(
    item_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    last_seen_location VARCHAR(50) NOT NULL,
    found_location VARCHAR(50),
    owner VARCHAR(50) NOT NULL,
    finder VARCHAR(50),
    status VARCHAR(50) NOT NULL
)