import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller';
import { getUserById, updateUserById, deleteUserById, getAllUsersController } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// ...add more user routes as needed (CRUD, etc.)
// Get user by ID (requires authentication)
router.get('/:id', authenticateJWT, getUserById);

// Update user by ID (requires authentication)
router.put('/:id', authenticateJWT, updateUserById);

// Delete user by ID (requires authentication)
router.delete('/:id', authenticateJWT, deleteUserById);

// Get all users (requires authentication, admin check is in controller)
router.get('/', authenticateJWT, getAllUsersController);
export default router;