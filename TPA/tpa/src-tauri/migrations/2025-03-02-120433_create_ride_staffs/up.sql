-- Your SQL goes here
CREATE TABLE ride_staffs (
    ride_id VARCHAR(255),
    staff_id VARCHAR(255),
    PRIMARY KEY (ride_id, staff_id),
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id),
    FOREIGN KEY (staff_id) REFERENCES staffs(staff_id)
);