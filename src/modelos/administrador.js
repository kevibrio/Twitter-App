const {Schema, model} = require('mongoose');
const bcrip = require('bcryptjs');

 const AdminSchema = new Schema({
    email:     { type: String, required: true, unique: true},
    name:     { type: String, required: true},
    contrasena: { type: String, required: true},
    amigos: [{type: String}],
    confirmacion: {type: Boolean}
});

AdminSchema.methods.encriptarPass = async contrasena => {
    const salt = await bcrip.genSalt(10);
    return await bcrip.hash(contrasena, salt);
};


module.exports = model('Administrador',AdminSchema);