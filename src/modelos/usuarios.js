const {Schema, model} = require('mongoose');    
const bcrypt = require('bcrypt');
const UsuarioSchema = new Schema({
    nombre:     { type: String, required: true },
    ruc:        { type: String, required: true },
    email:      { type: String, required: true },
    password: { type: String, required: true },
    cuenta: String,  
    direccion: String,
    telefono: String,
    img: String,
    categoria: String,
    estado: String
});

module.exports = model('Usuarios',UsuarioSchema);