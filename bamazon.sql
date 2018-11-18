DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ("Necklace", "Jewelry", 5.43, 12),
        ("Women's Windbreaker", "Women's Clothing", 19.99, 160),
        ("False Eyelash set", "Makeup", 14.49, 46),
        ("Pink Hair Dye", "Hair Care", 13.99, 649),
        ("Tank Top", "Clothing", 10.95, 82),
        ("Eyeshadow Palette", "Makeup", 11.00, 350),
        ("Pleated Skirt", "Women's Clothing", 12.88, 70),
        ("Bunny Slippers", "Shoes", 21.99, 26),
        ("Body Lotion", "Skin Care", 29.00, 75),
        ("Leggings", "Women's Clothing", 9.99, 40)
