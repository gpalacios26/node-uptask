const express = require("express");
const routes = require("./routes");
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexión a la BD
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// Sincronizar a la BD y crear tablas
db.sync()
    .then(() => console.log('Conectado a la DB'))
    .catch(error => console.log(error));

// Crear servidor express
const app = express();

// Cargar los archivos estáticos
app.use(express.static('public'));

// Habilitar plantillas pug
app.set('view engine', 'pug');

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Agregar cookies
app.use(cookieParser());

// Sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}));

// Agregar passport
app.use(passport.initialize());
app.use(passport.session());

// Agregar flash messages
app.use(flash());

// Pasar parámetros a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    next();
});

// Rutas de la aplicación
app.use('/', routes);

app.listen(3000);