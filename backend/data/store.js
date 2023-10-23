const mysql = require("mysql2/promise");
require('dotenv').config(); // Load environment variables from the .env file

const pool = mysql.createPool({
  host: "localhost",
  database: "auth",
  user: "root",
  password: "1234arsenal",
});

module.exports = pool;
