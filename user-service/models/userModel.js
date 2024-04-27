const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    dietaryPreferences: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now 
    } 
});

// Hash password before saving 
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next(); // Only hash if the password is new or modified

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err); 
    }
});

module.exports = mongoose.model('User', userSchema);
