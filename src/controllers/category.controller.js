import prisma from '../database/prismaClient.js';

// CREATE
export const createCategory = async (req, res) => {
  const { description } = req.body; // Dados já validados pelo Zod
  try {
    const category = await prisma.category.create({
      data: { description },
    });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Categoria já existe' });
    }
    res.status(500).json({ message: error.message });
  }
};

// READ (All)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body; // Validado
  try {
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { description },
    });
    res.status(200).json(category);
  } catch (error) {
    if (error.code === 'P2025') { // Recurso não encontrado
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
     if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Essa descrição de categoria já existe' });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    // P2003: Tentando deletar categoria que tem itens ligados a ela
     if (error.code === 'P2003') {
      return res.status(409).json({ message: 'Não é possível deletar. Categoria está em uso por Itens.' });
    }
    res.status(500).json({ message: error.message });
  }
};