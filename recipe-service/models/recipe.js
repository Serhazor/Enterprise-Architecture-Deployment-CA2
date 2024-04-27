const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Optional shortcut

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    } 
});

module.exports = mongoose.model('Recipe', recipeSchema);
