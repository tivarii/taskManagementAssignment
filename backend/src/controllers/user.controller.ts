import { Request, Response } from 'express';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { createUser, findUserByEmail, updateUser,getUser,deleteUser,getAllUsers  } from '../services/user.service';
import { AuthRequest } from '../middlewares/auth.middleware';
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

// Get a user by ID
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req?.user?.userId?.toString() || '';
    const userRole = req?.user?.role || " " ;

    const user = await getUser(userId, requestingUserId, userRole);
    res.json({ user });
  } catch (error) {
    res.status(403).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Update a user
export const updateUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req?.user?.userId?.toString() || '';
    const userRole = req?.user?.role || " " ;
    const updateData = req.body;

    const user = await updateUser(userId, requestingUserId, userRole, updateData);
    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(403).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Delete a user
export const deleteUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req?.user?.userId?.toString() || '';
    const userRole = req?.user?.role || " " ;

    await deleteUser(userId, requestingUserId, userRole);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(403).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Get all users (admin only)
export const getAllUsersController = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req?.user?.role || "USER";
    const users = await getAllUsers(userRole);
    res.json({ users });
  } catch (error) {
    res.status(403).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};