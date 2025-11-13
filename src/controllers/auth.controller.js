import prisma from '../database/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { phone, password } = req.body; // Dados validados pelo Zod

  try {
    // 1. Encontrar o usuário pelo telefone
    const user = await prisma.user.findFirst({ // Usamos findFirst pois 'phone' não é @unique
      where: { phone: phone },
    });

    // 2. Verificar se o usuário existe
    if (!user) {
      return res.status(401).json({ message: 'Telefone ou senha inválidos' });
    }

    // 3. Comparar a senha enviada com o hash salvo no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Telefone ou senha inválidos' });
    }

    // 4. Gerar o Token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.Usertype, // Armazena o 'role' (ADMIN/CLIENT) no token
      },
      process.env.JWT_SECRET, // A chave secreta do .env
      {
        expiresIn: '8h', // O token expira em 8 horas
      }
    );

    // 5. Enviar o token e os dados do usuário (sem a senha)
    delete user.password;
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};