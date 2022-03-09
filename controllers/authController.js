const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

const autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

const usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }
    // Sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

const cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

const enviarToken = async (req, res) => {
    // Verificar que el usuario existe
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email } });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // Guardarlos en la base de datos
    await usuario.save();

    // URL de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Enviar el Correo con el Token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

const validarToken = async (req, res) => {
    // Verificar que el usuario existe
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // Si no encuentra el usuario
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}

const actualizarPassword = async (req, res) => {
    // Verifica el token valido pero también la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    // Verificamos si el usuario existe
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // Hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    // Guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}

module.exports = {
    autenticarUsuario,
    usuarioAutenticado,
    cerrarSesion,
    enviarToken,
    validarToken,
    actualizarPassword
}