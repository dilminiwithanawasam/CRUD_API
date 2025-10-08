import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

// Example of role-protected routes
router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin! This is admin only content.' });
});

router.get('/manager-dashboard', authenticateToken, authorizeRoles('admin', 'manager'), (req, res) => {
  res.json({ message: 'Welcome to Manager Dashboard!' });
});

router.get('/user-content', authenticateToken, authorizeRoles('admin', 'manager', 'user'), (req, res) => {
  res.json({ message: 'Welcome user! This is general content.' });
});

export default router;