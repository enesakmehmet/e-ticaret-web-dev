"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, MapPin } from "lucide-react";
import { createOrderAction } from "@/actions/orderActions";
import type { MockPaymentDetails } from "@/types";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { dict } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    phone: "",
  });

  const [paymentDetails, setPaymentDetails] = useState<MockPaymentDetails>({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate payment processing delay (2.5 seconds) to show the modal properly
      await new Promise(resolve => setTimeout(resolve, 2500));

      const res = await createOrderAction({
        items,
        shippingDetails,
        paymentDetails,
        totalAmount: cartTotal * 1.20,
      });

      if (!res.success || !res.orderId || !res.orderNumber) {
        throw new Error(res.message || "Sipariş oluşturulamadı.");
      }

      clearCart();
      router.push(`/checkout/success?orderId=${res.orderId}&orderNumber=${res.orderNumber}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Sipariş oluşturulurken bir hata oluştu.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold">{dict.cart.empty}</h1>
        <Button onClick={() => router.push("/products")}>{dict.cart.continueShopping}</Button>
      </div>
    );
  }

  return (
    <>
      {/* Payment Processing Overlay Modal */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center rounded-3xl border bg-background p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300 w-[90%] max-w-sm">
            <div className="mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/20 border-t-primary animate-spin">
                <CreditCard className="h-8 w-8 text-primary animate-none" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Ödemeniz Alınıyor...</h2>
            <p className="text-sm text-muted-foreground">Lütfen bekleyin, banka ile iletişim kuruluyor ve güvenliğiniz sağlanıyor.</p>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight uppercase">{dict.checkout.title}</h1>

        {/* Progress Steps */}
        <div className="mb-12 flex items-center justify-center">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              <MapPin className="h-4 w-4" />
            </div>
            <span className="hidden font-medium sm:block">Teslimat</span>
          </div>
          <div className={`mx-4 h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="hidden font-medium sm:block">Ödeme</span>
          </div>
          <div className="mx-4 h-1 w-16 bg-secondary" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <Check className="h-4 w-4" />
            </div>
            <span className="hidden font-medium sm:block">Onay</span>
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Main Content Area */}
          <div className="flex-1">
            {error && <div className="mb-6 rounded-lg bg-destructive/15 p-4 text-sm text-destructive">{error}</div>}

            {step === 1 ? (
              <ShippingForm
                shippingDetails={shippingDetails}
                setShippingDetails={setShippingDetails}
                onSubmit={handleShippingSubmit}
                dict={dict}
              />
            ) : (
              <PaymentForm
                paymentDetails={paymentDetails}
                setPaymentDetails={setPaymentDetails}
                onSubmit={handleCheckoutSubmit}
                onEdit={() => setStep(1)}
                loading={loading}
                dict={dict}
              />
            )}
          </div>

          {/* Sidebar Summary */}
          <OrderSummary items={items} cartTotal={cartTotal} />
        </div>
      </div>
    </>
  );
}
