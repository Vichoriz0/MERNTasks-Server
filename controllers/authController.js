import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

/* Model */
import User from "../models/User.js";

// Autenticar usuario
const authUser = async ( req, res ) => {

    // Revisar si hay errores en los datos del usuario
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer usuario y contraseña del request
    const { email, pass } = req.body;

    try {
        // Revisar que el usuario no esté registrado previamente
        const user = await User.findOne({ email });
        if( !user ) return res.status(400).json({ msg: 'El usuario y/o contraseña son incorrectos' });

        // Revisar que la contraseña ingresada coincida
        const passCorrect = await bcryptjs.compare(pass, user.pass);
        if( !passCorrect ) return res.status(400).json({ msg: 'El usuario y/o contraseña son incorrectos' });

        // Si la autenticación fue exitosa, crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 86400 // 1 día
        }, ( error, token ) => {
            if( error ) throw error;

            // Mensaje de confirmación
            res.json({ token });
        });
    } catch(err) {
        console.error(err);
    }
};

// Obtiene el usuario que está autenticado
const authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-pass');
        res.status(200).json({ user });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};

export {
    authUser,
    authenticatedUser
}