-- Your SQL goes here
CREATE TABLE maintenance_logs(
    log_id VARCHAR(255) PRIMARY KEY,
    staff_id VARCHAR(255) NOT NULL,
    report_id VARCHAR(255) REFERENCES reports(report_id),
    task_id VARCHAR(255) REFERENCES tasks(task_id),
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id) ON DELETE CASCADE
)