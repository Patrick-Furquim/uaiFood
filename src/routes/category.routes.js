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

//middlewares de segurança
import { checkAuth } from '../middleware/checkAuth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = Router();

// Proteger rotas de 'escrita' (ADMIN)
// Ordem: Autentica -> Autoriza -> Valida -> Executa
router.post('/',    checkAuth, checkRole(['ADMIN']), validate(createCategorySchema), createCategory);
router.put('/:id',  checkAuth, checkRole(['ADMIN']), validate(updateCategorySchema), updateCategory);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), deleteCategory);

// 3. Manter rotas de 'leitura' públicas (qualquer um pode ver o cardápio)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

export default router;