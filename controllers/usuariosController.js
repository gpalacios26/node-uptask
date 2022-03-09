const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

const formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    })
}

const crearCuenta = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // Crear el objeto de usuario
        const usuario = {
            email
        }

        // Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        })
    }
}

const formIniciarSesion = (req, res) => {
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask'
    })
}

const formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

const confirmarCuenta = async (req, res) => {
    // Verificar si existe el usuario
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}

module.exports = {
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    formRestablecerPassword,
    confirmarCuenta
}