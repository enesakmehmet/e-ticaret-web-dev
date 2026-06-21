import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing brands and categories...');

  // Get categories
  const nike = await prisma.category.findUnique({ where: { slug: 'nike' } });
  const adidas = await prisma.category.findUnique({ where: { slug: 'adidas' } });
  const jordan = await prisma.category.findUnique({ where: { slug: 'jordan' } });
  const newBalance = await prisma.category.findUnique({ where: { slug: 'new-balance' } });

  if (!nike || !adidas || !jordan || !newBalance) {
    throw new Error("Categories not found!");
  }

  const products = await prisma.product.findMany();

  for (const p of products) {
    let newBrand = p.brand;
    let newCatId = p.categoryId;
    
    const titleLower = p.name.toLowerCase();

    if (titleLower.includes('new balance')) {
      newBrand = 'New Balance';
      newCatId = newBalance.id;
    } else if (titleLower.includes('jordan')) {
      newBrand = 'Jordan';
      newCatId = jordan.id;
    } else if (titleLower.includes('adidas') || titleLower.includes('yeezy')) {
      newBrand = 'Adidas';
      newCatId = adidas.id;
    } else if (titleLower.includes('nike') || titleLower.includes('dunk') || titleLower.includes('air force')) {
      newBrand = 'Nike';
      newCatId = nike.id;
    }

    if (newBrand !== p.brand || newCatId !== p.categoryId) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          brand: newBrand,
          categoryId: newCatId,
          description: p.description.replace(p.brand, newBrand) // Update description if it contains the wrong brand
        }
      });
      console.log(`Updated ${p.name}: ${p.brand} -> ${newBrand}`);
    }
  }

  console.log('Finished updating brands!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
