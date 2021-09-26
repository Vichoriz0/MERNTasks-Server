import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

/* Routers */
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import projectRouter from './routes/projects.js';
import taskRouter from './routes/tasks.js';

// Crear el servidor
const app = express();

// Conectar a la base de datos
connectDB();

// Habilitar CORS
app.use(cors());

// Habilitar body-parser o express.json
app.use(express.json({ extend: true }));

// Definir el puerto de la app
const PORT = process.env.PORT || 4000;

// Importar rutas
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

// Arrancar el servidor
app.listen(PORT, () => {
    console.log('El servidor está corriendo en el puerto', PORT);
});