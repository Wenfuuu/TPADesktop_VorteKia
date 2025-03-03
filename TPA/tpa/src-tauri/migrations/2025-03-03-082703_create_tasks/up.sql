-- Your SQL goes here
CREATE TABLE tasks(
    task_id VARCHAR(255) PRIMARY KEY,
    ride_id VARCHAR(255) NOT NULL,
    staff_id VARCHAR(255) NOT NULL, --staff who is assigned
    start_time TIMESTAMP WITHOUT TIME ZONE,
    end_time TIMESTAMP WITHOUT TIME ZONE,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id)
)