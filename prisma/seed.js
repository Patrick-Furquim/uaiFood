// prisma/seed.js
import { PrismaClient } from '../generated/prisma/index.js'; // Caminho correto para o seu client gerado

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o povoamento do banco (Seeding)...');

  // 1. Limpar dados antigos (opcional, mas bom para testes limpos)
  // A ordem importa por causa das chaves estrangeiras!
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  // Não deletamos usuários para você não perder seu login

  // 2. Criar Categorias
  const catLanches = await prisma.category.create({
    data: { description: 'Lanches' },
  });

  const catBebidas = await prisma.category.create({
    data: { description: 'Bebidas' },
  });

  const catSobremesas = await prisma.category.create({
    data: { description: 'Sobremesas' },
  });

  // 3. Criar Itens
  await prisma.item.createMany({
    data: [
      { description: 'X-Tudo Monstro', unitPrice: 25.50, categoryId: catLanches.id },
      { description: 'X-Salada', unitPrice: 18.00, categoryId: catLanches.id },
      { description: 'Coca-Cola 2L', unitPrice: 12.00, categoryId: catBebidas.id },
      { description: 'Suco de Laranja', unitPrice: 8.50, categoryId: catBebidas.id },
      { description: 'Pudim de Leite', unitPrice: 7.00, categoryId: catSobremesas.id },
    ],
  });

  console.log('✅ Banco de dados povoado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });