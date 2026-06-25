"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Product, Category, Review, ProductSize } from "@prisma/client";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Star } from "lucide-react";
import { createReviewAction } from "@/actions/reviewActions";

type ReviewWithUser = Review & { user: { name: string; surname: string } | null };
type ProductWithCategoryAndReviews = Product & { 
  category: Category; 
  reviews: ReviewWithUser[];
  sizes: ProductSize[];
};

export function ProductClientDetail({ product: initialProduct }: { product: ProductWithCategoryAndReviews }) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const { dict } = useLanguage();
  const [product, setProduct] = useState(initialProduct);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Toplam stok miktarını hesapla
  const totalStock = product.sizes.reduce((acc, curr) => acc + curr.stock, 0);
  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);

  // Ortalama puanı hesapla
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length 
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedSizeObj || selectedSizeObj.stock <= 0) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedSize,
      imageUrl: product.imageUrl,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await createReviewAction({ productId: product.id, rating, comment });
      if (res.success && res.review) {
        setProduct((prev) => ({
          ...prev,
          reviews: [res.review as ReviewWithUser, ...prev.reviews],
        }));
        setComment("");
        setRating(5);
      } else {
        console.error(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-24 items-start">
      {/* Product Image Gallery */}
      <div className="w-full md:w-1/2">
        <div className="relative aspect-square bg-[#F5F5F5] rounded-3xl overflow-hidden flex items-center justify-center p-8">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain object-center mix-blend-multiply p-8"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-12">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            {product.brand}
          </span>
          {/* Average Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{averageRating > 0 ? averageRating.toFixed(1) : "5.0"}</span>
            {product.reviews.length > 0 && (
              <span className="text-xs text-muted-foreground">({product.reviews.length} değerlendirme)</span>
            )}
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
          {product.name}
        </h1>
        <p className="text-2xl font-semibold mb-8">
          {dict.product.price}{product.price.toLocaleString("tr-TR")}
        </p>

        <p className="text-muted-foreground leading-relaxed mb-8">
          {product.description}
        </p>

        {/* Size Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">{dict.product.size}</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {product.sizes
              .sort((a, b) => parseFloat(a.size) - parseFloat(b.size))
              .map((sizeObj) => {
                const isOutOfStock = sizeObj.stock === 0;
                return (
                  <button
                    key={sizeObj.id}
                    onClick={() => !isOutOfStock && setSelectedSize(sizeObj.size)}
                    disabled={isOutOfStock}
                    className={`py-3 px-2 rounded-xl border font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                      selectedSize === sizeObj.size
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : isOutOfStock
                        ? "border-border bg-secondary/30 text-muted-foreground/50 cursor-not-allowed opacity-60"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-base">{sizeObj.size}</span>
                    <span
                      className={`text-[10px] ${
                        selectedSize === sizeObj.size
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {isOutOfStock ? "Tükendi" : `${sizeObj.stock} stok`}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-4">
          <Button
            size="lg"
            className="w-full h-14 text-lg rounded-xl transition-all"
            disabled={!selectedSize || totalStock === 0 || (selectedSizeObj && selectedSizeObj.stock === 0)}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="mr-2 h-5 w-5" /> {dict.product.added}
              </>
            ) : totalStock === 0 ? (
              "Stokta Yok"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" /> {dict.product.addToCart}
              </>
            )}
          </Button>
          {!selectedSize && totalStock > 0 && (
            <p className="text-sm text-destructive text-center mt-2">
              {dict.product.selectSize}
            </p>
          )}
          {totalStock > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Aynı gün ücretsiz kargo avantajı.
            </p>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="w-full mt-16 pt-16 border-t">
        <h2 className="text-3xl font-bold mb-8">{dict.product.reviews}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-secondary/20 p-6 rounded-2xl">
              <h3 className="font-semibold text-lg">{dict.product.writeReview}</h3>
              <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none p-1"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={dict.product.comment}
                className="w-full p-3 rounded-xl border bg-background"
                rows={4}
                required
              />
              <Button type="submit" disabled={submittingReview}>
                {submittingReview ? "..." : dict.product.submit}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-muted-foreground">{dict.product.noReviews}</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{review.user ? `${review.user.name} ${review.user.surname}` : "Anonim Kullanıcı"}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
