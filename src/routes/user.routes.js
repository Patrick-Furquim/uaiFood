import { Router } from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  updateUserAddress, 
  deleteUser 
} from '../controllers/user.controller.js';

import { validate } from '../middleware/validateRequest.js';
import { createUserSchema, updateUserSchema, updateAdressSchema } from '../validators/user.schema.js';

//middlewares de segurança
import { checkAuth } from '../middleware/checkAuth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = Router();

//Rota Pública (Registro de novo usuário)
router.post('/', validate(createUserSchema), createUser);

//Rotas de gerenciamento (ADMIN)
router.get('/',           checkAuth, checkRole(['ADMIN']), getAllUsers);
router.get('/:id',        checkAuth, checkRole(['ADMIN']), getUserById);
router.put('/:id',        checkAuth, checkRole(['ADMIN']), validate(updateUserSchema), updateUser);
router.put('/:userId/address', checkAuth, checkRole(['ADMIN']), validate(updateAdressSchema), updateUserAddress);
router.delete('/:id',     checkAuth, checkRole(['ADMIN']), deleteUser);

export default router;