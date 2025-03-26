const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnect = require('./Database');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // รองรับ JSON จาก Mobile App

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 3600 * 1000, // 1 ชั่วโมง
}));

// เรียกใช้ Routes
app.use('/api/auth', require('./routes/auth'));

// Server Start
app.listen(3000, () => console.log("Server is running on port 3000"));
