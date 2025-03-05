-- Your SQL goes here
CREATE TABLE ride_queues(
    queue_id VARCHAR(255) PRIMARY KEY,
    ride_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
)