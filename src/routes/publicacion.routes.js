const {Router} = require('express');
const router = Router();

const { 
    createPost,
    getPublicaciones
    ,ordenados
    ,getAllLikes
    ,getNotLikes
    ,putShares
    ,delLikes
    ,putLikes
} =require('../controladores/publicacion.controler');


//agregar
router.post('/publicacion/add',createPost );  
//USERS MOVIL ROUTES
router.get('/api/publicaciones', getPublicaciones);
router.get('/api/ordenados', ordenados)
router.post('/api/publicacionesLikes', getAllLikes);
router.post('/api/publicacionesNotLikes', getNotLikes);
router.post('/api/share',putShares)
router.post('/api/delLikes', delLikes);
router.post('/api/postLikes', putLikes);


module.exports = router;