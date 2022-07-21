const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrip = require('bcryptjs');

const admin = require('../modelos/administrador');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new localStrategy({
    usernameField: 'email'
}, async (email,password,done) =>{

    //match Email del administrador
    const administrador = await admin.findOne({email}).lean();
    
    if(!administrador){
        return done(null, false, {message: 'No se ha encontrado una Sesion Valida'});
    }else if (administrador && administrador.confirmacion == false){
        return done(null, false, {message: 'No ha confirmado el correo elecPurtronico'});
    }else{
        
        //match de la contrasena
        const match = await bcrip.compare(password,administrador.contrasena);
        
        if(match){
            return done(null, administrador);
        }else {
            return done(null, false, {message: 'Contraseña es Incorrecta'});
        }
        

    }

}));


passport.use(
    new GoogleStrategy(
      {
        clientID: '138668547323-41mpe6cikdg3fd69ou2ktlq5l1be15qt.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {

    //match Email del administrador
    const administrador = await admin.findOne({email:profile.emails[0].value}).lean();
    console.log(profile)
    
    if(!administrador){
        const new_admin = new admin();
        new_admin.amigos = [];
        new_admin.confirmacion = true;
        new_admin.name = profile.displayName;
        new_admin.email = profile.emails[0].value;
        new_admin.contrasena = await new_admin.encriptarPass(profile.id);
        await new_admin.save();
        return done(null, administrador);
    }else {
        //match de la contrasena
        const match = await bcrip.compare(profile.id,administrador.contrasena);
        
        if(match){
            return done(null, administrador);
        }else {
            return done(null, false, {message: 'Contraseña es Incorrecta'});
        }
        
    }
      }
    )
  );
  

passport.serializeUser((administrador,done) => {
    done (null, administrador._id);
});

passport.deserializeUser((_id,done) => {
    admin.findById(_id,(err,administrador) => {
        done(err,administrador);
    });
});