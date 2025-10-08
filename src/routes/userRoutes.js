import express from 'express';
import { getUsers, addUser,updateUser,deleteUser } from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',  getUsers);
router.post('/',  addUser);
router.put('/:id', authenticateJWT, updateUser);
router.delete('/:id', authenticateJWT, deleteUser);

export default router;
