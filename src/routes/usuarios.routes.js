const {Router} = require('express');
const router = Router();
const { 
    putImageMovil,createUserMovil,logIn
,profile
,logInFacebook
} =require('../controladores/usuarios.controler');

    

//USERS MOVIL ROUTES
router.post('/upload', putImageMovil);
router.post('/api/signup', createUserMovil);
router.post('/api/login', logIn);
router.get('/api/profile/:id', profile);
router.post('/api/loginFb', logInFacebook);

module.exports = router;