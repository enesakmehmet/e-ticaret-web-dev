import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-medium tracking-tight">Yükleniyor...</h2>
      <p className="text-muted-foreground mt-2 text-sm">Lütfen bekleyin, içerik hazırlanıyor.</p>
    </div>
  );
}
