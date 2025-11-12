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

const router = Router();

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', validate(updateOrderStatusSchema), updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;