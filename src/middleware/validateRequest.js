import { z } from 'zod';

/**
 * Middleware de validação do Zod.
 * Valida o 'req.body'. Se falhar, retorna erro 400.
 * Se passar, substitui req.body pelos dados validados (com coerção de tipo).
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      message: "Dados inválidos",
      errors: errors
    });
  }

  // Substitui o req.body pelos dados limpos e tipados
  req.body = result.data; 
  
  return next();
};