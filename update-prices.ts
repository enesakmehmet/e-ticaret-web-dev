import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  
  let updatedCount = 0;
  
  for (const product of products) {
    if (product.price < 1500) {
      // Multiply current price by 15 to get a realistic value above 1500
      let newPrice = product.price * 15;
      
      // Just to be absolutely sure it's not below 1500
      if (newPrice < 1500) {
        newPrice = 1500 + Math.floor(Math.random() * 500);
      }
      
      await prisma.product.update({
        where: { id: product.id },
        data: { price: newPrice }
      });
      
      console.log(`Updated ${product.name}: ${product.price} TL -> ${newPrice} TL`);
      updatedCount++;
    }
  }
  
  console.log(`Successfully updated ${updatedCount} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
