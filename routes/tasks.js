import express from 'express';
import { check } from 'express-validator';

/* Middleware */
import { verifyUser } from '../middleware/authentication.js';

/* Controller */
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    deleteTasks
} from '../controllers/taskController.js';

const router = express.Router();

// api/tasks
// Crear una tarea
router.post('/',
    verifyUser,
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('projectId', 'La ID del proyecto es obligatoria').not().isEmpty()
    ],
    createTask
);

// Obtener todas las tareas de un proyecto
router.get('/',
    verifyUser,
    getTasks
);

// Actualizar una tarea
router.put('/:id',
    verifyUser,
    updateTask
);

// Eliminar todas las tareas de un proyecto
router.delete('/',
    verifyUser,
    deleteTasks
);

// Eliminar una tarea
router.delete('/:id',
    verifyUser,
    deleteTask
);

export default router;