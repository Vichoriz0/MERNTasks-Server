import { validationResult } from 'express-validator';

/* Models */
import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Crea una nueva tarea
const createTask = async (req, res) => {

    // Revisar si hay errores en los datos del body
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Extraer proyecto y comprobar que exista
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        if( !project ) 
            return res.status(404).json({ msg: 'El proyecto no existe' });

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if( project.owner.toString() !== req.user.id ) 
            return res.status(401).json({ msg: 'No autorizado' });

        // Creamos la tarea
        const task = new Task(req.body);
        await task.save();
        res.json({ task });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

// Obtener las tareas de un proyecto
const getTasks = async (req, res) => {
    try {
        // Extraer proyecto y comprobar que exista
        const { projectId } = req.query;
        const project = await Project.findById(projectId);
        if( !project ) return res.status(404).json({ msg: 'El proyecto no existe' });

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if( project.owner.toString() !== req.user.id ) 
            return res.status(401).json({ msg: 'No autorizado' });

        // Obtener las tareas por proyecto
        const tasks = await Task.find({ projectId }).sort({_id: -1});
        res.json({ tasks });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

// Actualizar los valores de una tarea específica
const updateTask = async (req, res) => {
    try {
        // Extraer tarea y comprobar que exista
        const { name, state, projectId } = req.body;
        let task = await Task.findById(req.params.id);
        if( !task )
            return res.status(404).json({ msg: 'La tarea no existe' });

        // Extraer proyecto y comprobar que exista
        const project = await Project.findById(projectId);
        if( !project ) 
            return res.status(404).json({ msg: 'El proyecto no existe' });

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if( project.owner.toString() !== req.user.id ) 
            return res.status(401).json({ msg: 'No autorizado' });

        // Revisar si la tarea pertenece al proyecto
        if( task.projectId.toString() !== projectId )
            return res.status(401).json({ msg: 'Tarea no pertenece a este proyecto' });

        // Crear un proyecto con la nueva información
        const newTask = { name, state };

        // Actualizar la tarea
        task = await Task.findOneAndUpdate(
            { _id: req.params.id }, 
            newTask,
            { new: true }
        );
        res.json({ task });

    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

// Eliminar una tarea específica
const deleteTask = async (req, res) => {
    try {
        // Extraer tarea y comprobar que exista
        const { projectId } = req.query;
        const task = await Task.findById(req.params.id);
        if( !task )
            return res.status(404).json({ msg: 'La tarea no existe' });

        // Revisar si el proyecto actual pertenece al usuario autenticado
        const project = await Project.findById(projectId);
        if( project.owner.toString() !== req.user.id ) 
            return res.status(401).json({ msg: 'No autorizado' });

        // Revisar si la tarea pertenece al proyecto
        if( task.projectId.toString() !== projectId )
            return res.status(401).json({ msg: 'Tarea no pertenece a este proyecto' });

        // Eliminar la tarea
        await Task.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada correctamente' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

const deleteTasks = async (req, res) => {
    try {
        // Extraer proyecto y comprobar que exista
        const { projectId } = req.query;
        const project = await Project.findById(projectId);
        if( !project )
            return res.status(404).json({ msg: 'El proyecto no existe' });

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if( project.owner.toString() !== req.user.id )
            return res.status(401).json({ msg: 'No autorizado' });

        // Eliminar tareas
        await Task.deleteMany({ projectId });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

export {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    deleteTasks
}