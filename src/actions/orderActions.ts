"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CartItem, CreateOrderRequest } from "@/types";

/**
 * Sahte (mock) ödeme bilgilerinin geçerliliğini kontrol eden yardımcı fonksiyon.
 * @param paymentDetails - Kullanıcının girdiği ödeme detayları.
 * @returns boolean - Bilgiler geçerli formattaysa true döner.
 */
function isValidMockPayment(paymentDetails: CreateOrderRequest["paymentDetails"]) {
  // Kart numarasındaki boşlukları temizle
  const sanitizedCard = paymentDetails.cardNumber.replace(/\s+/g, "");
  // Son kullanma tarihi formatı kontrolü (MM/YY)
  const expiryPattern = /^\d{2}\/\d{2}$/;
  // CVC formatı kontrolü (3 veya 4 haneli)
  const cvcPattern = /^\d{3,4}$/;

  return sanitizedCard.length >= 12 && expiryPattern.test(paymentDetails.expiry) && cvcPattern.test(paymentDetails.cvc);
}

/**
 * Kullanıcı için yeni bir sipariş oluşturan server action (sunucu eylemi).
 * @param body - Sepet içeriği, kargo ve ödeme bilgileri dahil sipariş isteği.
 */
export async function createOrderAction(body: CreateOrderRequest) {
  try {
    // Oturum bilgisini alarak kullanıcının giriş yapıp yapmadığını kontrol et
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Oturum açmanız gerekiyor." };
    }

    const { items, shippingDetails, paymentDetails, totalAmount } = body;

    // Gerekli verilerin eksik olup olmadığını kontrol et
    if (!items?.length || !shippingDetails || !paymentDetails || !totalAmount) {
      return { success: false, message: "Eksik bilgi girdiniz." };
    }

    if (!isValidMockPayment(paymentDetails)) {
      return { success: false, message: "Mock ödeme bilgileri geçersiz." };
    }

    // Benzersiz bir sipariş numarası oluştur (Örn: ORD-20231015-1234)
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Prisma transaction kullanarak sipariş oluşturma ve stok güncelleme işlemlerini atomik olarak gerçekleştir
    const order = await prisma.$transaction(async (tx) => {
      // 1. Siparişi veritabanına kaydet
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          totalAmount,
          status: "PAID",
          shippingName: shippingDetails.fullName,
          shippingAddress: shippingDetails.address,
          shippingPhone: shippingDetails.phone,
          paymentMethod: `MOCK_CARD_${paymentDetails.cardNumber.replace(/\s+/g, "").slice(-4)}`,
          items: {
            create: items.map((item: CartItem) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Siparişteki her bir ürün için ilgili bedenin stoğunu düşür
      for (const item of items) {
        await tx.productSize.update({
          where: { 
            productId_size: {
              productId: item.productId,
              size: item.size,
            }
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return {
      success: true,
      message: "Sipariş başarıyla oluşturuldu.",
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  } catch (err: unknown) {
    console.error("Order creation error:", err);
    const errorMessage = err instanceof Error ? err.message : "Sipariş oluşturulurken bir hata meydana geldi.";
    return { success: false, message: errorMessage };
  }
}
