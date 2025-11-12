import { z } from 'zod';

// Baseado no schema.prisma
const adressSchemaBase = {
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório").max(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().length(8, "CEP deve ter 8 dígitos (sem traço)"),
};

export const createAdressSchema = z.object(adressSchemaBase);

export const updateAdressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória").optional(),
  number: z.string().min(1, "Número é obrigatório").optional(),
  district: z.string().min(1, "Bairro é obrigatório").optional(),
  city: z.string().min(1, "Cidade é obrigatória").optional(),
  state: z.string().min(2, "Estado é obrigatório").max(2, "Estado deve ter 2 caracteres").optional(),
  zipCode: z.string().length(8, "CEP deve ter 8 dígitos (sem traço)").optional(),
});

export const createUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos (com DDD)"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  Usertype: z.enum(['ADMIN', 'CLIENT']), //
  adress: createAdressSchema, // Validação aninhada
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, "Telefone deve ter no mínimo 10 dígitos (com DDD)").optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
  Usertype: z.enum(['ADMIN', 'CLIENT']).optional(),
});