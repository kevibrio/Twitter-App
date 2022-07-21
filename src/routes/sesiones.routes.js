const { Router} = require('express');
const router = Router();

const admin = require("../modelos/administrador");
const { renderLogin,
        SigIn,
        renderRegistro,
        renderMenu,
        logOut
 } = require('../controladores/sesiones.controler');

const { Autenticado } = require('../helper/autenticador');

router.get('/', renderLogin );

router.get( '/login',renderLogin);
router.post( '/login', SigIn, function (req, res) {
    res.cookie('email',req.user.email.split('@')[0]+req.user.email.split('@')[1]);
    let amigosArr = ''
    req.user.amigos.forEach(element => {
        amigosArr += element.split('@')[0]+element.split('@')[1]+'%24'
    });
    res.cookie('amigos',amigosArr.substring(0,amigosArr.length-3));
    res.redirect('/menu');
});

router.get('/registrop', renderRegistro);
router.get('/menu', renderMenu);

router.get('/LogOut',logOut);

module.exports = router;