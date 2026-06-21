import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-secondary/50 p-6 rounded-full mb-8">
        <SearchX className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="text-6xl font-black tracking-tighter mb-4 text-primary">404</h1>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Sayfa Bulunamadı</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
      </p>
      <Link href="/">
        <Button size="lg" className="h-12 px-8">
          Ana Sayfaya Dön
        </Button>
      </Link>
    </div>
  );
}
