import { z } from 'zod';

export const createItemSchema = z.object({
  description: z.string().min(3, "Descrição muito curta"),
  unitPrice: z.coerce.number({ // 'coerce' tenta converter (ex: "10.50" -> 10.50)
      required_error: "Preço unitário é obrigatório",
      invalid_type_error: "Preço unitário deve ser um número",
    }).positive("Preço deve ser positivo"),
  categoryId: z.coerce.number({
      required_error: "ID da Categoria é obrigatório",
    }).int().positive("ID da Categoria inválido"),
});

export const updateItemSchema = z.object({
  description: z.string().min(3, "Descrição muito curta").optional(),
  unitPrice: z.coerce.number()
    .positive("Preço deve ser positivo")
    .optional(),
  categoryId: z.coerce.number()
    .int()
    .positive("ID da Categoria inválido")
    .optional(),
});