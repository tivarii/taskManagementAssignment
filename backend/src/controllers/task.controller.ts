import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';

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