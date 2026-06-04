import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargamos las variables de entorno (.env)
dotenv.config();

// Creamos un "Pool" de conexiones usando tus credenciales
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Mensaje de confirmación en la consola
pool.on('connect', () => {
  console.log('Conexión a la base de datos PostgreSQL exitosa 🐘');
});

// Manejo de errores de conexión
pool.on('error', (err) => {
  console.error('Error inesperado en la base de datos', err);
  process.exit(-1);
});