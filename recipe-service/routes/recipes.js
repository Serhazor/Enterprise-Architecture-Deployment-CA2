const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe'); 
const User = require('../models/userModel'); 

// Get All Recipes 
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a Single Recipe by ID
router.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (err) {
        // Check for invalid ObjectIDs
        if (err.name === 'CastError') { 
            return res.status(400).json({ error: 'Invalid recipe ID' });
        } 
        res.status(500).json({ error: err.message });
    }
});

// Create a New Recipe
router.post('/recipes', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe); 
    } catch (err) {
        if (err.name === 'ValidationError') { 
            res.status(400).json({ error: err.message }); 
        } else {
            res.status(500).json({ error: 'Failed to create recipe' });
        }
    }
});

// Update a Recipe by ID
router.put('/recipes/:id', async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(updatedRecipe);
    } catch (err) {
        if (err.name === 'CastError') { 
            return res.status(400).json({ error: 'Invalid recipe ID' }); 
        } else if (err.name === 'ValidationError') { 
            res.status(400).json({ error: err.message }); 
        } else {
            res.status(500).json({ error: 'Failed to update recipe' });
        }
    }
});

// Delete a Recipe by ID
router.delete('/recipes/:id', async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) {
            return res.status(404).json({ error: 'Recipe not found' }); 
        }
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        if (err.name === 'CastError') { 
            return res.status(400).json({ error: 'Invalid recipe ID' }); 
        } 
        res.status(500).json({ error: 'Failed to delete recipe' }); 
    }
});

module.exports = router;
