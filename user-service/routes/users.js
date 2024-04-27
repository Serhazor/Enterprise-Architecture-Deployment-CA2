const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Create a User (Registration)
router.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword });
        const savedUser = await newUser.save();

        res.status(201).json({
            _id: savedUser._id, 
            name: savedUser.name,
            email: savedUser.email
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message });
        } else if (err.code === 11000) { 
            res.status(400).json({ error: 'Email already exists' }); 
        } else {
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
});

// User Login (Basic)
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' }); 

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' }); 

        res.json({ message: 'Login successful' }); 
    } catch (err) {
        res.status(500).json({ error: 'Error logging in' }); 
    }
});

// Get User Profile
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' }); 

        // Send back only necessary profile data
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            dietaryPreferences: user.dietaryPreferences,
            profilePicture: user.profilePicture // If you have this field
        });
    } catch (err) {
        if (err.name === 'CastError') { 
            res.status(400).json({ error: 'Invalid user ID' }); 
        } else {
            res.status(500).json({ error: 'Error fetching user profile' });
        }
    }
});

module.exports = router;