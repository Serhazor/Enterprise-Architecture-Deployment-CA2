const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users'); // Adjust the path as necessary
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// User routes
app.use('/users', usersRouter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));

// Conditional server start
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 8081;
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = app; // Export for testing
