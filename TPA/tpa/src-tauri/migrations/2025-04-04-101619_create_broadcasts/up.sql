-- Your SQL goes here
CREATE TABLE broadcasts(
    broadcast_id VARCHAR(255) PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) REFERENCES customers(customer_id)
)