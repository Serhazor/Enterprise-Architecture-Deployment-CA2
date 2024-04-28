const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

mongoose.set('strictQuery', false); 
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));

// Create Express App
const app = express();

// Essential Middleware
app.use(express.json()); // Parses incoming JSON request bodies

// Import Routes
const recipesRouter = require('./routes/recipes');

// Mount Routes
app.use('/recipes', recipesRouter);

// Start the Server
const port = process.env.PORT || 8080; 
app.listen(port, () => {
    console.log(`Recipe Service listening on port ${port}`);
});
