import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log("Existing products:");
  for (const p of products) {
    console.log(`${p.id} | ${p.name} | ${p.brand} | ${p.imageUrl}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
