"use server";

import { prisma } from "@/lib/prisma";

/**
 * Kullanıcının girdiği arama sorgusuna göre ürünleri arayan server action.
 * @param query - Aranacak kelime veya metin.
 */
export async function searchProducts(query: string) {
  // Çok kısa sorgularda veritabanını yormamak için boş sonuç dön
  if (!query || query.length < 2) {
    return { success: true, products: [] };
  }

  try {
    // Ürün adı veya markasında (büyük/küçük harf duyarsız) eşleşen ilk 4 ürünü getir
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
