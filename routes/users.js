// Rutas para crear usuarios
import express from 'express';
import { check } from 'express-validator';

const router = express.Router();

/* Controller */
import { createUser } from '../controllers/userController.js';

// Crear un usuario
// api/users
router.post('/',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('pass', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 })
    ],
    createUser
);

export default router;