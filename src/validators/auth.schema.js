import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().min(1, "O telefone é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});