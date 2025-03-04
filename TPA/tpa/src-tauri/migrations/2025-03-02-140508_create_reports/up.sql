-- Your SQL goes here
CREATE TABLE reports(
    report_id VARCHAR(255) PRIMARY KEY,
    ride_id VARCHAR(255) NOT NULL,
    reported_by VARCHAR(255) NOT NULL, --staff who reports
    assigned_to VARCHAR(255) REFERENCES staffs(staff_id), --assigned staff
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES staffs(staff_id) ON DELETE CASCADE
)