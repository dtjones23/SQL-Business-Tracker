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

// Gives users options
async function init() {
    try {

        // prompts users to make selection
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
        // will call the corresponding function
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
            // case 'Add A Department':
            //     addDepartment();
            //     break;
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

// executes a SQL query to select all departments from the table
function viewAllDepartments() {
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err ;
        console.log('Viewing All Departments');
        console.table(result, ['name'])
    })
}

// executes a SQL query to select all roles from the table
function viewAllRoles() {
    db.query(`SELECT * FROM role`, (err, result) => {
        if (err) throw err ;
        console.log('Viewing All Roles');
        console.table(result, ['title', 'salary', 'department_id'])
    })
}

// executes a SQL query to select all employees from the table
function viewAllEmployees() {
    db.query(`SELECT * FROM employees`, (err, result) => {
        if (err) throw err ;
        console.log('Viewing All Employees');
        console.table(result, ['first_name', 'last_name', 'role_id', 'manager_id'])
    })
}
init()