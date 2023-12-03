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
    password: '',
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
            // case 'Add A Role':
            //     addRole();
            //     break;
            // case 'Add An Employee':
            //     addEmployee()
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
    } catch (err) {
        console.error('Error viewing all departments', err);
    }
}

// Executes a SQL query to select all roles from the table
async function viewAllRoles() {
    try {
        const result = await queryDatabase(`SELECT * FROM role`)
        console.log('Viewing All Roles');
        console.table(result, ['title', 'salary', 'department_id'])
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
        const {name} = addDepartment;

        // Executes a query to insert a new department into the table
        await queryDatabase('INSERT INTO department (name) VALUES (?)', [name]);

        // log a successful
        console.log(`Added ${name} to the employee database`);
        console.table({name})
    } catch (err) {
        console.error('Error adding department', err.message);
    }   
}
init()