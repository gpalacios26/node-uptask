const express = require("express");
const router = express.Router();

// Importar express validator
const { body } = require('express-validator');

// Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

router.get('/', authController.usuarioAutenticado, proyectosController.proyectosHome);
router.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectosController.formularioProyecto);
router.post('/nuevo-proyecto', authController.usuarioAutenticado, body('nombre').not().isEmpty().trim().escape(), proyectosController.nuevoProyecto);
router.get('/proyectos/:url', authController.usuarioAutenticado, proyectosController.proyectoPorUrl);
router.get('/proyecto/editar/:id', authController.usuarioAutenticado, proyectosController.formularioEditar);
router.post('/nuevo-proyecto/:id', authController.usuarioAutenticado, body('nombre').not().isEmpty().trim().escape(), proyectosController.actualizarProyecto);
router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);

router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea);
router.patch('/tareas/:id', authController.usuarioAutenticado, body('tarea').not().isEmpty().trim().escape(), tareasController.cambiarEstadoTarea);
router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);

router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta', usuariosController.crearCuenta);
router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
router.post('/iniciar-sesion', authController.autenticarUsuario);
router.get('/cerrar-sesion', authController.cerrarSesion);

router.get('/reestablecer', usuariosController.formRestablecerPassword);
router.post('/reestablecer', authController.enviarToken);
router.get('/reestablecer/:token', authController.validarToken);
router.post('/reestablecer/:token', authController.actualizarPassword);

module.exports = router;