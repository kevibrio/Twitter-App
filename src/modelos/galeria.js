'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GaleriaSchema = Schema({
    codigo: {
        required:true,
        type:String
    },
    nombre: {
        required:true,
        type:String
    },
    descripcion: {
        required:true,
        type:String
    },
    img: {
        required:true,
        type:String
    }
});

module.exports = mongoose.model('Galeria', GaleriaSchema);