// const mysql= require("mysql");

// const Conn= mysql.createConnection({

//     host: "localhost",
//     user: "root",
//     password: "",
//     database:"auction",
//     port: "3306"
// });

// Conn.connect((err)=>{

//     if (err) throw err;
//     console.log("DB connected");
// });

// module.exports=Conn;


const mysql = require('mysql');

const Conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'auction',
  port: '3306'
});

Conn.connect((err) => {
  if (err) throw err;
  console.log('DB connected');
});

module.exports = Conn;