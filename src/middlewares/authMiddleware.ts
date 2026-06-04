import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_para_tokens';

// Extendemos la Request de Express para inyectar los datos del usuario logueado
export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  // Verificamos si el header trae el token en formato "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verificamos y desencriptamos el token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      // Guardamos el id del usuario en la request para que el controlador lo pueda usar
      req.user = { id: decoded.id };

      next(); // El token es válido, pasamos al siguiente paso
    } catch (error) {
      res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token provisto' });
  }
};