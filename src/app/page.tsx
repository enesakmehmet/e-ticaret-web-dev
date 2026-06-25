import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Hero3D } from "@/components/3d/Hero3D";
import { cookies } from "next/headers";
import { getDictionary } from "@/lib/dictionaries";

// Sayfanın statik üretilmesini engeller, her istekte yeniden render edilir.
export const revalidate = 0;

/**
 * Ana Sayfa (Home) Bileşeni
 * Uygulamanın giriş sayfasıdır. Dinamik veriler sunucu tarafında çekilerek render edilir.
 */
export default async function Home() {
  // Çoklu dil desteği (i18n) için çerezlerden mevcut dil ayarını okuyoruz.
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as "tr" | "en") || "tr";
  // Seçili dile uygun metin çevirilerini sözlükten alıyoruz.
  const dict = await getDictionary(locale);

  // Prisma kullanarak veritabanından 'isFeatured' (Öne Çıkan) bayrağı true olan ilk 6 ürünü çekiyoruz.
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true },
    take: 6,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero3D />

      {/* Featured Collection (Circular Showcase / Grid) */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase mb-2">{dict.home.featured}</h2>
              <p className="text-muted-foreground">{dict.home.heroSubtitle}</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center text-primary font-medium hover:underline">
              {dict.home.allProducts} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 md:hidden flex justify-center">
            <Link href="/products">
              <Button variant="outline" className="w-full">{dict.home.allProducts}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">{dict.home.categories}</h2>
            <div className="h-1 w-24 bg-primary mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Link href="/products?category=nike" className="group block relative h-[280px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-[2rem] shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=800&auto=format&fit=crop" 
                alt="Nike Collection" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-left z-10">
                <span className="text-white/80 text-xs font-bold tracking-[0.2em] mb-2 uppercase translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  {dict.home.allProducts}
                </span>
                <h3 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  Nike
                </h3>
              </div>
            </Link>
            <Link href="/products?category=jordan" className="group block relative h-[280px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-[2rem] shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop" 
                alt="Jordan Collection" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-left z-10">
                <span className="text-white/80 text-xs font-bold tracking-[0.2em] mb-2 uppercase translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  {dict.home.allProducts}
                </span>
                <h3 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  Jordan
                </h3>
              </div>
            </Link>
            <Link href="/products?category=adidas" className="group block relative h-[280px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-[2rem] shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=800&auto=format&fit=crop" 
                alt="Adidas Collection" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-left z-10">
                <span className="text-white/80 text-xs font-bold tracking-[0.2em] mb-2 uppercase translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  {dict.home.allProducts}
                </span>
                <h3 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  Adidas
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
