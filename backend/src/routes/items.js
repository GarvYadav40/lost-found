import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController.js';
import { syncAndRequireAuth, optionalAuth } from '../middleware/auth.js';
import { itemSchema, validateBody } from '../middleware/validation.js';

const router = express.Router();

// GET /api/items
router.get('/', optionalAuth, getItems);

// GET /api/items/:id
router.get('/:id', getItemById);

// POST /api/items
router.post('/', syncAndRequireAuth, validateBody(itemSchema), createItem);

// PUT /api/items/:id
router.put('/:id', syncAndRequireAuth, validateBody(itemSchema), updateItem);

// DELETE /api/items/:id
router.delete('/:id', syncAndRequireAuth, deleteItem);

export default router;
