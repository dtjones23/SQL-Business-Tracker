// npm init -y
// npm i inquirer@8.2.4
// npm i mysql2
const mysql = require('mysql2') // Interacts with the MySQL database
const inquirer = require('inquirer') // Used for prompt questions

// Centralize database configuration
const dbConfig = {
    host: 'localhost',
    // MySQL username
    user: 'root',
    // MySQL password here
    password: 'Purplemaniandino23!',
    database: 'employee_db'
};

// Create a mySQL connection using the configuration
const db = mysql.createConnection(dbConfig);

// Promisify the query method for async/await support
const queryDatabase = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Gives users options
async function init() {
    try {
        console.log(`............................`);
        console.log('')
        console.log(`WELCOME TO EMPLOYEE TRACKER.`);
        console.log('')
        console.log(`............................`);

        // Prompts users to make selection
        const options = await inquirer.prompt([
            {
                type: 'list',
                name: 'duty',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add A Department',
                    'Add A Role',
                    'Add An Employee',
                    'Update An Employee Role']
            }
        ]);
        // Will call the corresponding function
        switch (options.duty) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add A Department':
                addDepartment();
                break;
            case 'Add A Role':
                addRole();
                break;
            case 'Add An Employee':
                addEmployee();
                break;
            case 'Update An Employee Role':
                updateEmployeeRole();
                break;
        }

    } catch (error) {
        console.error('Error querying the database: ', error)
    }
}

// Executes a SQL query to select all departments from the table
async function viewAllDepartments() {
    try {
        const result = await queryDatabase(`SELECT * FROM department`)
        console.log('Viewing All Departments');
        console.table(result, ['name'])
        return init()
    } catch (err) {
        console.error('Error viewing all departments', err);
    }
}

// Executes a SQL query to select all roles from the table
async function viewAllRoles() {
    try {
        const rolesData = await queryDatabase(`SELECT role.*, department.name AS department_name FROM role INNER JOIN department ON role.department_id = department.id`);

        const roles = rolesData.map(role => ({
            title: role.title,
            salary: role.salary,
            department: role.department_name,
        }));

        console.log('Viewing All Roles');
        console.table(roles, ['title', 'salary', 'department']);
        return init();
    } catch (err) {
        console.error('Error viewing all roles', err);
    }
}

// Executes a SQL query to select all employees from the table
async function viewAllEmployees() {
    try {
        const result = await queryDatabase(`SELECT * FROM employees`)
        console.log('Viewing All Employees');
        console.table(result, ['first_name', 'last_name', 'role_id', 'manager_id'])
        return init()
    } catch (err) {
        console.error('Error viewing all employees', err);
    }
}

// Executes a SQL query to add a new department
async function addDepartment() {
    try {
        // Users prompted to enter a new department
        const addDepartment = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter a department name',

                // ensures the user will input a department name
                validate: (input) => (input ? true : 'Department name is required')
            }
        ]);

        // Extracts the department name from the user input
        const { name } = addDepartment;

        // Executes a query to insert a new department into the table
        await queryDatabase(`INSERT INTO department (name) VALUES (?)`, [name]);

        // Log a successful addition to department
        console.log(`Added ${name} to the employee database`);
        console.table({ name })
        return init()
    } catch (err) {
        console.error('Error adding department', err.message);
    }
}

// Function to add new role to the database
async function addRole() {
    try {

        // Get all departments from table
        const department = await queryDatabase(`SELECT * FROM department`);

        // Users prompted to enter information for new role 
        const roleDetails = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:',
                validate: (input) => (input ? true : 'Title is required')
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:',
                validate: (input) => (!isNaN(input) && input > 0 ? true : 'Please enter a valid salary')
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the role:',

                // Iterates over all elements in department --> executed arrow function will display a name and value thats represented by that department. Array choices is then used as the options for "Select the department for the role" 
                choices: department.map(department => ({
                    name: `${department.id} - ${department.name}`,
                    value: department.id
                }))
            }
        ]);

        // Insert the new role into the database
        await queryDatabase(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [
            roleDetails.title,
            roleDetails.salary,
            roleDetails.department_id
        ]);

        // Logs successful addition to role
        console.log(`Added ${roleDetails.title} to the roles in the employee database`);
        return init()
    } catch (error) {
        console.error('Error adding role: ', error.message);
    }
}
// Function to add a new employee
async function addEmployee() {
    try {
        const department = await queryDatabase('SELECT * FROM department');

        const basicEmployeeDetails = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter first name',
                validate: (input) => (input ? true : 'First name is required'),
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter last name',
                validate: (input) => (input ? true : 'Last name is required'),
            },
            {
                type: 'confirm',
                name: 'hasRole',
                message: 'Do you want to assign a role to this employee?',
                default: true,
            },
        ]);

        let employeeDetails = {};

        if (basicEmployeeDetails.hasRole) {
            const roles = await queryDatabase('SELECT id, title FROM role');
            const selectedRole = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the role for the employee:',
                    choices: roles.map((role) => ({
                        name: `${role.id} - ${role.title}`,
                        value: role.id,
                    })),
                },
            ]);

            employeeDetails = { ...selectedRole };
        }

        const manager_id = null; // Assuming you want to set the manager_id to null for simplicity

        // Insert the new employee into the database
        await queryDatabase(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [basicEmployeeDetails.first_name, basicEmployeeDetails.last_name, employeeDetails.role_id, manager_id]
        );

        console.log(`Added ${basicEmployeeDetails.first_name} ${basicEmployeeDetails.last_name} to the employee database`);
    } catch (error) {
        console.error('Error adding employee: ', error.message);
    }
}

// Function to update an employee's role
async function updateEmployeeRole() {
    try {
        // Get all employees from the database
        const employees = await queryDatabase('SELECT id, first_name, last_name FROM employees');

        // Prompt user to select an employee to update
        const employeeToUpdate = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employees.map(employee => ({
                    name: `${employee.id} - ${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            }
        ]);

        // Get all roles from the database
        const roles = await queryDatabase('SELECT id, title FROM role');

        // Prompt user to select a new role for the employee
        const newRole = await inquirer.prompt([
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the new role for the employee:',
                choices: roles.map(role => ({
                    name: `${role.id} - ${role.title}`,
                    value: role.id
                }))
            }
        ]);

        // Update the employee's role in the database
        await queryDatabase('UPDATE employees SET role_id = ? WHERE id = ?', [
            newRole.role_id,
            employeeToUpdate.employee_id
        ]);

        console.log(`Updated employee's role in the database`);
        return init()
    } catch (error) {
        console.error('Error updating employee role: ', error.message);
    }
}
init()


