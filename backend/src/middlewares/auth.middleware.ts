import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();
// import { AuthRequest } from '../interfaces/authRequest.interface';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req?.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  // console.log('Token:', token);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};