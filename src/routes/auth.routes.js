import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validateRequest.js';
import { loginSchema } from '../validators/auth.schema.js';

const router = Router();

// Define a rota POST /api/auth/login
router.post('/login', validate(loginSchema), login);

export default router;