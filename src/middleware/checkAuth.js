import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  // 1. Pega o token do header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  // O token vem no formato "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token mal formatado.' });
  }

  try {
    // 2. Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Anexa os dados do usuário (payload) à requisição
    // Agora, todas as rotas protegidas terão acesso a req.user
    req.user = decoded;
    
    // 4. Continua para a próxima função (o controller)
    next(); 
  } catch (error) {
    // Se o token for inválido (expirado, assinatura errada)
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};