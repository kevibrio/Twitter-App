'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImagenSchema = Schema({
    filename: {
        type:String
    },
    originalName: {
        type:String
    },
    desc: {
        type:String
    },
    created: {
        type:Date,
        default: Date.now,
    },
   
});

module.exports = mongoose.model('Imagen', ImagenSchema);