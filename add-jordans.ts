import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SIZES = ["38", "39", "40", "41", "42", "42.5", "43", "44", "44.5", "45", "46"];

async function main() {
  const jordanCategory = await prisma.category.findUnique({
    where: { slug: 'jordan' }
  });

  if (!jordanCategory) {
    throw new Error("Jordan category not found");
  }

  const newJordans = [
    {
      name: 'Air Jordan 1 Retro Low Dior',
      brand: 'Jordan',
      description: 'Dior ve Jordan Brand arasında, swoosh üzerinde Dior Oblique monogramı öne çıkan ultra premium işbirliği.',
      price: 85000,
      imageUrl: '/shoes/shoe-015.png',
      categoryId: jordanCategory.id,
      isFeatured: true,
    },
    {
      name: 'Air Jordan 4 Retro University Blue',
      brand: 'Jordan',
      description: 'Kolej tarzından ilham alan, birinci sınıf açık mavi süet ve klasik file detaylarıyla öne çıkan bir renk grubu.',
      price: 6500,
      imageUrl: '/shoes/shoe-016.png',
      categoryId: jordanCategory.id,
      isFeatured: true,
    },
    {
      name: 'Air Jordan 1 Retro High OG Bred',
      brand: 'Jordan',
      description: 'Her şeyi başlatan ikonik "Banned" (Yasaklı) renk grubu, siyah ve kırmızı birinci sınıf deri detaylarla.',
      price: 9000,
      imageUrl: '/shoes/shoe-017.png',
      categoryId: jordanCategory.id,
      isFeatured: true,
    },
    {
      name: 'Air Jordan 5 Retro Off-White Black',
      brand: 'Jordan',
      description: 'Virgil Abloh\'un sentetik materyaller ve dairesel kesiklere sahip Air Jordan 5\'e yapıbozumcu yaklaşımı.',
      price: 15500,
      imageUrl: '/shoes/shoe-018.png',
      categoryId: jordanCategory.id,
      isFeatured: true,
    }
  ];

  for (const product of newJordans) {
    const createdProduct = await prisma.product.create({
      data: product
    });
    
    console.log(`Created ${product.name}`);

    for (const size of SIZES) {
      await prisma.productSize.create({
        data: {
          productId: createdProduct.id,
          size,
          stock: 5,
        }
      });
    }
  }

  console.log('Successfully added 4 new Jordan shoes to the database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
