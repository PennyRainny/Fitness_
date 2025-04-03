const mssql = require("mssql");

const dbConnect = async () => {
  try {
    const pool = await mssql.connect({
      user: "konglovecpe",     // เปลี่ยนเป็น username ของคุณ
      password: "0881795204konG", // เปลี่ยนเป็น password ของคุณ
      server: "konglovecpe.database.windows.net",      // หรือ server ที่คุณใช้งาน
      database: "FITNESS451", // ชื่อ database ที่จะเชื่อมต่อ
      options: {
        encrypt: true, 
        trustServerCertificate: false, 
      },
    });
    console.log("Connected to MSSQL database!");
    return pool;
  } catch (err) {
    console.error("Database connection failed: ", err);
    throw err;
  }
};

module.exports = dbConnect;

/*const mssql = require("mssql");
const mysql = require("mysql2");
//const dbConnection = mssql.connect({
const dbConnect = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database : "testdatabase",
}).promise()

module.exports = dbConnect;*/

