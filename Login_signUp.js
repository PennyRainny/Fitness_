const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const dbConnect = require('../Database');
const router = express.Router();

// สมัครสมาชิก (Register)
router.post('/register', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
        const [rows] = await dbConnect.execute("SELECT Email FROM userinfo WHERE Email = ?", [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await dbConnect.execute("INSERT INTO userinfo (FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?)", 
            [firstName, lastName, email, hashedPassword]);

        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
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
        const [rows] = await dbConnect.execute("SELECT * FROM userinfo WHERE Email = ?", [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.Password);

        if (!match) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.json({ message: "Login successful", userID: user.UserID });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
