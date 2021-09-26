import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false
        });
        console.log('Conexión a DB establecida correctamente');
    } catch(err) {
        // En caso de error, detener la app
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;