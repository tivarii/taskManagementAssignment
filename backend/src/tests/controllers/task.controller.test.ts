import request from 'supertest';
import app from '../../app';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/auth';
import dotenv from "dotenv";
dotenv.config();
describe('Task API', () => {
  let taskId: number;
  let authToken: string;
  const testUser = { userId: 25, role: 'USER' };

  beforeAll(() => {
    // Create a valid JWT token for authentication
    authToken = generateToken(testUser);
  });

  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'Test Desc',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: new Date(),
        assignedToId: 25,
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Task');
    taskId = res.body.id;
  });

  it('should get tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a task by id', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Task' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app)
      .get('/api/tasks/9999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(404);
  });
});