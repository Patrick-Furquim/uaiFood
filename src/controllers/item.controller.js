import prisma from '../database/prismaClient.js';

// CREATE
export const createItem = async (req, res) => {
  // Dados já validados e convertidos pelo Zod (unitPrice e categoryId são numbers)
  const { description, unitPrice, categoryId } = req.body;

  try {
    const item = await prisma.item.create({
      data: {
        description,
        unitPrice,
        categoryId,
      },
      include: {
        category: true,
      },
    });
    res.status(201).json(item);
  } catch (error) {
    // P2003: categoryId não existe
    if (error.code === 'P2003') {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(500).json({ message: error.message });
  }
};
// READ (All)
export const getAllItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
      },
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// READ (One)
export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
      },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const data = req.body; // Dados validados (description, unitPrice, categoryId)

  try {
    const item = await prisma.item.update({
      where: { id: Number(id) },
      data: data, // Zod garante que só campos válidos estão aqui
    });
    res.status(200).json(item);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    if (error.code === 'P2003') {
      return res.status(404).json({ message: 'Categoria (categoryId) não encontrada' });
    }
    res.status(500).json({ message: error.message });
  }
};
// DELETE
export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.item.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    // P2003: Tentando deletar item que está em um OrderItem
     if (error.code === 'P2003') {
      return res.status(409).json({ message: 'Não é possível deletar. Item está em uso por Pedidos.' });
    }
    res.status(500).json({ message: error.message });
  }
};