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
displayProduct();
});
var choices = []

function displayProduct(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("Displaying all available products: ")        
        // Log all results of the SELECT statement
        for (var i=0;i<res.length;i++){
            var item = res[i];
            if (item.stock_quantity > 0){
                console.log("Item ID: "+item.item_id)
                console.log("Product Name: "+item.product_name)
                console.log("Price: $"+item.price)
                console.log("-----------------")
                choices.push(item)
            } 
            
        }
        purchaseProduct(res.length);
    });
}

  function purchaseProduct(arr){
    inquirer.prompt([
        {
            type: "input",
            message: "Please give the ID of the product you would like to buy",
            validate: function(input){
               if (parseInt(input) <= arr && parseInt(input) > 0){
                   return true;
               }
               console.log("\nPlease input a number from 1 to "+arr)
               return false;
            },
            name: "ID"
        },
        {
            type: "input",
            message: "How many would you like to purchase?",
            name: "quantity"            
        }
    ]).then(function(response){
        connection.query("SELECT * FROM products WHERE ?",[{item_ID: response.ID}], function(err, res) {
            if (err) throw err;
            var purchased = parseInt(response.quantity);
            var stock = res[0].stock_quantity;
            if (purchased > stock){
                console.log("We do not have that many available for purchase.")
            } else {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: stock - purchased
                      },
                      {
                        item_id: response.ID
                      }
                    ],
                    function(err, resp) {                        
                        if (err) console.log(err)
                        if (resp) console.log(resp)
                        console.log("Your purchase cost $"+(purchased * res[0].price));
                    })
            }
            connection.end();
          });
    })
  }