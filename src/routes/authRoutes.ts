import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Endpoint para registrarse: POST /api/auth/register
router.post('/register', register);

// Endpoint para iniciar sesión: POST /api/auth/login
router.post('/login', login);

export default router;