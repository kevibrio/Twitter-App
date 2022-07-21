const SesionCtrl = {};

const passport = require("passport");
const admin = require("../modelos/administrador");
const publicacion = require("../modelos/publicacion");
const axios = require("axios");
SesionCtrl.renderLogin = (req, res) => {
  res.render("inicioadm/logeo");
};

SesionCtrl.SigIn = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
});

SesionCtrl.renderRegistro = (req, res) => {
  res.render("inicioadm/registro");
};

SesionCtrl.renderMenu = async (req, res) => {

  axios({
    url: "https://worldtimeapi.org/api/timezone/America/Bogota",
    method: "get",
  }).then(async (response) => {
    let dateObj = response.data;
    let dateTime = dateObj.datetime +'';
    let timeReal;
    console.log("hora, ", dateTime.split("T")[1].substring(0,2),
    dateTime.split("T")[1].substring(3,5));

    timeReal = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(), dateTime.split("T")[1].substring(0,2),
        dateTime.split("T")[1].substring(3,5),
        0
      )
    ).toISOString();
    
  let desconocidos = [];
  let conocidos = []
  let newArray = [];
  let hotmail = req.cookies.email.indexOf('hotmail')
  let gmail = req.cookies.email.indexOf('gmail')
  let amigosActuales = [];
  let user;
  let amigosArr = '';
  if(hotmail != -1){
    user = req.cookies.email.substring(0,hotmail)+'@'+req.cookies.email.substring(hotmail,req.cookies.email.length)
  }
  if(gmail != -1){
    user = req.cookies.email.substring(0,gmail)+'@'+req.cookies.email.substring(gmail,req.cookies.email.length)
  }
  const administrador = await admin.findOne({email:user});
  await administrador.amigos.forEach(element => {
        amigosArr += element.split('@')[0]+element.split('@')[1]+'%24'
        conocidos.push({email:element});
    });
    amigosActuales = administrador.amigos;
    res.cookie('amigos',amigosArr.substring(0,amigosArr.length-3));
  await publicacion
    .find({})
    .sort({ _id: -1 })
    .lean()
    .exec(function (err, listMessage) {
      listMessage.forEach((element) => {
        if (new Date(element.hora).getTime() <= new Date(timeReal).getTime() && 
        (amigosActuales.includes(element.correo) ||
        user ==element.correo)) {
          newArray.push(element);
        }
      });
    });
    const results = await admin.find({}).lean();
    await results.forEach(element => {
      if(!amigosActuales.includes(element.email) &&
      user != element.email){
        desconocidos.push({email:element.email});
      }
    });
    let hora = new Date().getHours().toString();
    let minutes = new Date().getMinutes().toString()
    if(hora.length == 1){
      hora = '0'+hora
    }
    if(!minutes){
      minutes = '00'
    }
    if(minutes.length == 1){
      minutes = '0'+minutes
    }
    await newArray.forEach(element => {
      element.hora = 'Publicado en la fecha '+ element.hora.split('T')[0] + ' a las ' + element.hora.split('T')[1].substring(0,5) + ' horas.';  
    });
    res.render("inicioadm/eleccion_admin", {  usuario: [{name: administrador.name,usuario:user,horaActual:hora+':'+minutes}],
    listResponse: newArray,desconocidos,conocidos
  });
      });
};

SesionCtrl.logOut = (req, res) => {
    req.logOut();
    res.redirect("/login");
};

module.exports = SesionCtrl;
