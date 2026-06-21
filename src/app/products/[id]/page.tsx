import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductClientDetail } from "@/components/products/ProductClientDetail";

export const revalidate = 0;

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { 
      category: true,
      sizes: true,
      reviews: {
        include: { user: { select: { name: true, surname: true } } },
        orderBy: { createdAt: "desc" }
      }
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <ProductClientDetail product={product} />
    </div>
  );
}
