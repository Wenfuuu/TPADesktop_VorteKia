-- Your SQL goes here
CREATE TABLE reviews(
    review_id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    place_id VARCHAR(255) NOT NULL,
    review VARCHAR(255) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
)