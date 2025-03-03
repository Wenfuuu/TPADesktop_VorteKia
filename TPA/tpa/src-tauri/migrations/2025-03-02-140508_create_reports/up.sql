-- Your SQL goes here
CREATE TABLE reports(
    report_id VARCHAR(255) PRIMARY KEY,
    ride_id VARCHAR(255) NOT NULL,
    staff_id VARCHAR(255) NOT NULL, --staff who reports
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id) ON DELETE CASCADE
)