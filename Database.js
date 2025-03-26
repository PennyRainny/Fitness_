const mssql = require("mssql");
const mysql = require("mysql2");
//const dbConnection = mssql.connect({
const dbConnect = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database : "testdatabase",
}).promise()

module.exports = dbConnect;