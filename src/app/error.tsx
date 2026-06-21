"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Bir Şeyler Ters Gitti!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sayfa yüklenirken beklenmedik bir hata oluştu. Lütfen tekrar deneyin veya daha sonra tekrar ziyaret edin.
      </p>
      <Button onClick={() => reset()} size="lg">
        Tekrar Dene
      </Button>
    </div>
  );
}
