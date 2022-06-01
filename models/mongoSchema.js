const mongoose = require('mongoose')
const mongoSchema = mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    pass: {
        type: String,
        required: true
    },
    tokenSave: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('user', mongoSchema)
