const {Schema, model} = require('mongoose');

const PublicacionSchema = new Schema({
    message: { type: String },
    identificador: { type: String},
    name: { type: String},
    hora: { type: String},
    correo: { type: String},
    likes: { type: Number},
});
module.exports = model('Publicaciones',PublicacionSchema);
