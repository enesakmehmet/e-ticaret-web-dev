"use client";

import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, itemCount } = useCart();
  const { dict } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <div className="bg-secondary/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Trash2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">{dict.cart.empty}</h1>
        <Link href="/products">
          <Button size="lg" className="w-full">
            {dict.cart.continueShopping}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight uppercase mb-8">{dict.cart.title} ({itemCount})</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 md:gap-6 pb-6 border-b">
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-secondary/50 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover mix-blend-multiply"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Numara: {item.size}</p>
                  </div>
                  <p className="font-bold text-lg whitespace-nowrap">
                    ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-3 border rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 hover:bg-secondary rounded-md disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-secondary rounded-md"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:underline text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Kaldır
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-secondary/30 rounded-3xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Sipariş Özeti</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Ara Toplam</span>
                <span>₺{cartTotal.toLocaleString("tr-TR")}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>KDV (%20)</span>
                <span>₺{(cartTotal * 0.20).toLocaleString("tr-TR")}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-end">
                <span className="text-base font-bold">{dict.cart.total}</span>
                <span className="text-2xl font-black">₺{(cartTotal * 1.20).toLocaleString("tr-TR")}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full h-14 text-lg">
                {dict.cart.checkout} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
