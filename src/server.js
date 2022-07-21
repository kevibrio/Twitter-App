const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const method_override = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
var cookieParser = require("cookie-parser");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("./modelos/administrador");
const socketsStatus = {};
const Publicacion = require("./modelos/publicacion");
const axios = require("axios");
//const logger = require('morgan');
const multer = require("multer");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
var hbs = require("hbs");

const URI = `mongodb+srv://ups:UPS123@cluster0.zzokk.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; //inicializadores
require("./configuracion/passport");
const app = express();
const server = require("http").Server(app);
var SocketIO = require("socket.io")(server);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((db) => console.log("Base de datos esta conectado"))
  .catch((err) => console.log(err));

//configuraciones
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
      check_friend: function (val1, val2) {
        console.log(val1, val2);
        return val1 === val2;
      },
    },
  })
);
app.set("view engine", ".hbs");
//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(method_override("_method"));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://ups:UPS123@cluster0.zzokk.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());
//app.use(logger('dev'));
app.use(multer({ storage: storage }).single("img"));

//variables globales
app.use((req, res, next) => {
  res.locals.exito = req.flash("success_msg");
  res.locals.updated = req.flash("success_updated");
  res.locals.deleted = req.flash("success_deleted");
  res.locals.errores = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.logoneado = req.user || null;
  next();
});

//rutas
app.get("/home", (req, res) => {
  res.render("index.hbs");
});
app.use(require("./routes/sesiones.routes"));
app.use(require("./routes/admin.routes"));
//archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

server.listen(process.env.PORT || 3000, () => {
  console.log("Servidor en puerto ", process.env.PORT || 3000);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.cookie(
      "email",
      req.user.email.split("@")[0] + req.user.email.split("@")[1]
    );
    let amigosArr = "";
    req.user.amigos.forEach((element) => {
      amigosArr += element.split("@")[0] + element.split("@")[1] + "%24";
    });
    res.cookie("amigos", amigosArr.substring(0, amigosArr.length - 3));
    res.redirect("/menu");
  }
);

app.post("/darLike", async function (req, res, next) {
  const { id } = req.body;
  console.log("di like");
  await Publicacion.findOneAndUpdate({ _id: id }, { $inc: { likes: 1 } });
  res.send({});
});

app.post("/darDisLike", async function (req, res, next) {
  const { id } = req.body;
  console.log("di dislike");
  await Publicacion.findOneAndUpdate({ _id: id }, { $inc: { likes: -1 } });
  res.send({});
});
app.post("/agregarAmigo", async function (req, res, next) {
  console.log("AGREGUE AMIGO");
  const { email } = req.body;
  let hotmail = req.cookies.email.indexOf("hotmail");
  let gmail = req.cookies.email.indexOf("gmail");
  let nuevoAmigo;
  let amigosArr = "";
  if (hotmail != -1) {
    nuevoAmigo =
      req.cookies.email.substring(0, hotmail) +
      "@" +
      req.cookies.email.substring(hotmail, req.cookies.email.length);
  }
  if (gmail != -1) {
    nuevoAmigo = nuevoAmigo =
      req.cookies.email.substring(0, gmail) +
      "@" +
      req.cookies.email.substring(gmail, req.cookies.email.length);
  }
  await admin.findOneAndUpdate(
    { email: nuevoAmigo },
    { $push: { amigos: email } }
  );
  res.send({});
});

app.post("/eliminarAmigo", async function (req, res, next) {
  console.log("ELIMINE AMIGO");
  const { email } = req.body;
  let hotmail = req.cookies.email.indexOf("hotmail");
  let gmail = req.cookies.email.indexOf("gmail");
  let viejoAmigo;
  if (hotmail != -1) {
    viejoAmigo =
      req.cookies.email.substring(0, hotmail) +
      "@" +
      req.cookies.email.substring(hotmail, req.cookies.email.length);
  }
  if (gmail != -1) {
    viejoAmigo =
      req.cookies.email.substring(0, gmail) +
      "@" +
      req.cookies.email.substring(gmail, req.cookies.email.length);
  }
  await admin.findOneAndUpdate(
    { email: viejoAmigo },
    { $pull: { amigos: email } }
  );
  res.send({});
});

app.post("/crearPublicacion", async function (req, res, next) {
  const { hora, correo, message, identificador, name } = req.body;
  axios({
    url: "https://worldtimeapi.org/api/timezone/America/Bogota",
    method: "get",
  }).then(async (response) => {
    let dateObj = response.data;
    let dateTime = dateObj.datetime +'';
    let timeReal;
    console.log("hora, ", dateTime.split("T")[1].substring(0,2),
    dateTime.split("T")[1].substring(3,5));
    const new_message = await new Publicacion();
    let ident = identificador;
    let messge = message;
    let hotmail = req.cookies.email.indexOf("hotmail");
    let gmail = req.cookies.email.indexOf("gmail");
    let user;
    let amigosArr = "";
    if (hotmail != -1) {
      user =
        req.cookies.email.substring(0, hotmail) +
        "@" +
        req.cookies.email.substring(hotmail, req.cookies.email.length);
    }
    if (gmail != -1) {
      user =
        req.cookies.email.substring(0, gmail) +
        "@" +
        req.cookies.email.substring(gmail, req.cookies.email.length);
    }
    const administrador = await admin.find({ user }).lean();
    new_message.message = await messge;
    new_message.hora = await new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        hora.split(":")[0],
        hora.split(":")[1],
        0
      )
    ).toISOString();
    timeReal = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(), dateTime.split("T")[1].substring(0,2),
        dateTime.split("T")[1].substring(3,5),
        0
      )
    ).toISOString();
    console.log("a", new_message.hora, ' ',dateTime);
    new_message.identificador = await ident;
    new_message.correo = await user;
    new_message.name = await name;
    new_message.likes = await 0;
    new_message.dislikes = await 0;
    const responseMessage = await new_message.save().then((res) => {
      return res;
    });

    if (new Date(new_message.hora).getTime() <= new Date(timeReal).getTime()) {
      SocketIO.sockets.emit("send2", {
        message,
        hora,
        identificador,
        correo,
        _id: res._id,
      });
    }
    Publicacion.find({})
      .sort({ _id: -1 })
      .lean()
      .exec(async function (err, listMessage) {
        let newArray = [];
        listMessage.forEach((element) => {
          console.log(
            new Date(element.hora),
            new Date(timeReal),
            " fecha x ",
            new Date(element.hora).getTime() <= new Date(timeReal).getTime()
          );
          if (
            new Date(element.hora).getTime() <=
              new Date(timeReal).getTime() &&
            (req.cookies.amigos
              .split("%24")
              .includes(
                element.correo.split("@")[0] + element.correo.split("@")[1]
              ) ||
              req.cookies.email ==
                element.correo.split("@")[0] + element.correo.split("@")[1])
          ) {
            newArray.push(element);
          }
        });

        const results = await admin.find({}).lean();
        const desconocidos = [];
        const conocidos = [];
        results.forEach((element) => {
          if (
            !amigosArr
              .substring(0, amigosArr.length - 3)
              .split("%24")
              .includes(
                element.email.split("@")[0] + element.email.split("@")[1]
              )
          ) {
            if (
              req.cookies.email ==
              element.email.split("@")[0] + element.email.split("@")[1]
            ) {
            } else {
              desconocidos.push({ email: element.email });
            }
          } else {
            conocidos.push({ email: element.email });
          }
        });
        let minutes = new Date().getMinutes().toString();
        let horaX = new Date().getHours().toString();
        if (hora.length == 1) {
          horaX = "0" + horaX;
        }
        if (!minutes) {
          minutes = "00";
        }
        if (minutes.length == 1) {
          minutes = "0" + minutes;
        }
        newArray.forEach((element) => {
          element.hora =
            "Publicado en la fecha " +
            element.hora.split("T")[0] +
            " a las " +
            element.hora.split("T")[1].substring(0, 5) +
            " horas.";
        });
        res.render("inicioadm/eleccion_admin", {
          usuario: [
            {
              name: administrador.name,
              usuario: user,
              horaActual: horaX + ":" + minutes,
            },
          ],
          listResponse: newArray,
          desconocidos: desconocidos,
          conocidos: conocidos,
        });
      });
  });
});

SocketIO.on("connection", function (socket) {
  const socketId = socket.id;
  socketsStatus[socket.id] = {};

  console.log("connected");
  socket.on("userInformation", function (data) {
    socketsStatus[socketId] = data;
    SocketIO.sockets.emit("usersUpdate", socketsStatus);
  });

  socket.on("disconnect", function () {
    delete socketsStatus[socketId];
  });
});

module.exports = app;
