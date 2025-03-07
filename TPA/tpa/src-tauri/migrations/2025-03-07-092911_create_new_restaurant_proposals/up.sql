-- Your SQL goes here
CREATE TABLE new_restaurant_proposals(
    proposal_id VARCHAR(255) PRIMARY KEY,
    staff_id VARCHAR(255) NOT NULL,
    restaurant_name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    image BYTEA NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id) ON DELETE CASCADE
)