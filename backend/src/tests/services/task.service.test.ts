import * as taskService from '../../services/task.service';
import prisma from '../../utils/prisma';
import { createUser } from '../../services/user.service';
import e from 'express';
interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}
describe('Task Service', () => {
  let taskId: number;
  let user: User;
  let admin: User;

  beforeAll(async () => {
    // Create a normal user and an admin
    user = await createUser({ email: 'jesur@example.com', password: 'hashed', role: 'USER' });
    admin = await createUser({ email: 'jedmin@example.com', password: 'hashed', role: 'ADMIN' });
  });


  afterAll(async () => {
    console.log('Cleaning up test data...',user,admin);
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { in: [user.email, admin.email] } } });
    await prisma.$disconnect();
  });
  
  it('should create a task', async () => {
    const tUser = {userId:user.id, role: user.role};
    const task = await taskService.createTask({
      title: 'Test Task',
      description: 'Test Desc',
      status: 'PENDING',
      priority: 'MEDIUM',
      dueDate: new Date(),
      assignedToId: user.id,
    },tUser);
    expect(task.title).toBe('Test Task');
    taskId = task.id;
  });

  it('should get tasks', async () => {
    const tUser = {userId:user.id, role: user.role};
    const tasks = await taskService.getTasks( tUser);
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should get task by id', async () => {
    const tUser = {userId:user.id, role: user.role};
    const task = await taskService.getTaskById(taskId, tUser);
    expect(task).toBeTruthy();
    expect(task?.id).toBe(taskId);
  });

  it('should update a task', async () => {
    const aUser = {userId:admin.id, role: admin.role};
    const updated = await taskService.updateTask(taskId, { title: 'Updated Task' }, aUser);
    expect(updated.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    const aUser = {userId:admin.id, role: admin.role};
    const deleted = await taskService.deleteTask(taskId, aUser);
    expect(deleted.id).toBe(taskId);
  });
});