import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeTaskAccess } from '../middlewares/authorizeTask.middleware';
const router = Router();

// All task routes require authentication
router.use(authenticateJWT);

// Create a new task
router.post('/', createTask);

// Get all tasks (with filtering, sorting, pagination to be added)
router.get('/', getTasks);

// Get a single task by ID
router.get('/:id', authorizeTaskAccess, getTaskById);

// Update a task
router.put('/:id', authorizeTaskAccess, updateTask);

// Delete a task
router.delete('/:id', authorizeTaskAccess, deleteTask);

export default router;