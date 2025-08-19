import { createUser,findUserByEmail } from '../../services/user.service';
import prisma from '../../utils/prisma';

describe('User Service', () => {
  const testEmail = 'jestuse@example.com';

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it('should create and find a user', async () => {
    const user = await createUser({ email: testEmail, password: 'hashed', role: 'USER' });
    expect(user.email).toBe(testEmail);

    const found = await findUserByEmail(testEmail);
    expect(found).not.toBeNull();
    expect(found?.email).toBe(testEmail);
  });
});