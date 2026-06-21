"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/actions/userActions";

export default function ProfileForm({ 
  user,
  formattedDate
}: { 
  user: { name: string; surname: string; email: string; createdAt: Date; };
  formattedDate: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user.name,
    surname: user.surname,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await updateProfile(formData);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      alert(result.error || "Bir hata oluştu");
    }
    
    setIsLoading(false);
  };

  return (
    <section className="bg-secondary/20 border rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Kişisel Bilgiler</h2>
      </div>

      {!isEditing ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ad Soyad</p>
              <p className="font-medium">{user.name} {user.surname}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">E-posta</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Kayıt Tarihi</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            {/* Rol bilgisi kullanıcının isteği üzerine kaldırıldı */}
          </div>
          <div className="mt-8 pt-6 border-t flex justify-end">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Bilgileri Güncelle
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Soyad</label>
              <Input 
                name="surname" 
                value={formData.surname} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">E-posta (Değiştirilemez)</label>
              <Input 
                name="email" 
                value={user.email} 
                disabled 
              />
            </div>
          </div>
          <div className="mt-8 pt-6 border-t flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
