const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

const agregarTarea = async (req, res, next) => {
    // Obtener el Proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

    // Leer el valor del input
    const { tarea } = req.body;

    if (!tarea) {
        return next();
    }

    // estado 0 = incompleto y ID de Proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertar en la base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId });

    if (!resultado) {
        return next();
    }

    res.redirect(`/proyectos/${req.params.url}`);
}

const cambiarEstadoTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id } });

    // Cambiar el estado
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;

    // Actualizar en la base de datos
    const resultado = await tarea.save();

    if (!resultado) return next();

    res.status(200).send('Actualizado');
}

const eliminarTarea = async (req, res) => {
    const { id } = req.params;

    // Eliminar la tarea
    const resultado = await Tareas.destroy({ where: { id } });

    if (!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente');
}

module.exports = {
    agregarTarea,
    cambiarEstadoTarea,
    eliminarTarea
}