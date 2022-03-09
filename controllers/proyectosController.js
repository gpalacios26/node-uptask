const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

const proyectosHome = async (req, res) => {
    // Obtener los proyectos del usuario
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

const formularioProyecto = async (req, res) => {
    // Obtener los proyectos del usuario
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

const nuevoProyecto = async (req, res) => {
    // Obtener los proyectos del usuario
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    // Validar que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = [];
    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' })
    }

    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores - Insertar en la BD
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

const proyectoPorUrl = async (req, res, next) => {
    // Obtener los proyectos del usuario
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    if (!proyecto) return next();

    // Consultar tareas del Proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
    });

    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

const formularioEditar = async (req, res) => {
    // Obtener los proyectos del usuario
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    if (!proyecto) return next();

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyecto,
        proyectos
    })
}

const actualizarProyecto = async (req, res) => {
    // Obtener los proyectos del usuario
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });

    // Validar que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = [];
    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' })
    }

    // Si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores - Actualizar en la BD
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id } }
        );
        res.redirect('/');
    }
}

const eliminarProyecto = async (req, res, next) => {
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}

module.exports = {
    proyectosHome,
    formularioProyecto,
    nuevoProyecto,
    proyectoPorUrl,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto
}