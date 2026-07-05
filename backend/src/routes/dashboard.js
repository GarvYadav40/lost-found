import express from 'express';
import { getDashboardItems } from '../controllers/userController.js';
import { syncAndRequireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/items
router.get('/items', syncAndRequireAuth, getDashboardItems);

export default router;
