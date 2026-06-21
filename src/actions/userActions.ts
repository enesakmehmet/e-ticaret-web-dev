"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string; surname: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Yetkisiz erişim" };
  }

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        surname: data.surname,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Profil güncellenirken bir hata oluştu" };
  }
}

export async function addAddress(data: {
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  isDefault?: boolean;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Yetkisiz erişim" };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false, error: "Kullanıcı bulunamadı" };

  try {
    // If setting as default, unset others
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Add address error:", error);
    return { success: false, error: "Adres eklenirken bir hata oluştu" };
  }
}

export async function updateAddress(
  id: string,
  data: {
    title: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    fullAddress: string;
    isDefault?: boolean;
  }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Yetkisiz erişim" };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false, error: "Kullanıcı bulunamadı" };

  try {
    // Verify ownership
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) {
      return { success: false, error: "Yetkisiz işlem veya adres bulunamadı" };
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    await prisma.address.update({
      where: { id },
      data,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Update address error:", error);
    return { success: false, error: "Adres güncellenirken bir hata oluştu" };
  }
}

export async function deleteAddress(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Yetkisiz erişim" };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false, error: "Kullanıcı bulunamadı" };

  try {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) {
      return { success: false, error: "Yetkisiz işlem veya adres bulunamadı" };
    }

    await prisma.address.delete({ where: { id } });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Delete address error:", error);
    return { success: false, error: "Adres silinirken bir hata oluştu" };
  }
}

export async function getUserAddresses() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, addresses: [], error: "Yetkisiz erişim" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { addresses: true },
    });

    if (!user) {
      return { success: false, addresses: [], error: "Kullanıcı bulunamadı" };
    }

    return { success: true, addresses: user.addresses };
  } catch (error) {
    console.error("Get addresses error:", error);
    return { success: false, addresses: [], error: "Adresler getirilirken hata oluştu" };
  }
}
