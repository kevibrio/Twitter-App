const {Router} = require('express');
const router = Router();

const {
    createAdministrador,
    verificandoAdministrador
} =require('../controladores/admin.controler');

//renderizar las pantallas
//agregar      
router.post('/administrador/add',createAdministrador);
router.get('/verificandoAdministrador',verificandoAdministrador);


module.exports = router;