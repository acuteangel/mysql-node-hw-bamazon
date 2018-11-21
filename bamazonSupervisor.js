var inquirer = require("inquirer");
var mysql = require("mysql")
var table = require("table")
var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "password",
    database: "bamazon"
  });

connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId + "\n");
displayOptions();
});  

function displayOptions(){    
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "command"
        }
    ]).then(function(response){
        if (response.command == "View Product Sales by Department"){
            viewProducts();
        }else if (response.command == "Create New Department"){            
            addNewDepartment();
        }
    })
}

function viewProducts(){
    connection.query("SELECT * FROM departments", function(err, res, fields) {
        if (err) throw err;
        var data = [[]];
        console.log("Displaying sales across all departments: ")        
        // Log all results of the SELECT statement
        for (var i=0;i<res.length;i++){
            if (i<4){
                data[0].push(fields[i].name)
            }
            data.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].product_sales-res[i].over_head_costs])            
        }
        data[0].push("total_profit")
        var output = table.table(data);
        console.log(output)
    });
    connection.end()
};

function addNewDepartment(){
    inquirer.prompt([        
        {
            message: "Enter the department name",
            type: "input",
            name: "department"
        },
        {
            message: "Enter the over head costs",
            type: "input",
            name: "costs"
        },
        {
            message: "Enter the product sales",
            type: "input",
            name: "sales"
        }
    ]).then(function(response){
        connection.query(
            'INSERT INTO departments (department_name, over_head_costs, product_sales) VALUES ("'
            +response.department+'", "'+response.costs+'", '+response.sales+")",
        function (err){
            if (err) console.log(err)
            console.log("Department Added!")
            connection.end()
        }
        )
    })
};