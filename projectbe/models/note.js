const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    tag: {
        type: String,
        default: "everything is depends on practise"
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Note = mongoose.model('Note', schema);
module.exports = Note