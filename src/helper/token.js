const  jwt  =  require('jsonwebtoken');

class Token {

    static seed = 'secret-seed-token';
    static caducate = '3000d';

    constructor() {}

    static getJwtToken( payload ) {
        return jwt.sign({
            user: payload
        }, this.seed, {
            expiresIn: this.caducate
        });
    }

    static checkToken( userToken ) {
        return new Promise( (resolve, reject) => {
            jwt.verify( userToken, this.seed, (err, decoded) => {
                if ( err ) {
                    reject();
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}

module.exports = { Token }