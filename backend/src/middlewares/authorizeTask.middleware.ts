import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from './auth.middleware';

// Only allow if user is admin or assigned to the task
export const authorizeTaskAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  const taskId = Number(req.params.id);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId }, select: { assignedToId: true } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (user.role === 'ADMIN' || user.userId === task.assignedToId) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: You do not have access to this task' });
  } catch (err) {
    return res.status(500).json({ message: 'Authorization failed', error: err });
  }
};