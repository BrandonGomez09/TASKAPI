import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Inyectamos el middleware de seguridad a todas las rutas de este archivo
router.use(protect);

// Definimos los endpoints RESTful
router.route('/')
  .get(getTasks)       // GET /api/tasks
  .post(createTask);   // POST /api/tasks

router.route('/:id')
  .put(updateTask)     // PUT /api/tasks/:id
  .delete(deleteTask); // DELETE /api/tasks/:id

export default router;