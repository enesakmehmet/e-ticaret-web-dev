import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SIZES = ["38", "39", "40", "41", "42", "42.5", "43", "44", "44.5", "45", "46"];

async function main() {
  const adidasCategory = await prisma.category.findUnique({
    where: { slug: 'adidas' }
  });

  if (!adidasCategory) {
    throw new Error("Adidas category not found");
  }

  const newAdidas = [
    {
      name: 'Adidas Samba OG Cloud White',
      brand: 'Adidas',
      description: 'Klasik futbol stilinden ilham alan, zamansız tasarımıyla sokak modasının vazgeçilmezi olan ikonik Samba OG.',
      price: 3200,
      imageUrl: '/shoes/shoe-020.png',
      categoryId: adidasCategory.id,
      isFeatured: true,
    },
    {
      name: 'Adidas Yeezy Boost 350 V2 Bone',
      brand: 'Adidas',
      description: 'Kanye West işbirliğiyle tasarlanan, Primeknit üst yüzeyi ve tam boy Boost yastıklamasıyla ultra konfor sunan model.',
      price: 8500,
      imageUrl: '/shoes/shoe-021.png',
      categoryId: adidasCategory.id,
      isFeatured: true,
    },
    {
      name: 'Adidas Campus 00s Core Black',
      brand: 'Adidas',
      description: '2000\'lerin kaykay stilini geri getiren, kalın bağcıkları ve dolgun yapısıyla öne çıkan Campus modeli.',
      price: 3500,
      imageUrl: '/shoes/shoe-022.png',
      categoryId: adidasCategory.id,
      isFeatured: false,
    },
    {
      name: 'Adidas Ultraboost 1.0 Core Black',
      brand: 'Adidas',
      description: 'Gelişmiş enerji dönüşümü sağlayan Boost orta tabanı ve ayağı saran Primeknit yapısıyla koşu ve günlük kullanım için ideal.',
      price: 5400,
      imageUrl: '/shoes/shoe-023.png',
      categoryId: adidasCategory.id,
      isFeatured: false,
    }
  ];

  for (const product of newAdidas) {
    const createdProduct = await prisma.product.create({
      data: product
    });
    
    console.log(`Created ${product.name}`);

    for (const size of SIZES) {
      await prisma.productSize.create({
        data: {
          productId: createdProduct.id,
          size,
          stock: 10,
        }
      });
    }
  }

  console.log('Successfully added 4 new Adidas shoes to the database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
