CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    task VARCHAR (100),
    date_assigned DATE NOT NULL DEFAULT CURRENT_DATE,
    date_due DATE,
    date_completed DATE,
    complete BOOLEAN DEFAULT FALSE
    );

    INSERT INTO tasks (task, date_due)
    VALUES ('Buy Dog', '5/12/16'),
    ('Feed Dog', '5/14/16'),
    ('Brush Dog', '5/16/2016'),
    ('Wash Hair', '5/24/2016'),
    ('Trim Toenails', '5/25/2016'),
    ('Bring Peace to Middle East', '6/1/2016'),
    ('Eat Lunch', '6/2/2016'),
    ('Sell Dog', '6/4/2016'),
    ('Buy Cat', '6/5/2016'),
    ('Regret Cat', '6/5/2016');
