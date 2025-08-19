import request from 'supertest';
import app from '../../app'; // Make sure your Express app is exported as default
import prisma from '../../utils/prisma';

describe('User Controller', () => {
  const testEmail = 'jestcontroller@example.com';
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: testEmail, password: 'test123', role: 'USER' });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(testEmail);
  });

  it('should not register duplicate user', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ email: testEmail, password: 'test123', role: 'USER' });
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: testEmail, password: 'test123', role: 'USER' });
    expect(res.status).toBe(409);
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({ email: testEmail, password: 'test123', role: 'USER' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testEmail, password: 'test123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});