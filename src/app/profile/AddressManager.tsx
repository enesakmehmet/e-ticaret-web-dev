"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, Pencil, Trash } from "lucide-react";
import { addAddress, updateAddress, deleteAddress } from "@/actions/userActions";

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

export default function AddressManager({ addresses }: { addresses: Address[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    fullAddress: "",
    isDefault: false,
  });

  const openForm = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        title: address.title,
        fullName: address.fullName,
        phone: address.phone,
        city: address.city,
        district: address.district,
        fullAddress: address.fullAddress,
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        title: "",
        fullName: "",
        phone: "",
        city: "",
        district: "",
        fullAddress: "",
        isDefault: false,
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let result;
    if (editingAddress) {
      result = await updateAddress(editingAddress.id, formData);
    } else {
      result = await addAddress(formData);
    }

    if (result.success) {
      closeForm();
    } else {
      alert(result.error || "Bir hata oluştu");
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu adresi silmek istediğinize emin misiniz?")) {
      const result = await deleteAddress(id);
      if (!result.success) {
        alert(result.error || "Silinirken bir hata oluştu");
      }
    }
  };

  return (
    <section className="bg-secondary/20 border rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Adreslerim</h2>
        {!isFormOpen && (
          <Button onClick={() => openForm()} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Yeni Adres Ekle
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-background p-6 rounded-2xl border">
          <h3 className="font-bold mb-4">{editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adres Başlığı (Örn: Ev, İş)</label>
              <Input name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad Soyad</label>
              <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefon</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">İl</label>
              <Input name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">İlçe</label>
              <Input name="district" value={formData.district} onChange={handleChange} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Açık Adres</label>
              <textarea 
                name="fullAddress" 
                value={formData.fullAddress} 
                onChange={handleChange} 
                required 
                className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input 
                type="checkbox" 
                id="isDefault" 
                name="isDefault" 
                checked={formData.isDefault} 
                onChange={handleChange} 
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isDefault" className="text-sm">Varsayılan adres olarak ayarla</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={closeForm}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Kayıtlı adresiniz bulunmuyor.</p>
            </div>
          ) : (
            addresses.map(address => (
              <div key={address.id} className={`bg-background border rounded-2xl p-5 relative group ${address.isDefault ? 'border-primary' : ''}`}>
                {address.isDefault && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                    Varsayılan
                  </span>
                )}
                
                <div className="flex items-start gap-3 mb-3">
                  <div className="mt-1 bg-secondary/50 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{address.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{address.fullName} • {address.phone}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 pl-11 line-clamp-2">
                  {address.fullAddress}, {address.district}/{address.city}
                </p>
                
                <div className="flex justify-end gap-2 pt-3 border-t">
                  <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => openForm(address)}>
                    <Pencil className="h-3.5 w-3.5" /> Düzenle
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(address.id)}>
                    <Trash className="h-3.5 w-3.5" /> Sil
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
