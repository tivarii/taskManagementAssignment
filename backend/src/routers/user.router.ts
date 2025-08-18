import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller';

const router = Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// ...add more user routes as needed (CRUD, etc.)

export default router;