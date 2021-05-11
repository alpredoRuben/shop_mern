const dotenv = require('dotenv');

const Product = require('../models/Product');
const connectDatabase = require('../config/database');
const {products} = require('./data');

dotenv.config({ path: './rest_api/config/config.env' });

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("All products success created");

    process.exit();
    
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
}