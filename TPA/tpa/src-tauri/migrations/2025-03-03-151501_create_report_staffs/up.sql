-- Your SQL goes here
CREATE TABLE report_staffs(
    report_id VARCHAR(255),
    staff_id VARCHAR(255),
    PRIMARY KEY(report_id, staff_id),
    FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id) ON DELETE CASCADE
)