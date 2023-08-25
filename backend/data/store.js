const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "auth",
  user: "root",
  password: "1234arsenal",
});

module.exports = pool;
