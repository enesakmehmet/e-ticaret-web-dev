import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import shoesData from '../src/lib/shoes.json'

const prisma = new PrismaClient()

const SIZES = ["38", "39", "40", "41", "42", "42.5", "43", "44", "44.5", "45", "46"];

async function main() {
  console.log('Seeding started...')

  // 1. Create Categories
  const nike = await prisma.category.upsert({
    where: { slug: 'nike' },
    update: {},
    create: { name: 'Nike', slug: 'nike' },
  })

  const adidas = await prisma.category.upsert({
    where: { slug: 'adidas' },
    update: {},
    create: { name: 'Adidas', slug: 'adidas' },
  })

  const jordan = await prisma.category.upsert({
    where: { slug: 'jordan' },
    update: {},
    create: { name: 'Jordan', slug: 'jordan' },
  })
  
  const newBalance = await prisma.category.upsert({
    where: { slug: 'new-balance' },
    update: {},
    create: { name: 'New Balance', slug: 'new-balance' },
  })

  // 2. Map Products from shoes.json
  // Brand is determined from the product TITLE (not from the unreliable brand field in JSON)
  
  function detectBrand(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('new balance') || t.includes('990') || t.includes('9060') || t.includes('1906') || t.includes('530') || t.includes('850') || t.includes('740') || t.includes('1000')) return 'New Balance';
    if (t.includes('jordan') || t.includes('air jordan')) return 'Jordan';
    if (t.includes('adidas') || t.includes('yeezy')) return 'Adidas';
    if (t.includes('nike') || t.includes('dunk') || t.includes('air force') || t.includes('air max')) return 'Nike';
    return 'Nike'; // fallback
  }

  const products = shoesData.map((p: any, index: number) => {
    const brandName = detectBrand(p.title);

    let catId = nike.id;
    if (brandName === 'Adidas') catId = adidas.id;
    if (brandName === 'Jordan') catId = jordan.id;
    if (brandName === 'New Balance') catId = newBalance.id;

    return {
      id: p.id,
      name: p.title,
      brand: brandName,
      description: `${brandName} imzalı ${p.title}. Koleksiyonunuz için birinci sınıf kalitede bir sneaker.`,
      price: parseInt(String(p.price).replace(/[^\d]/g, "")) || 3500,
      imageUrl: p.image_url,
      categoryId: catId,
      isFeatured: index < 6, // Make the first 6 featured for the homepage
    };
  });

  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });
    
    // Create sizes for each product
    for (const size of SIZES) {
      // 10 stock for all sizes
      const stock = 10;

      await prisma.productSize.upsert({
        where: {
          productId_size: {
            productId: createdProduct.id,
            size: size
          }
        },
        update: { stock },
        create: {
          productId: createdProduct.id,
          size,
          stock,
        }
      });
    }
  }

  // 3. Create Admin User (Optional, but helpful for testing)
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@stepspace.com' },
    update: {},
    create: {
      name: 'Admin',
      surname: 'User',
      email: 'admin@stepspace.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
