-- Your SQL goes here
CREATE TABLE tasks(
    task_id VARCHAR(255) PRIMARY KEY,
    ride_id VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255) NOT NULL, --staff to be assigned
    start_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (assigned_to) REFERENCES staffs(staff_id)
)