-- Your SQL goes here
CREATE TABLE restaurant_staffs (
    restaurant_id VARCHAR(255),
    staff_id VARCHAR(255),
    PRIMARY KEY (restaurant_id, staff_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id),
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id)
);