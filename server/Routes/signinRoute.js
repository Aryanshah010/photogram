const express=require('express');
const bcrypt = require('bcrypt');
const { findUserByEmail } = require('../Model/signinModel');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if email exists
        const existingUser = await findUserByEmail(email);
        if (existingUser.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = existingUser.rows[0];
        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }
         // Generate a JWT
        const token = generateToken(user.id); // Only pass the user ID to the token
        res.status(200).json({ message: 'Sign in successful' ,token,userId:user.id});
        
    } catch (error) {
        console.error('Error during sign in:', error.message);
        res.status(500).json({ message: 'Server Error' });
    
    }
        
    });
module.exports=router;