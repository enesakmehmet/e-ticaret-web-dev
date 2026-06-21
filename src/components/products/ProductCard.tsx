import Link from "next/link";
import Image from "next/image";
import { Product, Category } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type ProductWithCategory = Product & {
  category: Category;
};

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="border-none shadow-none bg-secondary/30 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0 relative aspect-square bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-6 object-center group-hover:scale-105 transition-transform duration-500 ease-out mix-blend-multiply drop-shadow-sm"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 bg-background">
          <div className="flex justify-between w-full mb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-sm font-bold">
              ₺{product.price.toLocaleString("tr-TR")}
            </span>
          </div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {product.category.name}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
