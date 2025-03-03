-- Your SQL goes here
CREATE TABLE maintenances(
    maintenance_id VARCHAR(255) PRIMARY KEY,
    ride_id VARCHAR(255) NOT NULL,
    staff_id VARCHAR(255) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id) ON DELETE CASCADE
)