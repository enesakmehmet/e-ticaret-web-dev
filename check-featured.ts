import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const featured = await prisma.product.findMany({
    where: { isFeatured: true }
  });
  
  console.log("Featured Products:");
  featured.forEach(p => {
    console.log(`- ${p.name}:`);
    console.log(`  ${p.description}`);
  });
}

main().finally(() => prisma.$disconnect());
