import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, uploadDocuments,viewDocument, downloadDocument } from '../controllers/task.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeTaskAccess } from '../middlewares/authorizeTask.middleware';
import { upload } from '../middlewares/upload.middleware';
const router = Router();

// All task routes require authentication
router.use(authenticateJWT);


// View a document (inline in browser)
router.get('/documents/:docId/view', authorizeTaskAccess, viewDocument);

// Download a document (as attachment)
router.get('/documents/:docId/download', authorizeTaskAccess, downloadDocument);

// Create a new task
router.post('/', createTask);

// Upload documents to a task (max 3 PDFs)
router.post('/:id/documents', authorizeTaskAccess, upload.array('documents', 3), uploadDocuments);

// Get all tasks (with filtering, sorting, pagination to be added)
router.get('/', getTasks);

// Get a single task by ID
router.get('/:id', authorizeTaskAccess, getTaskById);

// Update a task
router.put('/:id', authorizeTaskAccess, updateTask);

// Delete a task
router.delete('/:id', authorizeTaskAccess, deleteTask);

export default router;