-- Your SQL goes here
CREATE TABLE store_removal_proposals (
    proposal_id VARCHAR(255) PRIMARY KEY,
    store_id VARCHAR(255) NOT NULL,
    staff_id VARCHAR(255) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id) ON DELETE CASCADE
);