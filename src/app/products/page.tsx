import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { LiveSearch } from "@/components/products/LiveSearch";

type ProductsSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

const PRICE_FILTERS = [
  { label: "Tum Fiyatlar", value: "" },
  { label: "0 - 5.000 TL", value: "0-5000" },
  { label: "5.000 - 10.000 TL", value: "5000-10000" },
  { label: "10.000 TL+", value: "10000-9999999" },
];

function getPriceRange(priceRange: string | undefined) {
  if (!priceRange) {
    return null;
  }

  const [min, max] = priceRange.split("-").map(Number);
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return null;
  }

  return { min, max };
}

export default async function ProductsPage(props: {
  searchParams: ProductsSearchParams;
}) {
  const searchParams = await props.searchParams;

  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const priceRange = typeof searchParams.price === "string" ? searchParams.price : undefined;
  const brand = typeof searchParams.brand === "string" ? searchParams.brand : undefined;

  const parsedPriceRange = getPriceRange(priceRange);

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where: {
      AND: [
        query ? { 
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } }
          ]
        } : {},
        categorySlug ? { category: { slug: categorySlug } } : {},
        brand ? { brand: brand } : {},
        parsedPriceRange
          ? {
              price: {
                gte: parsedPriceRange.min,
                lte: parsedPriceRange.max,
              },
            }
          : {},
      ],
    },
    include: {
      category: true,
    },
    orderBy,
  });

  const categories = await prisma.category.findMany();
  const dbBrands = await prisma.product.findMany({ select: { brand: true }, distinct: ['brand'] });
  const uniqueBrands = dbBrands.map(b => b.brand).filter(Boolean).sort();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">Tum Urunler</h1>
          <p className="mt-2 text-muted-foreground">{products.length} urun bulundu</p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <form className="relative w-full sm:w-64" action="/products">
            <LiveSearch defaultValue={query} categorySlug={categorySlug} priceRange={priceRange} brand={brand} />
          </form>

          <form className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row" action="/products">
            {query && <input type="hidden" name="q" value={query} />}
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            <select
              name="brand"
              defaultValue={brand || ""}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Tüm Markalar</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              name="price"
              defaultValue={priceRange || ""}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {PRICE_FILTERS.map((filter) => (
                <option key={filter.value || "all"} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <select
              name="sort"
              defaultValue={sort || ""}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">En Yeniler</option>
              <option value="price_asc">Fiyat (Dusukten Yuksege)</option>
              <option value="price_desc">Fiyat (Yuksekten Dusuge)</option>
            </select>
            <button type="submit" className="h-9 rounded-md bg-primary px-3 text-sm text-primary-foreground">
              Uygula
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-64">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Kategoriler</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/products${query ? `?q=${query}` : ""}${priceRange ? `${query ? "&" : "?"}price=${priceRange}` : ""}`}
                    className={`text-sm ${!categorySlug ? "font-bold text-primary" : "text-muted-foreground hover:text-primary"} transition-colors`}
                  >
                    Tum Urunler
                  </Link>
                </li>
                {categories.map((cat) => {
                  const params = new URLSearchParams();
                  params.set("category", cat.slug);
                  if (query) params.set("q", query);
                  if (priceRange) params.set("price", priceRange);
                  if (sort) params.set("sort", sort);

                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/products?${params.toString()}`}
                        className={`text-sm ${categorySlug === cat.slug ? "font-bold text-primary" : "text-muted-foreground hover:text-primary"} transition-colors`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="rounded-3xl bg-secondary/20 py-24 text-center">
              <h3 className="text-lg font-medium">Urun bulunamadi</h3>
              <p className="mt-2 text-muted-foreground">Arama kriterlerinizi degistirerek tekrar deneyin.</p>
              <Link href="/products" className="mt-4 inline-block font-medium text-primary hover:underline">
                Tum urunleri gor
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
