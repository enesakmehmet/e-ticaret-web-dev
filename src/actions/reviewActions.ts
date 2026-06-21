"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createReviewAction(data: { productId: string; rating: number; comment: string }) {
  try {
    const session = await getServerSession(authOptions);

    const { productId, rating, comment } = data;

    if (!productId || !rating || !comment) {
      return { success: false, message: "Eksik bilgi gönderildi." };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, message: "Puan 1 ile 5 arasında olmalıdır." };
    }

    const userId = session?.user && (session.user as { id?: string }).id ? (session.user as { id: string }).id : null;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: Number(rating),
        comment,
      },
      include: {
        user: {
          select: {
            name: true,
            surname: true,
          }
        }
      }
    });

    return { success: true, message: "Yorum başarıyla eklendi.", review };
  } catch (error) {
    console.error("Review creation error:", error);
    return { success: false, message: "Yorum eklenirken bir hata oluştu." };
  }
}
