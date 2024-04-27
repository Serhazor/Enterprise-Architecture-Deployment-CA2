const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe'); 

// Placeholder Authentication (INSECURE) - Replace for production
router.use((req, res, next) => {
    req.user = { id: 'placeholder-user-id' }; 
    next();
});

// POST /recipes - Create a new Recipe
router.post('/recipes', async (req, res) => {
    try {
        const newRecipe = new Recipe({ ...req.body, createdBy: req.user.id });
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

// GET /recipes - Fetch all Recipes (Simplified)
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find(); 
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching recipes' }); 
    }
});

// GET /recipes/:id - Fetch a Recipe by ID
router.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' }); 
        res.json(recipe);
    } catch (err) {
        if (err.name === 'CastError') { 
            res.status(400).json({ error: 'Invalid recipe ID' }); 
        } else {
            res.status(500).json({ error: 'Error fetching recipe' }); 
        }
    }
});

module.exports = router; 
