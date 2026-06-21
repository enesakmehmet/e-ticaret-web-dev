import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, Receipt } from "lucide-react";

export default async function CheckoutSuccessPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const orderNumber = typeof searchParams.orderNumber === "string" ? searchParams.orderNumber : undefined;

  return (
    <div className="container mx-auto flex justify-center px-4 py-24">
      <div className="w-full max-w-2xl rounded-3xl border border-border/50 bg-secondary/20 p-8 text-center md:p-12">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 blur-2xl" />
            <CheckCircle2 className="relative z-10 h-24 w-24 text-green-500" />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-black tracking-tight uppercase text-green-500">Siparisiniz Alindi</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Tesekkur ederiz. Siparisiniz basariyla olusturuldu ve isleme alindi.
        </p>

        {orderNumber && (
          <div className="mx-auto mb-8 inline-block w-full max-w-sm rounded-2xl border bg-background p-6">
            <p className="mb-1 text-sm text-muted-foreground">Siparis Numarasi</p>
            <p className="font-mono text-xl font-bold">{orderNumber}</p>
          </div>
        )}

        <div className="mb-10 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div className="flex flex-col items-center rounded-2xl border bg-background p-4 text-center">
            <Package className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-1 font-bold">Hazirlaniyor</h3>
            <p className="text-xs text-muted-foreground">Urunleriniz ozenle paketleniyor</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border bg-background p-4 text-center opacity-50">
            <Truck className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-1 font-bold">Kargolandi</h3>
            <p className="text-xs text-muted-foreground">Siparisiniz yola cikti</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border bg-background p-4 text-center opacity-50">
            <Receipt className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-1 font-bold">Teslim Edildi</h3>
            <p className="text-xs text-muted-foreground">Adresinize ulasti</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/orders">
            <Button variant="outline" size="lg" className="h-12 w-full sm:w-auto">
              Siparislerimi Gor
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" className="h-12 w-full sm:w-auto">
              Alisverise Devam Et
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
