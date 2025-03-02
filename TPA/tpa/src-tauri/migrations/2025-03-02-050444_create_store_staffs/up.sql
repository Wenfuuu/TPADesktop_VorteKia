-- Your SQL goes here
CREATE TABLE store_staffs(
    store_id VARCHAR(255),
    staff_id VARCHAR(255),
    PRIMARY KEY (store_id, staff_id),
    FOREIGN KEY (store_id) REFERENCES stores(store_id),
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id)
)