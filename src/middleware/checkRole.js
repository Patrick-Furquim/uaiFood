/**
 * Middleware para verificar o 'role' (papel) do usuário.
 * Ele deve ser usado *sempre depois* do middleware checkAuth.
 *
 * @param {string[]} allowedRoles - Um array de papéis permitidos (ex: ['ADMIN'] ou ['ADMIN', 'CLIENT'])
 */
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // O checkAuth (middleware anterior) deve ter adicionado req.user
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Autenticação falhou. Tente fazer login novamente.' });
    }

    const { role } = req.user;

    // Se o papel do usuário não está na lista de papéis permitidos
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para este recurso.' });
    }
    next();
  };
};