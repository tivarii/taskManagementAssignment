import { Request, Response } from 'express';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { createUser, findUserByEmail } from '../services/user.service';

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await hashPassword(password);
    const user = await createUser({ email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken({ userId: user.id, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};