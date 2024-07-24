require("dotenv").config();
var mysql = require('mysql');

// connect to the db
dbConnectionInfo = {
  host: process.env.REACT_APP_DB_HOST,
  user: process.env.REACT_APP_DB_USER,
  password: process.env.REACT_APP_DB_PASSWORD,
  connectionLimit: 5, 
  database: process.env.REACT_APP_DB_DATABASE
};


//create mysql connection pool
var dbconnection = mysql.createPool(
  dbConnectionInfo
);

// Attempt to catch disconnects 
dbconnection.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });

});

module.exports = dbconnection;


// require("dotenv").config();
// const mysql = require("mysql");

// const db = mysql.createPool({
//   connectionLimit : 10,
//   host: process.env.REACT_APP_DB_HOST,
//   user: process.env.REACT_APP_DB_USER,
//   password: process.env.REACT_APP_DB_PASSWORD,
//   database: process.env.REACT_APP_DB_DATABASE,
//   debug    :  false

// });
// // var pool      =    mysql.createPool({    connectionLimit : 10,
// //     host     : process.env.REACT_APP_DB_HOST,
// //     user     : process.env.REACT_APP_DB_USER,
// //     password : process.env.REACT_APP_DB_PASSWORD,
// //     database : process.env.REACT_APP_DB_DATABASE,
// //     debug    :  false
// // });    
 

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL: ", err);
//   } else {
//     console.log("Connected to MySQL database");
//   }
// });

// module.exports = db;


// require("dotenv").config();
// const mysql = require("mysql");

// const db = mysql.createPool({
//   host: process.env.REACT_APP_DB_HOST,
//   user: process.env.REACT_APP_DB_USER,
//   password: process.env.REACT_APP_DB_PASSWORD,
//   // database: process.env.REACT_APP_DB_DATABASE
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL: ", err);
//   } else {
//     console.log("Connected to MySQL database");
//   }
// });

// module.exports = db;