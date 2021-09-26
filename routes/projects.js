import express from 'express';
import { check } from 'express-validator';

/* Middleware */
import { verifyUser } from '../middleware/authentication.js';

/* Controller */
import { 
    createProject, 
    getProjects,
    updateProject,
    deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

// Crea proyectos
// api/projects
router.post('/', 
    verifyUser,
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    createProject
);

// Obtener proyectos del usuario
router.get('/', 
    verifyUser,
    getProjects
);

// Actualizar un proyecto
router.put('/:id',
    verifyUser,
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    updateProject
);

// Eliminar un proyecto
router.delete('/:id',
    verifyUser,
    deleteProject
);

export default router;