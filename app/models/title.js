// import dependencies
const mongoose = require('mongoose')


const titleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    length: {
        type: Number
    },
    federation: {
        type: String,
        enum: ['WWE', 'WWF', 'WCW', 'ECW', 'AEW', 'NJPW', 'Wrestling Fed.'],
        default: 'Wrestling Fed.'
    }
}, { timestamps: true })

module.exports = titleSchema