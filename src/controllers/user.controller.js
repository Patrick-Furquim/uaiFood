import prisma from '../database/prismaClient.js';
// TODO: Instalar (npm install bcryptjs) e importar bcrypt para hashear a senha
// import bcrypt from 'bcryptjs';
// CREATE
export const createUser = async (req, res) => {
  const { name, phone, password, Usertype, adress } = req.body;

  try {
    // TODO: Hashear a senha
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: password, // Substituir por hashedPassword
        Usertype,
        adress: {
          create: adress, // Cria o endereço aninhado
        },
      },
      include: {
        adress: true,
      },
    });
    // Não retorne a senha!
    delete user.password;
    res.status(201).json(user);
  } catch (error) {
     if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Telefone já cadastrado' });
    }
    res.status(500).json({ message: error.message });
  }
};
// READ (All)
export const getAllUsers = async (req, res) => {
   try {
    const users = await prisma.user.findMany({
      include: { adress: true },
      // TODO: Remover senhas da listagem
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// READ (One)
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { adress: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    // Não retorne a senha!
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // TODO: Se a senha for atualizada, hashear
  // if (data.password) {
  //   data.password = await bcrypt.hash(data.password, 10);
  // }

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: data,
    });
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(500).json({ message: error.message });
  }
};
// UPDATE Adress do Usuário
export const updateUserAddress = async (req, res) => {
  const { userId } = req.params;
  const adressData = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { adressId: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const updatedAddress = await prisma.adress.update({
      where: { id: user.adressId },
      data: adressData,
    });
    res.status(200).json(updatedAddress);
  } catch (error) {
     if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Endereço não encontrado para este usuário' });
    }
    res.status(500).json({ message: error.message });
  }
};
// DELETE
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Relação 1:1, precisamos deletar o endereço também
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { adressId: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Transação para deletar Usuário e Endereço
    await prisma.$transaction([
      prisma.user.delete({ where: { id: Number(id) } }),
      prisma.adress.delete({ where: { id: user.adressId } })
    ]);

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
     // P2003: Tentando deletar usuário que tem Pedidos
     if (error.code === 'P2003') {
      return res.status(409).json({ message: 'Não é possível deletar. Usuário possui pedidos.' });
    }
    res.status(500).json({ message: error.message });
  }
};