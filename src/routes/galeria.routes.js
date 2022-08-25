'use strict'

const express = require('express');
const GaleriaController = require('../controladores/galeria.controler');
const router = express.Router();

const { Autenticado } = require('../autenticador/autenticador');

/**RENDER VIEWS **/
router.get('/galeria', Autenticado, GaleriaController.renderGaleria);
router.get('/galeria/create', Autenticado, GaleriaController.renderCreateGaleria);

/** API **/
router.post('/galeria/create', Autenticado, GaleriaController.createGaleria);
router.get('/galeria/edit/:id', Autenticado, GaleriaController.renderEditGaleria);    
router.put('/galeria/edit/:id', Autenticado, GaleriaController.editGaleria);
router.delete('/galeria/delete/:id', Autenticado, GaleriaController.deleteGaleria);

//USERS MOVIL ROUTES
router.get('/api/galery', GaleriaController.getGaleria);
module.exports = router;