var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "@0Lovinmt",
    database: "employeeDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "chooseData",
            type: "list",
            message: "Would you like to do ?",
            choices: ["View all Employees",
                "View all Employees By Department [IN DEVELOPMENT]",
                "View all Employees By Manager [IN DEVELOPMENT]",
                "Add Employee",
                "Add Roles",
                "Add Departments",
                "Remove Employee [IN DEVELOPMENT]",
                "Update Employee Role [IN DEVELOPMENT]",
                "Update Employee Manager [IN DEVELOPMENT]",
                "View All Roles",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch (answer.chooseData) {
                case "View all Employees":
                    viewEmployee();;
                    break;

                case "View all Employees By Department":
                    // viewAllByDepart();
                    break;

                case "View all Employees By Manager":
                    // viewAllByManager();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Roles":
                    addRoles();
                    break;

                case "Add Departments":
                    addDepartments();
                    break;

                case "Remove Employee":
                    // removeEmployee();
                    break;

                case "Update Employee Role":
                    // updateEmployee();
                    break;

                case "Update Employee Role":
                    // updateEmployee();
                    break;

                case "View All Roles":
                    viewRole();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}

// function to handle posting new items up for auction
function addRoles() {
    // prompt for info about the item being put up for auction
    let departments = []
    connection.query("select * from department", function(err, res) {
        res.forEach((item) => {
            console.log(item)
            departments.push({ name: item.name, value: item.id })
        });
        inquirer
            .prompt([{
                    name: "role",
                    type: "list",
                    message: "What role would you like to add ?",
                    choices: ["Sales Lead",
                        "Sales Person",
                        "Lead Engineer",
                        "Software Engineer",
                        "Account Manager",
                        "Accountant",
                        "Legal Team Lead"
                    ]
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary of this role ?",
                },
                {
                    name: "department",
                    type: "list",
                    message: "Which department does this role belong to ?",
                    choices: departments
                }
            ])
            .then(function(answer) {
                // when finished prompting, insert a new item into the db with that info
                console.log(answer.department)
                connection.query(
                    "INSERT INTO role SET ?", {
                        title: answer.role,
                        salary: answer.salary,
                        department_id: answer.department
                    },
                    function(err) {
                        if (err) throw err;
                        start();
                    }
                );
            });
    });
}


function addDepartments() {
    // prompt for info about waht he wants to add (department, role, or employee)
    inquirer
        .prompt([{
            name: "department",
            type: "input",
            message: "Enter a department you want to add :"
        }])
        .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?", {
                    name: answer.department,
                },
                function(err) {
                    if (err) throw err;
                    console.log("Department Added !");
                    start();
                }
            );
        });
}


function addEmployee() {
    // prompt for info about waht he wants to add (department, role, or employee)
    let roles = []
    let employees = []
    connection.query('select * from role', function(err, res) {
        // console.log(res);
        res.forEach((item) => {
            roles.push({ name: item.title, value: item.id })
        });
        // console.log(roles)
        connection.query('select * from employee', function(err, res) {
            res.forEach((item) => {
                employees.push({ name: `${item.first_name} ${item.last_name}`, value: item.id })
            });
            employees.push({ name: 'none', value: null })
            console.log(employees)
            inquirer
                .prompt([{
                        name: "employeeFirstName",
                        type: "input",
                        message: "What is the employee's first name ?"
                    },
                    {
                        name: "employeeLastName",
                        type: "input",
                        message: "What is the employee's last name ?"
                    },
                    {
                        name: "employeeRoleId",
                        type: "list",
                        message: "What is the employee's role ?",
                        choices: roles
                    },
                    {
                        name: "employeeManagerId",
                        type: "list",
                        message: "What is the manager of this employee?",
                        choices: employees
                    }
                ])
                .then(function(answer) {
                    // when finished prompting, insert a new employee into the db with that info
                    connection.query(
                        "INSERT INTO employee SET ?", {
                            first_name: answer.employeeFirstName,
                            last_name: answer.employeeLastName,
                            role_id: answer.employeeRoleId,
                            manager_id: answer.employeeManagerId,
                        },
                        function(err) {
                            if (err) throw err;
                            console.log("Employee Added !");
                            start()
                        }
                    );
                });
        })
    })
}

function viewEmployee() {
    console.log('\n')
    var query = "SELECT * FROM employee";
    connection.query(query, function(err, res) {
        if (err) throw err;
        res.forEach((item) => {
            console.log("Employee id: " + item.id + " | Employee name: " + item.first_name, item.last_name + " | Role ID: " + item.role_id + " | Employee manager ID: " + item.manager_id)
        });
        console.log('\n')
        start();
    });
};

function viewRole() {
    console.log('\n')
    var query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
        if (err) throw err;
        res.forEach((item) => {
            console.log("Role id: " + item.id + " | Role title: " + item.title + " | Salary: " + item.salary + " | Role department ID: " + item.department_id)
        });
        console.log('\n')
        start();
    });
};