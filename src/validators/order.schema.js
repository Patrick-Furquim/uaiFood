import { z } from 'zod';

const orderItemSchema = z.object({
  listId: z.coerce.number().int().positive("ID do item (listId) inválido"), // ID do Item
  quantity: z.coerce.number().int().positive("Quantidade deve ser positiva"),
});

export const createOrderSchema = z.object({
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'Pix']), //
  status: z.string().min(1, "Status é obrigatório"),
  clienteId: z.coerce.number().int().positive("ID do Cliente inválido"),
  createdById: z.coerce.number().int().positive("ID do Criador inválido"),
  
  items: z.array(orderItemSchema)
           .min(1, "O pedido deve conter pelo menos um item"),
});

export const updateOrderStatusSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),
});