require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.REACT_APP_DB_HOST,
  user: process.env.REACT_APP_DB_USER,
  password: process.env.REACT_APP_DB_PASSWORD,
  // database: process.env.REACT_APP_DB_DATABASE
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
