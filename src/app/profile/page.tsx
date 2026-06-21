import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, User, LogOut, ChevronRight } from "lucide-react";
import ProfileForm from "./ProfileForm";
import AddressManager from "./AddressManager";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          items: true,
        }
      },
      addresses: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold tracking-tight uppercase mb-8">Hesabım</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-secondary/30 rounded-3xl p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg uppercase">
                {user.name.charAt(0)}{user.surname.charAt(0)}
              </div>
              <div>
                <p className="font-bold line-clamp-1">{user.name} {user.surname}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/profile" className="flex items-center justify-between p-3 rounded-xl bg-background border font-medium">
                <span className="flex items-center gap-2"><User className="h-4 w-4" /> Profilim</span>
              </Link>
              <Link href="/orders" className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
                <span className="flex items-center gap-2"><Package className="h-4 w-4" /> Siparişlerim</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <ProfileForm 
            user={user} 
            formattedDate={new Date(user.createdAt).toLocaleDateString('tr-TR')} 
          />

          <AddressManager addresses={user.addresses} />

          <section className="bg-secondary/20 border rounded-3xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Son Siparişlerim</h2>
              {user.orders.length > 0 && (
                <Link href="/orders" className="text-sm text-primary hover:underline font-medium">
                  Tümünü Gör
                </Link>
              )}
            </div>

            {user.orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Henüz hiç siparişiniz bulunmuyor.</p>
                <Link href="/products" className="inline-block mt-4 text-primary hover:underline font-medium">
                  Alışverişe Başla
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.orders.map(order => (
                  <Link href={`/orders/${order.id}`} key={order.id} className="block group">
                    <div className="bg-background border rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group-hover:border-primary/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm">{order.orderNumber}</p>
                          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-semibold">
                            {order.status === "PAID" ? "ÖDENDİ" : order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')} • {order.items.length} Ürün
                        </p>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <p className="font-bold text-lg">₺{order.totalAmount.toLocaleString('tr-TR')}</p>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
