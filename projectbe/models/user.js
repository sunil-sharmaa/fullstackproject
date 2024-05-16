const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name: {
        require: true,
        type: String,
        lowercase: true
    },
    email: {
        require: true,
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        require: true,
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const User = mongoose.model('User',schema)
module.exports = User