import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    include: { sizes: true }
  })
  console.log(JSON.stringify(products.map(p => ({ name: p.name, sizesCount: p.sizes.length })), null, 2))
}

main()
