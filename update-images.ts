import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany();
  const shoesRaw = fs.readFileSync('./src/lib/shoes.json', 'utf8');
  const shoes = JSON.parse(shoesRaw);

  for (const product of products) {
    const matchingShoes = shoes.filter((s: { title: string, brand: string }) => s.brand.toLowerCase() === product.brand.toLowerCase());
    
    // Rastgele bir görsel seç
    let imageUrl = '/shoes/shoe-000.png';
    
    if (product.name.includes('Panda')) {
      const panda = shoes.find((s: { title: string, brand: string }) => s.title.includes('Panda'));
      const randomShoe = panda || matchingShoes[0];
      imageUrl = randomShoe ? randomShoe.image_url : '/shoes/shoe-021.png';
    } else if (product.name.includes('Air Jordan 1')) {
      const aj1 = shoes.find((s: { title: string, brand: string }) => s.title.includes('Air Jordan 1'));
      const randomShoe = aj1 || matchingShoes[0];
      imageUrl = randomShoe ? randomShoe.image_url : '/shoes/shoe-018.png';
    } else if (product.name.includes('Yeezy')) {
      const yeezy = shoes.find((s: { title: string, brand: string }) => s.title.includes('Yeezy') || s.brand === 'Adidas');
      imageUrl = yeezy ? yeezy.image_url : '/shoes/shoe-009.png';
    } else if (matchingShoes.length > 0) {
      const randomShoe = matchingShoes[Math.floor(Math.random() * matchingShoes.length)];
      imageUrl = randomShoe.image_url;
    } else {
      const randomShoe = shoes[Math.floor(Math.random() * shoes.length)];
      imageUrl = randomShoe.image_url;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl }
    });
    console.log(`Updated ${product.name} with ${imageUrl}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
