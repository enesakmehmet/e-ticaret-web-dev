"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { items, removeFavorite, clearFavorites } = useFavorites();

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 pt-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Favorilerim</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{items.length} urun</span>
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFavorites}
                className="ml-4 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                Tumunu Temizle
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
              <Heart className="h-8 w-8 text-gray-300" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold">Henuz favori urunun yok</h2>
            <p className="mx-auto mb-8 max-w-md text-gray-500">
              Begendigin ayakkabilari favorilerine ekleyerek daha sonra kolayca bulabilirsin.
            </p>
            <Link href="/">
              <Button size="lg" className="rounded-full px-8">
                Alisverise Basla
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="relative flex aspect-square items-center justify-center bg-[#f0f0f0] p-6">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                    {item.brand}
                  </div>
                  <h3 className="mb-3 line-clamp-2 font-semibold leading-tight text-gray-900">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{item.price.toLocaleString("tr-TR")} TL</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
