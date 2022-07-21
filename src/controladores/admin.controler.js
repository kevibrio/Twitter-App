const adminCtrl = {};

const admin = require("../modelos/administrador");
const Publicacion = require("../modelos/publicacion");
const nodemailer = require("nodemailer");
const axios = require("axios");
adminCtrl.createAdministrador = async (req, res) => {
  const errors = [];
  const { email, name, password, cpassword } = req.body;

  if (password.length < 8) {
    errors.push({ text: "Contraseña es muy corta" });
  }

  if (password != cpassword) {
    errors.push({
      text: "La contraseña y la confirmación de la contraseña no coinciden",
    });
  }

  if (errors.length > 0) {
    res.render("inicioadm/registro", { errors, email });
  } else {
    const identityUser = await admin.findOne({ email: email }).lean();
    if (identityUser) {
      req.flash(
        "error_msg",
        "El correo ya esta en uso, registrarse desde el principio"
      );
      res.redirect("/registrop");
    } else {
      const new_admin = new admin();
      new_admin.name = name;
      new_admin.amigos = [];
      new_admin.confirmacion = false;
      new_admin.email = email;
      new_admin.contrasena = await new_admin.encriptarPass(password);
      await new_admin.save();
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "anabellallison2@gmail.com",
          pass: "IPHONE569899",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      await transporter.sendMail({
        to: email,
        subject: "Nuestra comunidad te invita a:",
        text: "Verifica tu correo electrónico, y únetenos para crear una comunidad mas grande y grata.",
        from: '"Fast Savannah" <anabellallison2@gmail.com>',
        html: `<h1>Ahora usted, CASI!, forma parte de nosotros. Por favor, verifique el correo electrónico para completar su registro.</h1>
      <p>Para ello puede acceder al siguiente enlace: <a href="http://localhost:3000/verificandoAdministrador?email=${email}">http://localhost:3000/verificandoAdministrador?email=${email}</a></p>
      <p>Completando este paso, ya formarás parte de nosotros, como un administrador de nuestra página web</p>
      <br><br><br>
      <strong>Un saludo fraterno desde nuestra comunidad ecuatoriana.</strong>`,
      });
      req.flash(
        "success_msg",
        "Administrador creado correctamente, por favor, verifique su correo electrónico antes de iniciar sesión."
      );
      res.redirect("/login");
    }
  }
};

adminCtrl.verificandoAdministrador = async (req, res) => {
  const { email } = req.query;
  const response = await admin.updateOne(
    { email: email },
    {
      $set: { confirmacion: true },
    }
  );
  console.log(response);

  if (response.nModified > 0) {
    res.send('Su correo ha sido verificado de manera exitosa. Por favor inicie sesion.')
  } else {
    return res
      .status(200)
      .send(
        "No se ha podido verificar su correo electrónico, por favor, intente registrarse nuevamente."
      );
  }
};

module.exports = adminCtrl;
