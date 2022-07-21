const publicacionCtrl = {}
var express = require('express');
var router = express.Router();
const app = express();
const Publicacion = require('../modelos/publicacion');
const axios  = require('axios');
publicacionCtrl.crearPublicacion = async (req, res) => {
    const {titulo,mensaje,hora,correo} = req.body;
const new_message = await new Publicacion();
new_message.message = await message;
new_message.hora = await hora;
new_message.identificador = await identificador;
new_message.usuario = await usuario;
await new_message.save().then(res => {
});
res.send(new_message);
};

publicacionCtrl.showHistory = async (req, res) => {

};

publicacionCtrl.showHistory = async (req, res) => {
    
};


module.exports = publicacionCtrl;