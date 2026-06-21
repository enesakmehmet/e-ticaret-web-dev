"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { searchProducts } from "@/actions/productActions";

interface LiveSearchProps {
  defaultValue?: string;
  categorySlug?: string;
  priceRange?: string;
  brand?: string;
}

export function LiveSearch({ defaultValue = "", categorySlug, priceRange, brand }: LiveSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<{id: string, name: string, imageUrl: string, price: number}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery && debouncedQuery.length >= 2) {
        setIsSearching(true);
        const res = await searchProducts(debouncedQuery);
        if (res.success) {
          setResults(res.products || []);
        }
        setIsSearching(false);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (id: string) => {
    setShowDropdown(false);
    router.push(`/products/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      // Let the form submission handle the routing if it's inside a form
      // The form will take the 'q' input value and submit to /products
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
      <Input
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setShowDropdown(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Ürün ara... (örn: Jordan)"
        className="border-none bg-secondary/50 pl-9 w-full relative z-10 focus:ring-1 focus:ring-primary/20"
        autoComplete="off"
      />
      {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
      {priceRange && <input type="hidden" name="price" value={priceRange} />}
      {brand && <input type="hidden" name="brand" value={brand} />}

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {isSearching ? (
            <div className="flex items-center justify-center p-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleResultClick(product.id)}
                  className="flex items-center gap-4 p-3 hover:bg-secondary/50 cursor-pointer transition-colors border-b last:border-b-0"
                >
                  <div className="h-12 w-12 rounded-md bg-secondary flex-shrink-0 relative overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold truncate">{product.name}</span>
                    <span className="text-xs text-primary font-bold">{product.price} TL</span>
                  </div>
                </div>
              ))}
              <div 
                className="p-2 text-center border-t bg-secondary/20 hover:bg-secondary/40 cursor-pointer text-xs font-semibold text-muted-foreground transition-colors"
                onClick={() => {
                  setShowDropdown(false);
                  const params = new URLSearchParams();
                  params.set("q", query);
                  if (categorySlug) params.set("category", categorySlug);
                  if (priceRange) params.set("price", priceRange);
                  if (brand) params.set("brand", brand);
                  router.push(`/products?${params.toString()}`);
                }}
              >
                Tüm sonuçları gör
              </div>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Sonuç bulunamadı
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
