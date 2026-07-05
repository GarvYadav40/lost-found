import express from 'express';
import { getCurrentUser } from '../controllers/userController.js';
import { syncAndRequireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/me
router.get('/me', syncAndRequireAuth, getCurrentUser);

export default router;
