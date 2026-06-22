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
      name: 'Adidas Gazelle Classic Green',
      brand: 'Adidas',
      description: 'Zarif yeşil süet tasarımı ve ikonik beyaz şeritleriyle klasik Gazelle tarzını yansıtan mükemmel bir günlük ayakkabı.',
      price: 3600,
      imageUrl: '/shoes/shoe-adidas-gazelle.png',
      categoryId: adidasCategory.id,
      isFeatured: true,
    },
    {
      name: 'Adidas Superstar Shell Toe White',
      brand: 'Adidas',
      description: 'Klasikleşmiş beyaz deri yüzeyi, siyah bantları ve unutulmaz kauçuk burun yapısıyla efsanevi Superstar.',
      price: 3800,
      imageUrl: '/shoes/shoe-adidas-superstar.png',
      categoryId: adidasCategory.id,
      isFeatured: true,
    },
    {
      name: 'Adidas Forum Low Royal Blue',
      brand: 'Adidas',
      description: 'Basketbol mirasından ilham alan cırt cırtlı bant tasarımı ve çarpıcı mavi detaylarıyla retro Forum Low.',
      price: 4100,
      imageUrl: '/shoes/shoe-adidas-forum.png',
      categoryId: adidasCategory.id,
      isFeatured: false,
    },
    {
      name: 'Adidas NMD R1 Core Black',
      brand: 'Adidas',
      description: 'Boost teknolojili orta tabanı ve karakteristik kırmızı/mavi tapalarıyla modern sokak stili NMD R1.',
      price: 5200,
      imageUrl: '/shoes/shoe-adidas-nmd.png',
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
          stock: 15,
        }
      });
    }
  }

  console.log('Successfully added 4 new high quality Adidas shoes to the database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
