-- Your SQL goes here
CREATE TABLE restaurant_transactions(
    transaction_id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    menu_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    total INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
)