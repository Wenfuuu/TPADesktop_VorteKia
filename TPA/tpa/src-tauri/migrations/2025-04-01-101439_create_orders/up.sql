-- Your SQL goes here
CREATE TABLE orders(
    order_id VARCHAR(255) PRIMARY KEY,
    restaurant_id VARCHAR(255) NOT NULL,
    menu_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255) REFERENCES staffs(staff_id), --assigned staff
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(menu_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
)