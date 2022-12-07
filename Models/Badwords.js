const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    word: String,
    severity: Number
})

module.exports = mongoose.model('Badwords', userSchema);