CREATE TABLE assy(
    id SERIAL PRIMARY KEY,
    designation VARCHAR(255),
    name VARCHAR(255),
    parent_id INTEGER
);

CREATE TABLE part(
    id SERIAL PRIMARY KEY,
    designation VARCHAR(255),
    name VARCHAR(255),
    material VARCHAR(255),
    assy_id INTEGER,
    FOREIGN KEY (assy_id) REFERENCES assy (id)
);