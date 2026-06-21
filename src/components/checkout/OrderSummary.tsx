import { Package } from "lucide-react";
import { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  cartTotal: number;
}

export function OrderSummary({ items, cartTotal }: OrderSummaryProps) {
  return (
    <div className="w-full shrink-0 lg:w-96">
      <div className="sticky top-24 rounded-3xl bg-secondary/30 p-6">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
          <Package className="h-5 w-5" /> Sipariş Özeti
        </h2>
        <div className="mb-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between border-b pb-2 text-sm">
              <div className="pr-4">
                <p className="line-clamp-1 font-medium">{item.name}</p>
                <p className="text-muted-foreground">
                  Numara: {item.size} x {item.quantity}
                </p>
              </div>
              <p className="whitespace-nowrap font-bold">{(item.price * item.quantity).toLocaleString("tr-TR")} TL</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ara Toplam</span>
            <span className="font-medium">{cartTotal.toLocaleString("tr-TR")} TL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">KDV (%20)</span>
            <span className="font-medium">{(cartTotal * 0.20).toLocaleString("tr-TR")} TL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kargo Ücreti</span>
            <span className="font-medium text-green-600">Ücretsiz</span>
          </div>
          <div className="mt-4 flex items-end justify-between border-t pt-4">
            <span className="text-base font-bold">Genel Toplam</span>
            <span className="text-2xl font-black text-primary">{(cartTotal * 1.20).toLocaleString("tr-TR")} TL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
