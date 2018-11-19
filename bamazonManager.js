var inquirer = require("inquirer");
var mysql = require("mysql")
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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "command"
        }
    ]).then(function(response){
        if (response.command == "View Products for Sale"){
            viewProducts();
        }else if (response.command == "View Low Inventory"){
            viewLowInv();
        }else if (response.command == "Add to Inventory"){
            addToInv();
        }else if (response.command == "Add New Product"){
            addNewProduct();
        }
    })
}

function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("Displaying all available products: ")        
        // Log all results of the SELECT statement
        for (var i=0;i<res.length;i++){
            var item = res[i];        
            console.log("Item ID: "+item.item_id)
            console.log("Product Name: "+item.product_name)
            console.log("Price: $"+item.price)
            console.log("Quantity: "+item.stock_quantity)
            console.log("-----------------")                        
        }
    });
    connection.end()
};

function viewLowInv(){
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        console.log("Displaying all products with quantity less than 5: ")        
        // Log all results of the SELECT statement
        for (var i=0;i<res.length;i++){
            var item = res[i];
            console.log("Item ID: "+item.item_id)
            console.log("Product Name: "+item.product_name)
            console.log("Price: $"+item.price)
            console.log("Quantity: "+item.stock_quantity)
            console.log("-----------------")                         
        }
    });
    connection.end()
};

function addToInv(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Please give the ID of the product you would like to buy",
                validate: function(input){
                   if (parseInt(input) <= res.length && parseInt(input) > 0){
                       return true;
                   }
                   console.log("\nPlease input a number from 1 to "+res.length)
                   return false;
                },
                name: "ID"
            },
            {
                type: "input",
                message: "How many would you like to add?",
                name: "quantity"            
            }
        ]).then(function(response){
            var id = parseInt(response.ID)            
            var stock = res[id-1].stock_quantity
            var quantity = parseInt(response.quantity);
            stock += quantity;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: stock
                  },
                  {
                    item_id: id
                  }
                ],
                function(err) {                        
                    if (err) console.log(err)
                    console.log("Your new stock quantity is "+ stock);
                    connection.end()
                })
        })
    });
    
};

function addNewProduct(){
    inquirer.prompt([
        {
            message: "Enter the product name",
            type: "input",
            name: "product"
        },
        {
            message: "Enter the department name",
            type: "input",
            name: "department"
        },
        {
            message: "Enter the product price",
            type: "input",
            name: "price"
        },
        {
            message: "Enter the quantity",
            type: "input",
            name: "quantity"
        }
    ]).then(function(response){
        connection.query(
            'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("'
            +response.product+'", "'+response.department+'", '+response.price+', '+response.quantity+")",
        function (err){
            if (err) console.log(err)
            console.log("Product Added!")
            connection.end()
        }
        )
    })
};