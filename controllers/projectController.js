import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

/* Model */
import Project from '../models/Project.js';

const createProject = async (req, res) => {

    // Revisar si hay errores en los datos del body
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Crea un nuevo proyecto
        const project = new Project(req.body);

        // Guardar propietario vía JWT
        project.owner = req.user.id;

        // Guardar el proyecto
        project.save();
        res.json({ project });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'No se ha podido crear el proyecto' });
    }
};

// Obtiene todos los proyectos del usuario actual
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user.id });
        res.json({ projects });
    } catch(err) {
        console.error(err);
        res.status(500).send({ msg: 'Hubo un error al cargar los proyectos' });
    }
};

// Actualizar un proyecto específico del usuario actual
const updateProject = async (req, res) => {

    // Revisar si hay errores en los datos del body
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer la información del proyecto
    const { name } = req.body;
    const newProject = {};

    if( name ) newProject.name = name;

    try {
        // Revisar que exista el proyecto
        let project = await Project.findById(req.params.id);
        if( !project ) return res.status(404).json({ msg: 'Proyecto no encontrado '});

        // Verificar el creador del proyecto
        if( project.owner.toString() !== req.user.id )
            return res.status(401).json({ msg: 'No autorizado' });

        // Actualizar registro
        project = await Project.findOneAndUpdate(
            { _id: req.params.id }, 
            { $set: newProject },
            { new: true }
        );
        res.json({ project });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// Elimina un proyecto por su ID
const deleteProject = async (req, res) => {
    try {
        // Revisar que exista el proyecto
        let project = await Project.findById(req.params.id);
        if( !project ) return res.status(404).json({ msg: 'Proyecto no encontrado' });

        // Verificar el creador del proyecto
        if( project.owner.toString() !== req.user.id )
            return res.status(401).json({ msg: 'No autorizado' });

        // Eliminar el proyecto
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Proyecto eliminado correctamente' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export {
    createProject,
    getProjects,
    updateProject,
    deleteProject
}