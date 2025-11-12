import { z } from 'zod';

export const createCategorySchema = z.object({
  description: z.string({
    required_error: "Descrição é obrigatória",
  }).min(3, "Descrição deve ter no mínimo 3 caracteres"),
});

// Schema para atualização (PUT/PATCH), onde os campos são opcionais
export const updateCategorySchema = z.object({
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres").optional(),
});