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

//middlewares de segurança
import { checkAuth } from '../middleware/checkAuth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = Router();

//Proteger rotas de 'escrita' (ADMIN)
router.post('/',    checkAuth, checkRole(['ADMIN']), validate(createItemSchema), createItem);
router.put('/:id',  checkAuth, checkRole(['ADMIN']), validate(updateItemSchema), updateItem);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), deleteItem);

//rotas de 'leitura' públicas
router.get('/', getAllItems);
router.get('/:id', getItemById);

export default router;