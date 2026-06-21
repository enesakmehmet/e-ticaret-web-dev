export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 tracking-tighter">İade Politikası</h1>
      
      <div className="bg-white/50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground lead mb-8">
          Müşteri memnuniyeti bizim için her şeyden önemlidir. Satın aldığınız ürünlerden memnun kalmamanız durumunda aşağıdaki koşullar çerçevesinde iade veya değişim işlemi gerçekleştirebilirsiniz.
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-4">1. İade Süresi</h3>
        <p className="text-muted-foreground mb-6">
          Satın aldığınız ürünü, teslimat tarihinden itibaren <strong>14 gün içerisinde</strong> hiçbir gerekçe göstermeksizin iade edebilirsiniz. İade süresini aşan talepler maalesef kabul edilmemektedir.
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-4">2. İade Koşulları</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
          <li>Ürün kesinlikle kullanılmamış, yıpranmamış ve tekrar satılabilir durumda olmalıdır.</li>
          <li>Orijinal kutusu, ambalajı ve eğer varsa aksesuarları eksiksiz olarak gönderilmelidir.</li>
          <li>Ayakkabı kutusunun üzerine kargo bandı yapıştırılmamalı, kutu doğrudan kargo poşetine konulmalıdır. Kutu hasarlı ise iade kabul edilmeyebilir.</li>
          <li>Güvenlik bandı / etiketi (var ise) koparılmamış olmalıdır.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-8 mb-4">3. İade Süreci</h3>
        <p className="text-muted-foreground mb-6">
          İade işlemini başlatmak için <strong>Siparişlerim</strong> sayfasından ilgili siparişi bularak "İade Talebi Oluştur" butonuna tıklamanız veya <strong>support@stepspace.com</strong> adresine mail atmanız yeterlidir. Size verilecek olan kargo iade kodu ile paketi en yakın Yurtiçi Kargo şubesine ücretsiz teslim edebilirsiniz.
        </p>

        <h3 className="text-lg font-semibold mt-8 mb-4">4. Geri Ödeme İşlemleri</h3>
        <p className="text-muted-foreground mb-6">
          İade edilen ürün depolarımıza ulaştıktan sonra 1-3 iş günü içerisinde kalite kontrol ekibimiz tarafından incelenir. Koşullara uyan ürünlerin ücret iadesi aynı gün bankanıza iletilir. Bankanızın süreçlerine bağlı olarak iadenin kartınıza yansıması 2-7 iş gününü bulabilir.
        </p>
      </div>
    </div>
  );
}
