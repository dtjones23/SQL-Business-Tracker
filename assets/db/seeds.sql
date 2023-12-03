-- Inserts the names of department into department table
INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");
       

-- Inserts role of employee into role table
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 100000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3);

-- Inserts employee information into employee table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Eddie", "Mumbie", 1, null),
       ("Lady", "Green", 2, null),
       ("Billy", "Badahh", 3, null),
       ("Lou", "William", 4, 2),
       ("Ellie", "May", 2, null),
       ("Genie", "Garner", 4, null),
       ("Leroy", "Grant", 1, null),
       ("Freddie", "Claboni", 3, 3);


