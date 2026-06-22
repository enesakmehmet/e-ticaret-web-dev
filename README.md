# STEP SPACE - Premium Sneaker E-Ticaret Platformu

STEP SPACE, React Foundations eğitimi kapsamında hazırlanmış, modern web teknolojilerini barındıran tam donanımlı bir e-ticaret platformu ve mezuniyet projesidir. Kullanıcılarına yenilikçi ve kusursuz bir sneaker alışveriş deneyimi sunmayı hedefler. 

Platformda 3D ayakkabı modeli inceleme, ürün filtreleme, dinamik sepet ve favori yönetimi, uluslararasılaştırma (i18n), kullanıcı yetkilendirme ve ödeme simülasyonu gibi gerçek bir e-ticaret sitesinde olması gereken kapsamlı özellikler bulunmaktadır.

## 🎥 Proje Tanıtım Videosu
Bölüm 7.2 Checklist maddelerine göre hazırlanan 3-5 dakikalık proje tanıtım ve kullanım videosunu aşağıdan izleyebilirsiniz:
*   [Proje Tanıtım Videosunu İzle](./proje-tanitim-videosu.mp4)

## 🚀 Canlı Demo
Canlı olarak projeyi test etmek için bağlantıya tıklayabilirsiniz: [STEP SPACE Canlı Demo](https://e-ticaret-web-dev-production.up.railway.app)

## 🔑 Demo Hesap Bilgileri
Sistemi hızlıca test edebilmeniz için aşağıdaki demo hesap bilgileriyle giriş yapabilirsiniz:
- **E-posta:** `demo@gmail.com`
- **Şifre:** `demo123`

## 🛠️ Kullanılan Teknolojiler

Proje, güncel endüstri standartlarına ve modern mimarilere uygun olarak geliştirilmiştir:

*   **Framework:** Next.js 15 (App Router, Server Components & Server Actions)
*   **Kütüphane:** React 19
*   **Dil:** TypeScript (Tam Tip Güvenliği)
*   **Stil & UI:** Tailwind CSS 4, Shadcn UI, Framer Motion (Animasyonlar), Lucide React (İkonlar)
*   **Veritabanı & ORM:** Prisma ORM, SQLite
*   **Kimlik Doğrulama:** NextAuth.js (Session bazlı oturum yönetimi)
*   **3D Görselleştirme:** React Three Fiber, Drei (WebGL tabanlı interaktif sneaker modeli)
*   **Durum Yönetimi:** Context API (`useReducer`, `useMemo` ile optimize edilmiş state'ler), Custom Hooks

## 📦 Kurulum Adımları

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla izleyin:

1. **Repoyu Klonlayın**
   ```bash
   git clone <repo-url>
   cd "premium sneaker e-ticaret platformu"
   ```

2. **Bağımlılıkları Yükleyin**
   ```bash
   npm install
   ```

3. **Çevre Değişkenlerini (Environment Variables) Ayarlayın**
   Proje kök dizininde bir `.env` dosyası oluşturun ve aşağıdaki değerleri ekleyin:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="gizli-bir-anahtar-belirleyin"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Veritabanını Hazırlayın ve Örnek Verileri (Seed) Yükleyin**
   Prisma ile veritabanı tablolarını oluşturun ve başlangıç verilerini yükleyin:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Geliştirme Sunucusunu Başlatın**
   ```bash
   npm run dev
   ```

6. **Projeyi Görüntüleyin**
   Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı inceleyebilirsiniz.

## 💳 Test Ödeme Bilgileri
Checkout (Ödeme) adımını test etmek isterseniz, gerçek kart bilgisi girmeden aşağıdaki test İyzico kart bilgilerini kullanabilirsiniz:
- **Kart Numarası:** `5436 0844 5678 1234`
- **Son Kullanma Tarihi (SKT):** `12/28`
- **CVC:** `123`

## ☁️ Yayına Alma (Railway, Vercel vb.)
Proje **Railway**, Vercel veya benzeri platformlarda sorunsuz çalışacak şekilde yapılandırılmıştır.
- Platformlarda ekstra bir veritabanı komutu çalıştırmanıza veya SQL ayarlamanıza gerek yoktur.
- `package.json` içerisindeki `start` komutu (`"start": "prisma db push && npx tsx prisma/seed.ts && next start"`) sayesinde, proje her ayağa kalktığında veritabanı tabloları otomatik olarak eşitlenir ve gerekli 144 örnek ayakkabı sisteme (`seed`) yüklenir.
- Tek yapmanız gereken projeyi GitHub'a yükleyip Railway üzerinden deploy etmektir.
