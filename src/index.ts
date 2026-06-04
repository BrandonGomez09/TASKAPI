import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes'; // <-- 1. Agregamos esta importación

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a PostgreSQL ❌', err.stack);
  } else {
    console.log('PostgreSQL conectado a las:', res.rows[0].now);
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes); // <-- 2. Conectamos las rutas de tareas

app.get('/', (req, res) => {
  res.send('¡Hola! La API del Task Manager está funcionando correctamente 🚀');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});