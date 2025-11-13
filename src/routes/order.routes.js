import { Router } from 'express';
import { 
  createOrder, 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus, 
  deleteOrder 
} from '../controllers/order.controller.js';

import { validate } from '../middleware/validateRequest.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.schema.js';

//middlewares de segurança
import { checkAuth } from '../middleware/checkAuth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = Router();

//Rotas para CLIENTES ou ADMINS
router.post('/',    checkAuth, checkRole(['CLIENT', 'ADMIN']), validate(createOrderSchema), createOrder);
router.get('/',     checkAuth, checkRole(['CLIENT', 'ADMIN']), getAllOrders);
router.get('/:id',  checkAuth, checkRole(['CLIENT', 'ADMIN']), getOrderById);

//Rotas apenas para ADMINS (gerenciamento)
router.put('/:id',  checkAuth, checkRole(['ADMIN']), validate(updateOrderStatusSchema), updateOrderStatus);
router.delete('/:id', checkAuth, checkRole(['ADMIN']), deleteOrder);

export default router;