import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';
import path from 'path';


// Upload documents to a task
export const uploadDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    // Save file metadata to DB
    const documents = await Promise.all(
      (req.files as Express.Multer.File[]).map(async (file) => {
        return prisma.document.create({
          data: {
            fileName: file.originalname,
            filePath: file.path,
            taskId: taskId,
          },
        });
      })
    );
    res.status(201).json({ message: 'Files uploaded', documents });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error });
  }
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    // console.log('Creating task:', req);
    const task = await taskService.createTask(req.body, req.user);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

// Get all tasks
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await taskService.getTasks(req.user);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
};

// Get a single task by ID
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.getTaskById(Number(req.params.id), req.user);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error });
  }
};

// Update a task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.body, req.user);
    res.json(task);
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update task', error });
  }
};

// Delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.deleteTask(Number(req.params.id), req.user);
    res.json({ message: 'Task deleted' });
  } catch (error: any) {
    if (error.message.includes('Unauthorized') || error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to delete task', error });
  }
};

// View document
export const viewDocument = async (req:any, res:any) => {
  try {
    const doc = await prisma.document.findUnique({ where: { id: Number(req.params.docId) } });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.type('application/pdf');
    res.sendFile(path.resolve(doc.filePath));
  } catch (error) {
    res.status(500).json({ message: 'Failed to view document', error });
  }
};

// Download document
export const downloadDocument = async (req:any, res:any) => {
  try {
    const doc = await prisma.document.findUnique({ where: { id: Number(req.params.docId) } });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.download(path.resolve(doc.filePath), doc.fileName);
  } catch (error) {
    res.status(500).json({ message: 'Failed to download document', error });
  }
};