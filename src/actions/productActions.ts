"use server";

import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string) {
  if (!query || query.length < 2) {
    return { success: true, products: [] };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 4,
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
      },
    });

    return { success: true, products };
  } catch (error) {
    console.error("Search error:", error);
    return { success: false, error: "Arama sırasında bir hata oluştu" };
  }
}
