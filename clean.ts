import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.review.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("DB Cleaned");
}

main().finally(() => prisma.$disconnect());
