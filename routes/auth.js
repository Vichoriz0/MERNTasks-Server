// Rutas para autenticar usuarios
import express from 'express';
import { check } from 'express-validator';

/* Middleware */
import { verifyUser } from '../middleware/authentication.js';

const router = express.Router();

/* Controller */
import { authUser, authenticatedUser } from '../controllers/authController.js';

// api/users
// Crear un usuario
router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('pass', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 })
    ],
    authUser
);

// Obtener un usuario
router.get('/',
    verifyUser,
    authenticatedUser
);

export default router;