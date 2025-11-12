import { Router } from 'express';
import { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from '../controllers/category.controller.js';

import { validate } from '../middleware/validateRequest.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.schema.js';

const router = Router();

router.post('/', validate(createCategorySchema), createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', validate(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;