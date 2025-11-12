import { Router } from 'express';
import { 
  createItem, 
  getAllItems, 
  getItemById, 
  updateItem, 
  deleteItem 
} from '../controllers/item.controller.js';

import { validate } from '../middleware/validateRequest.js';
import { createItemSchema, updateItemSchema } from '../validators/item.schema.js';

const router = Router();

router.post('/', validate(createItemSchema), createItem); // Create item with validation
router.get('/', getAllItems);// List all items
router.get('/:id', getItemById);// Get item by ID
router.put('/:id', validate(updateItemSchema), updateItem);// Update item with validation
router.delete('/:id', deleteItem);// Delete item by ID

export default router;