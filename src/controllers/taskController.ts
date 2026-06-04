import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { pool } from '../config/db';

// 1. Obtener todas las tareas del usuario logueado
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    
    // Mapeamos los datos de la DB para que coincidan con la entidad "TaskEntity" de tu Flutter (camelCase)
    const formattedTasks = tasks.rows.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.is_completed
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
};

// 2. Crear una nueva tarea
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, description, isCompleted } = req.body;

    const newTask = await pool.query(
      'INSERT INTO tasks (title, description, is_completed, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, isCompleted || false, userId]
    );

    const task = newTask.rows[0];
    res.status(201).json({
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.is_completed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
};

// 3. Actualizar una tarea existente
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id; // Viene en la URL: /api/tasks/:id
    const { title, description, isCompleted } = req.body;

    const updatedTask = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, is_completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, description, isCompleted, taskId, userId]
    );

    if (updatedTask.rows.length === 0) {
      res.status(404).json({ message: 'Tarea no encontrada o no tienes permisos' });
      return;
    }

    const task = updatedTask.rows[0];
    res.status(200).json({
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.is_completed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
};

// 4. Eliminar una tarea
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id;

    const deletedTask = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [taskId, userId]
    );

    if (deletedTask.rows.length === 0) {
      res.status(404).json({ message: 'Tarea no encontrada o no tienes permisos' });
      return;
    }

    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
};