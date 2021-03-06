const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtikelPost = new Schema({
    title:{
        type: String,
        required:true,
    },
    body: {
        type: String,
        required: true,
    },
    image:{
        type: Object,
        required: true,
    },
    author: {
        type: Object,
        required: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('ArtikelPost',ArtikelPost)