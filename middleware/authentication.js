import jwt from 'jsonwebtoken';

export const verifyUser = (req, res, next) => {
    // Leer el token del header
    const token = req.header('x-auth-token');

    // Revisar si no hay token
    if( !token ) return res.status(401).json({ msg: 'No hay token. Permiso denegado' });

    // Validar el token
    try {
        const encrypted = jwt.verify(token, process.env.SECRET);
        req.user = encrypted.user;
        next();
    } catch(err) {
        console.error(err);
        res.status(401).json({ msg: 'Token no válido. Permiso denegado' });
    }
};