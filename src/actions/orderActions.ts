"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CartItem, CreateOrderRequest } from "@/types";

function isValidMockPayment(paymentDetails: CreateOrderRequest["paymentDetails"]) {
  const sanitizedCard = paymentDetails.cardNumber.replace(/\s+/g, "");
  const expiryPattern = /^\d{2}\/\d{2}$/;
  const cvcPattern = /^\d{3,4}$/;

  return sanitizedCard.length >= 12 && expiryPattern.test(paymentDetails.expiry) && cvcPattern.test(paymentDetails.cvc);
}

export async function createOrderAction(body: CreateOrderRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, message: "Oturum açmanız gerekiyor." };
    }

    const { items, shippingDetails, paymentDetails, totalAmount } = body;

    if (!items?.length || !shippingDetails || !paymentDetails || !totalAmount) {
      return { success: false, message: "Eksik bilgi girdiniz." };
    }

    if (!isValidMockPayment(paymentDetails)) {
      return { success: false, message: "Mock ödeme bilgileri geçersiz." };
    }

    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.$transaction(async (tx) => {
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
