import { Router } from 'express';
import categoryRoutes from './category.routes.js';
import itemRoutes from './item.routes.js';
import userRoutes from './user.routes.js';
import orderRoutes from './order.routes.js';
import authRoutes from './auth.routes.js';  

const router = Router();

router.use('/auth', authRoutes); 
router.use('/categories', categoryRoutes);
router.use('/items', itemRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);

export default router;