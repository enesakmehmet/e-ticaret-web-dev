"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Kullanıcı profil bilgilerini (ad, soyad) güncelleyen server action.
 * @param data - Güncellenecek ad ve soyad bilgisi.
 */
export async function updateProfile(data: { name: string; surname: string }) {
  // Güvenlik: İşlemi yapan kullanıcının oturumunu kontrol et
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Yetkisiz erişim" };
  }

  try {
    // Prisma ile e-postaya göre kullanıcıyı bul ve bilgilerini güncelle
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

/**
 * Kullanıcıya yeni bir adres ekleyen server action.
 * @param data - Eklenecek adresin detayları (başlık, isim, telefon, şehir, ilçe, açık adres vb.)
 */
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
    // Eğer yeni eklenen adres varsayılan (default) olarak işaretlendiyse, 
    // kullanıcının diğer adreslerindeki varsayılan bayraklarını kaldır.
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

/**
 * Mevcut bir adresi güncelleyen server action.
 * @param id - Güncellenecek adresin benzersiz ID'si.
 * @param data - Yeni adres bilgileri.
 */
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
    // Güvenlik: Güncellenmek istenen adresin gerçekten bu kullanıcıya ait olduğunu doğrula (Ownership check)
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

/**
 * Kullanıcıya ait bir adresi silen server action.
 * @param id - Silinecek adresin benzersiz ID'si.
 */
export async function deleteAddress(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, error: "Yetkisiz erişim" };
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { success: false, error: "Kullanıcı bulunamadı" };

  try {
    // Güvenlik: Silinmek istenen adresin sahibi ile oturumdaki kullanıcı eşleşiyor mu kontrolü
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

/**
 * Geçerli oturumdaki kullanıcının tüm adreslerini listeleyen server action.
 */
export async function getUserAddresses() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { success: false, addresses: [], error: "Yetkisiz erişim" };
  }

  try {
    // Kullanıcıyı bulurken "addresses" ilişkisini de include (dahil) et
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
