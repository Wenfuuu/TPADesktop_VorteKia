-- Your SQL goes here
CREATE TABLE souvenirs (
    souvenir_id VARCHAR(255) PRIMARY KEY,
    store_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    image BYTEA,
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
);