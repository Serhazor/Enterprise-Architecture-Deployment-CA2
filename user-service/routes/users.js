const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// POST /users -  Register a New User
router.post('/users', async (req, res) => {
    console.log("Route hit", req.body);
    try {
        // Remove password hashing for isolation test
        const newUser = new User({ 
            ...req.body
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email
        });
    } catch (err) {
        console.log("Error in route:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// POST /users/login - Simplified Login (NOT production-ready)
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) return res.status(400).json({ error: 'Invalid credentials' }); 

        // Successful login - In a real application, generate a JWT
        res.json({ message: 'Login successful' }); 
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' }); 
    }
});

module.exports = router;
