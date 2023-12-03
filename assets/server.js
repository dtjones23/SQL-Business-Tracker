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