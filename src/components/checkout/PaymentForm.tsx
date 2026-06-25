import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { MockPaymentDetails } from "@/types";

interface PaymentFormProps {
  paymentDetails: MockPaymentDetails;
  setPaymentDetails: React.Dispatch<React.SetStateAction<MockPaymentDetails>>;
  onSubmit: (e: React.FormEvent) => void;
  onEdit: () => void;
  loading: boolean;
  dict: Record<string, Record<string, string>>;
}

export function PaymentForm({ paymentDetails, setPaymentDetails, onSubmit, onEdit, loading, dict }: PaymentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-3xl border border-border/50 bg-secondary/20 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <CreditCard className="h-5 w-5" /> {dict.checkout.payment}
          </h2>
          <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
            Düzenle
          </Button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kart Numarası</Label>
            <Input
              required
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Son Kullanma Tarihi</Label>
              <Input
                required
                inputMode="numeric"
                placeholder="MM/YY"
                maxLength={5}
                value={paymentDetails.expiry}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CVC</Label>
              <Input
                required
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                value={paymentDetails.cvc}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-2 text-xs font-semibold text-primary">
              * Test Ödeme Bilgileri (İyzico)
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Bu bir bitirme projesidir. Lütfen gerçek kart bilgilerinizi girmeyin. Aşağıdaki test kartını kullanarak formu hızlıca doldurabilirsiniz:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-background p-3 rounded-lg border text-xs">
              <div>
                <span className="font-medium">Kart:</span> 5436 0844 5678 1234
                <span className="mx-2">•</span>
                <span className="font-medium">SKT:</span> 12/28
                <span className="mx-2">•</span>
                <span className="font-medium">CVC:</span> 123
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs shrink-0"
                onClick={() => setPaymentDetails({
                  cardNumber: "5436 0844 5678 1234",
                  expiry: "12/28",
                  cvc: "123"
                })}
              >
                Hızlı Doldur
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? dict.checkout.processing : dict.checkout.placeOrder}
      </Button>
    </form>
  );
}
