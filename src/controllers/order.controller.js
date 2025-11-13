import prisma from '../database/prismaClient.js';

export const createOrder = async (req, res) => {
  // Dados validados (incluindo o array 'items')
  const { paymentMethod, status, clienteId, createdById, items } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        paymentMethod,
        status,
        clienteId,
        createdById,
        OrderItem: {
          createMany: { // Cria os OrderItems aninhados
            data: items.map((item) => ({
              listId: item.listId,
              quantity: item.quantity,
            })),
          },
        },
      },
      include: {
        OrderItem: { 
          include: {
            list: true 
          }
        },
      },
    });
    res.status(201).json(order);
  } catch (error) {
    // P2003: clienteId, createdById ou um dos listId não existe
    if (error.code === 'P2003') {
        return res.status(404).json({ message: 'ID de Cliente, Criador ou Item não encontrado' });
    }
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  const { clienteId } = req.query;
  const { userId, role } = req.user; // Pego do token pelo checkAuth

  try {
    const whereClause = {};

    // Se for CLIENT, forçamos o filtro para SÓ os pedidos dele
    if (role === 'CLIENT') {
      whereClause.clienteId = userId;
    } 
    // Se for ADMIN e ele *passar* um clienteId (opcional), filtramos
    else if (role === 'ADMIN' && clienteId) {
      whereClause.clienteId = Number(clienteId);
    }
    // Se for ADMIN e não passar clienteId, o whereClause fica vazio e ele vê tudo

    const orders = await prisma.order.findMany({
      where: whereClause, // Aplicamos o filtro de segurança
      include: {
        cliente: {
          select: { name: true, phone: true }
        },
        OrderItem: {
          select: { quantity: true, list: { select: { description: true, unitPrice: true }} }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user; // Pego do token

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: true,
        createdBy: true,
        OrderItem: {
          include: {
            list: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Se for CLIENT, checamos se ele é o dono do pedido
    // Se não for o dono, retornamos 403 (Proibido)
    if (role === 'CLIENT' && order.clienteId !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Este pedido não é seu.' });
    }
    
    // Se for ADMIN ou o dono do pedido, pode ver
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Validado

  try {
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        status: status,
      },
    });
    res.status(200).json(order);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Deletar os OrderItems primeiro, depois o Order
    const deleteOrderItems = prisma.orderItem.deleteMany({
      where: { orderId: Number(id) },
    });

    const deleteOrder = prisma.order.delete({
      where: { id: Number(id) },
    });

    // Executa na transação
    await prisma.$transaction([deleteOrderItems, deleteOrder]);

    res.status(204).send();
  } catch (error) {
     if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    res.status(500).json({ message: error.message });
  }
};