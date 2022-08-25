const UserCtrl = {};

const user=require('../modelos/usuarios');
const nodemailer = require('nodemailer');
const images =require('../modelos/imagen')
const bcrypt = require('bcrypt');
const { Token } = require('../autenticador/token');








UserCtrl.putImageMovil = async (req,res)=> {
    new_img.filename = req.file.filename;
    new_img.originalName = req.file.originalName;
    await new_img.save(err=>{
        if(err){
            return err
        }
        return "Imagen guardada"
    });
    return res.status(200).send({
        STATUS: 'OK',
        MESSAGE: 'Imagen subida exitosamente',
        IMAGEN: new_img,
    });
}
UserCtrl.createUserMovil = async (req, res) => {
    const {nombre,ruc,telefono,email,direccion,contrasena,img} = req.body;
    const new_user = new user();
    new_user.nombre = nombre;
    new_user.ruc = ruc;
    new_user.cuenta = nombre;
    new_user.telefono = telefono;
    new_user.password = await bcrypt.hash(contrasena,10);
    new_user.direccion = direccion;
    new_user.email = email;
    new_user.categoria = 'Persona Natural';
    new_user.estado = 'activo';
    new_user.img = img;
    user.findOne({email: email},async (err,us)=>{
        if(us){
            return res.status(200).send({
                STATUS:"EMAIL IN USE",
                ERROR: "EMAIL ALREADY IN USE",
                MESSAGE: 'Ya se ha creado una cuenta con este correo',
            });
        }else{
            const output = `
            <h2>Se ha registrado exitósamente a AcerimallasMovilApp</h2>
            <p>Disfrute de los servicios que le proveemos con esta aplicación, entre ellos están:</p>
            <ul>  
                <li>Cotización de productos</li>
                <li>Revisión de catálogos</li>
                <li>Oportunidades de descuentos</li>
                <li>¡Tips/Consejos/Publicaciones sobre nuestra empresa!</li>
            </ul>
            <h4>Recuerde no compartir con nadie su contraseña</h4>
            <h5>¡Gracias por ser parte de nosotros!</h5>
        `;
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'dawap2020@gmail.com', // generated ethereal user
                pass: 'allan123AP'  // generated ethereal password
            },
            tls:{
            rejectUnauthorized:false
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Acerimallas" <dawap2020@gmail.com>', // sender address
            to: email, // list of receivers
            subject: 'Bienvenido a AcerimallasMovilApp', // Subject line
            text: 'Contactáme', // plain text body
            html: output // html body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.send(output);
        });
    await new_user.save( (error, user) => {
        console.log("Usuario creado")
        if(error) return res.status(200).send({
            STATUS:"ERROR TO SAVE USER",
            ERROR: 'ERROR TO SAVE USER',
            MESSAGE: 'Error al guardar usuario',
        });

        if(!user) return res.status(200).send({
            STATUS: "DO NOT SAVE USER",
            ERROR: 'DO NOT SAVE USER',
            MESSAGE: 'No se ha podido guardar el usuario',
        });

        const  userToken = Token.getJwtToken({
            _id: user._id
        });

        return res.status(200).send({
            STATUS: 'OK',
            MESSAGE: 'Tu cuenta ha sido creada exitosamente',
            USER: user,
            TOKEN: userToken
        });
    });
    
        }
    })
};


UserCtrl.logIn = async (req, res) => {
    const {email,contrasena} = req.body;
     user.findOne({email: email}, async(err,us)=>{
         if(us){
            var cmp = await bcrypt.compare(contrasena,us.password)
            if(cmp) {
                const  userToken = Token.getJwtToken({
                    _id: user._id
                });
                return res.status(200).send({
                    STATUS: 'OK',
                    MESSAGE: 'Inicio de sesión exitoso',
                    USER: us,
                    TOKEN: userToken
                });
            }else{    
                return res.status(200).send({
                    STATUS: 'PASSWORD',
                    ERROR: 'Contraseña incorrecta',
                    MESSAGE: 'Contraseña incorrecta',
                    USER: us
                });
            }
         }else{
            return res.status(200).send({
                STATUS: 'EMAIL',
                ERROR: 'EMAIL NO REGISTER',
                MESSAGE: 'Correo no registrado',
            });
         }
     });      
    
    
};

UserCtrl.profile = async (req, res) => {
    const usuario = await user.findById(req.params.id).lean();
    return res.status(200).send({
        STATUS: 'OK',
        MESSAGE: 'Usuario obtenido exitosamente',
        USER: usuario
    });
};

UserCtrl.logInFacebook = async (req, res)=>{
    var {email,nombre,img} = req.body;
    new_user = new user(),
    new_user.nombre = nombre;
    new_user.ruc = "userFacebook";
    new_user.cuenta = nombre;
    new_user.telefono = "userFacebook";
    new_user.email = email;
    new_user.img = img;
    new_user.password = await bcrypt.hash("dsadsadkJASJu.50050SXMndcbcsh",10);
    new_user.direccion = "userFacebook";
    new_user.categoria = 'Persona Natural';
    new_user.estado = 'activo';
    console.log("Facebook user connected");          
    await user.findOne({email: email}, function(error,result){
        if(!error){
            if(!result){
                new_user.save();
                const  userToken = Token.getJwtToken({
                    _id: new_user._id
                });;
                return res.status(200).send({
                    STATUS: 'OK',
                    MESSAGE: 'Inicio de sesión exitoso',
                    USER: new_user,
                    TOKEN: userToken
                });
                }else{
                    const  userToken = Token.getJwtToken({
                        _id: result._id
                    });;
                    return res.status(200).send({
                        STATUS: 'OK',
                        MESSAGE: 'Inicio de sesión exitoso',
                        USER: result,
                        TOKEN: userToken
                    });
                }
                
        
                
            }
        });
    }

module.exports = UserCtrl;
