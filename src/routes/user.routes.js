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

const router = Router();

router.post('/', validate(createUserSchema), createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(updateUserSchema), updateUser);
router.put('/:userId/address', validate(updateAdressSchema), updateUserAddress);
router.delete('/:id', deleteUser);

export default router;