const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 

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
app.use(express.json()); 

// Import Routes
const usersRouter = require('./routes/users'); 

// Mount Routes
app.use('/users', usersRouter); 

// Start the Server
const port = process.env.PORT || 8081; 
app.listen(port, () => {
    console.log(`User Service listening on port ${port}`);
});
