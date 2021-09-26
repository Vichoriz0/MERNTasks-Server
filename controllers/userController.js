import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

/* Model */
import User from "../models/User.js";

const createUser = async ( req, res ) => {

    // Revisar si hay errores en los datos del usuario
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer mail y pass
    const { email, pass } = req.body;

    try {
        // Revisar que el usuario no esté registrado previamente
        let user = await User.findOne({ email });
        if( user ) return res.status(400).json({ msg: 'El usuario ya existe' });

        // Crea el nuevo usuario y hashea su contraseña
        user = new User(req.body);

        const salt = await bcryptjs.genSalt(10);
        user.pass = await bcryptjs.hash(pass, salt);

        // Guardar el nuevo usuario
        await user.save();

        // Crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 // 1 hr
        }, ( error, token ) => {
            if( error ) throw error;

            // Mensaje de confirmación
            res.status(200).json({ token });
        });
    } catch(err) {
        res.status(400).json({ msg: 'Hubo un error al registrar el usuario' });
        console.error(err);
    }
};

export {
    createUser
};