const helpers = {};

helpers.Autenticado = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg','Usuario no Autorizado, debes logear primero para ver esta pagina!');
};

helpers.verifyToken = (req, res, next) => {
    const userToken = req.get('x-token') || ''; //to get any header

    Token.checkToken( userToken )
        .then( decoded => {
            req.user = decoded.user;
            next();
        }).catch( err => {
            res.status(404).send({
                ERROR: err,
                MESSAGE: 'TOKEN NO ES CORRECTO'
            });
        });
};

module.exports = helpers;
