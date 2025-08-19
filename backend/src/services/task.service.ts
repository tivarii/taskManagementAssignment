import { createTask as createTaskController } from "../controllers/task.controller";
import prisma from "../utils/prisma";


export const createTask = async (data: any, user: any) => {
  // Prepare task data
  const taskData = { 
    ...data,
    // If user is not an admin, ensure the task is assigned to themselves
    assignedToId: user.role !== 'ADMIN' && data.assignedToId
      ? user.userId
      : data.assignedToId || user.userId
  };
  console.log('Creating task with data:', taskData);
  return prisma.task.create({
    data: taskData,
    include: { documents: true, assignedTo: true },
  });
};

export const getTaskById = async (id: number, user: any) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { documents: true, assignedTo: true },
  });
  
  // Check if task exists
  if (!task) return null;
  
  // If user is not admin, check if task is assigned to them
  if (user.role !== 'ADMIN') {
    const isAssigned = Array.isArray(task.assignedTo) 
      ? task.assignedTo.some(assignee => assignee.id === user.userId)
      : task.assignedTo.id === user.userId;
    if (!isAssigned) return null;
  }
  
  return task;
};
export const getTasks = async (user: any) => {
  // For admin users, get all tasks
  if (user.role === 'ADMIN') {
    return prisma.task.findMany({
      include: { documents: true, assignedTo: true },
    });
  } 
  
  // For non-admin users, only get tasks assigned to them
  const task = await prisma.task.findMany({
    include: { documents: true, assignedTo: true },
  });
  return task.map(t => ({
    ...t,
    isAssigned: Array.isArray(t.assignedTo)
      ? t.assignedTo.some(assignee => assignee.id === user.userId)
      : t.assignedTo.id === user.userId
  }));
};
export const updateTask = async (id: number, data: any, user: any) => {
  // Check if task exists and user has permission to update it
  const task = await prisma.task.findUnique({
    where: { id },
    include: { assignedTo: true },
  });
  
  if (!task) throw new Error('Task not found');
  
  // If user is not admin, check if task is assigned to them
  if (user.role !== 'ADMIN') {
    const isAssigned = Array.isArray(task.assignedTo) 
      ? task.assignedTo.some(assignee => assignee.id === user.userId)
      : task.assignedTo.id === user.userId;
    if (!isAssigned) throw new Error('Unauthorized: Task not assigned to you');
  }
  
  return prisma.task.update({
    where: { id },
    data,
    include: { documents: true, assignedTo: true },
  });
};

export const deleteTask = async (id: number, user: any) => {
  // Check if task exists and user has permission to delete it
  const task = await prisma.task.findUnique({
    where: { id },
    include: { assignedTo: true },
  });
  
  if (!task) throw new Error('Task not found');
  
  // If user is not admin, check if task is assigned to them
  if (user.role !== 'ADMIN') {
    const isAssigned = Array.isArray(task.assignedTo) 
      ? task.assignedTo.some(assignee => assignee.id === user.userId)
      : task.assignedTo.id === user.userId;
    if (!isAssigned) throw new Error('Unauthorized: Task not assigned to you');
  }
  
  return prisma.task.delete({
    where: { id },
  });
};
