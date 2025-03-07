-- Your SQL goes here
CREATE TABLE ride_transactions (
    transaction_id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    ride_id VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE CASCADE
);