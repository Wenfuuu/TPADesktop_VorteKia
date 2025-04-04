-- Your SQL goes here
CREATE TABLE store_transactions(
    transaction_id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    store_id VARCHAR(255) NOT NULL,
    souvenir_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    total INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE,
    FOREIGN KEY (souvenir_id) REFERENCES souvenirs(souvenir_id) ON DELETE CASCADE
)