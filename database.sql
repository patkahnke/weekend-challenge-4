CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task VARCHAR (100),
    date_assigned DATE NOT NULL DEFAULT CURRENT_DATE,
    date_due DATE,
    date_completed DATE
    );
