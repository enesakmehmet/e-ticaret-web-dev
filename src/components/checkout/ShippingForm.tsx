import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Check } from "lucide-react";
import { getUserAddresses } from "@/actions/userActions";
import { useAuth } from "@/hooks/useAuth";

interface ShippingFormProps {
  shippingDetails: { fullName: string; address: string; phone: string };
  setShippingDetails: React.Dispatch<React.SetStateAction<{ fullName: string; address: string; phone: string }>>;
  onSubmit: (e: React.FormEvent) => void;
  dict: Record<string, Record<string, string>>;
}

type Address = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  isDefault: boolean;
};

export function ShippingForm({ shippingDetails, setShippingDetails, onSubmit, dict }: ShippingFormProps) {
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useManualAddress, setUseManualAddress] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAddresses = async () => {
        setLoadingAddresses(true);
        const res = await getUserAddresses();
        if (res.success && res.addresses.length > 0) {
          setAddresses(res.addresses);
          setUseManualAddress(false);
          
          // Select default address if exists, else first one
          const defaultAddr = res.addresses.find((a: Address) => a.isDefault) || res.addresses[0];
          selectAddress(defaultAddr);
        }
        setLoadingAddresses(false);
      };
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const selectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setUseManualAddress(false);
    setShippingDetails({
      fullName: addr.fullName,
      phone: addr.phone,
      address: `${addr.fullAddress}, ${addr.district}/${addr.city}`,
    });
  };

  const handleManualEntry = () => {
    setSelectedAddressId(null);
    setUseManualAddress(true);
    setShippingDetails({ fullName: "", phone: "", address: "" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-3xl border border-border/50 bg-secondary/20 p-6">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
          <MapPin className="h-5 w-5" /> {dict.checkout.shipping}
        </h2>

        {/* Kayıtlı Adreslerim Bölümü */}
        {isAuthenticated && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Kayıtlı Adreslerim</h3>
            
            {loadingAddresses ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Adresleriniz yükleniyor...
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => selectAddress(addr)}
                    className={`cursor-pointer border rounded-2xl p-4 transition-all relative ${
                      selectedAddressId === addr.id 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "bg-background hover:border-primary/50"
                    }`}
                  >
                    {selectedAddressId === addr.id && (
                      <div className="absolute top-4 right-4 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <h4 className="font-bold text-sm mb-1 pr-6">{addr.title}</h4>
                    <p className="text-xs font-medium text-muted-foreground mb-2">{addr.fullName} • {addr.phone}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{addr.fullAddress}, {addr.district}/{addr.city}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Kayıtlı adresiniz bulunmamaktadır.</p>
                <p>Adres bilgilerinizin bu alanda otomatik görünmesi için lütfen önceden <span className="font-semibold text-primary">Profilim</span> sayfasından adres ekleyiniz.</p>
              </div>
            )}

            {addresses.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="radio" 
                  id="manualAddress" 
                  checked={useManualAddress} 
                  onChange={handleManualEntry}
                  className="accent-primary"
                />
                <label htmlFor="manualAddress" className="text-sm cursor-pointer font-medium">Farklı bir adres girmek istiyorum</label>
              </div>
            )}
          </div>
        )}

        {useManualAddress && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <Label>{dict.checkout.name}</Label>
              <Input
                required
                value={shippingDetails.fullName}
                onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{dict.checkout.phone}</Label>
              <Input
                required
                inputMode="tel"
                value={shippingDetails.phone}
                onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{dict.checkout.address}</Label>
              <Input
                required
                value={shippingDetails.address}
                onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
      <Button type="submit" size="lg" className="w-full">
        Ödeme Adımına Geç
      </Button>
    </form>
  );
}
