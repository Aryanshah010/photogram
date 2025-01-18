const express = require('express');
const { createUser, findUserByEmail } = require('../Model/signupModel');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the user
        const result = await createUser(name, email, hashedPassword);
        res.status(201).json({ message: 'User created successfully', userId: result.rows[0].id });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
