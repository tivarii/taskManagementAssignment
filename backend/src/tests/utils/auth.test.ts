import { hashPassword , comparePassword, generateToken} from "../../utils/auth";

describe('Auth Utils', () => {
  it('should hash and compare password correctly', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    expect(await comparePassword(password, hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });

  it('should generate a valid JWT token', () => {
    const token = generateToken({ userId: 1, role: 'USER' });
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts
  });
});