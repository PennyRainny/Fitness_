const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const dbConnect = require('./Database');
const mssql = require("mssql"); 
const router = express.Router();

// สมัครสมาชิก (Register)

router.post('/register', async (req, res) => {
    console.log('📩 Request Received:', req.body);

    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const pool = await dbConnect(); // ✅ เรียกฟังก์ชัน dbConnect() ก่อนใช้งาน
        const request = pool.request();

        request.input('email', mssql.VarChar, email);
        const checkEmail = await request.query("SELECT Email FROM userinfo WHERE Email = @email");

        if (checkEmail.recordset.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        request.input('firstName', mssql.VarChar, firstName);
        request.input('lastName', mssql.VarChar, lastName);
        request.input('passwordHash', mssql.VarChar, hashedPassword);

        await request.query(`
            INSERT INTO userinfo (FirstName, LastName, Email, PasswordHash) 
            VALUES (@firstName, @lastName, @email, @passwordHash)
        `);

        console.log('✅ Registration Successful');
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error('❌ Register Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// เข้าสู่ระบบ (Login)
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const pool = await dbConnect(); // ✅ ต้องเรียกใช้เป็นฟังก์ชัน ()
        const request = pool.request();

        request.input('email', mssql.VarChar, email); // ✅ กำหนดประเภทของ input

        const result = await request.query("SELECT * FROM userinfo WHERE Email = @email");
        if (result.recordset.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = result.recordset[0];
        const match = await bcrypt.compare(password, user.PasswordHash);

        if (!match) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.json({ message: "Login successful", userID: user.UserID });
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
