-- Your SQL goes here
CREATE TABLE menus(
    menu_id VARCHAR(50) PRIMARY KEY,
    restaurant_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    image BYTEA,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
)