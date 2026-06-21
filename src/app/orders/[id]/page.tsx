import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Package, CreditCard } from "lucide-react";

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id: string }).id;
  const params = await props.params;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
        }
      }
    }
  });

  if (!order || order.userId !== userId) {
    notFound();
  }

  const araToplam = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const kdvAmount = araToplam * 0.20;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" /> Siparişlere Dön
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase mb-2">Sipariş Detayı</h1>
          <p className="text-muted-foreground">
            Sipariş No: <span className="font-medium text-foreground">{order.orderNumber}</span>
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-muted-foreground mb-1">Sipariş Tarihi</p>
          <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
        </div>
      </div>

      <div className="bg-secondary/20 border rounded-3xl p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Package className="h-5 w-5" /> Sipariş Durumu
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-green-600 text-lg uppercase tracking-wider">
              {order.status === "PAID" ? "Hazırlanıyor" : order.status}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Siparişiniz kargoya verilmek üzere hazırlanıyor.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-secondary/20 border rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Teslimat Bilgileri
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Alıcı</p>
              <p className="font-medium">{order.shippingName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Telefon</p>
              <p className="font-medium">{order.shippingPhone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Adres</p>
              <p className="font-medium">{order.shippingAddress}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 border rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Ödeme Bilgileri
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ödeme Yöntemi</p>
              <p className="font-medium">Kredi Kartı (Ödendi)</p>
            </div>
            <div className="pt-4 border-t mt-4">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span>₺{araToplam.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-muted-foreground">KDV (%20)</span>
                <span>₺{kdvAmount.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-muted-foreground">Kargo Ücreti</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Genel Toplam</span>
                <span>₺{order.totalAmount.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary/20 border rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6">Sipariş Edilen Ürünler</h2>
        <div className="space-y-6">
          {order.items.map(item => (
            <div key={item.id} className="flex gap-4 pb-6 border-b last:border-0 last:pb-0">
              <div className="w-20 h-20 bg-background rounded-xl overflow-hidden shrink-0 border relative">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">Numara: {item.size} • Adet: {item.quantity}</p>
                </div>
                <p className="font-bold">₺{item.price.toLocaleString('tr-TR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
