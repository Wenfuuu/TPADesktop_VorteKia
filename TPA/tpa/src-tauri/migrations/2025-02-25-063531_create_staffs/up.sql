-- Your SQL goes here
CREATE TABLE staffs(
    staff_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
)