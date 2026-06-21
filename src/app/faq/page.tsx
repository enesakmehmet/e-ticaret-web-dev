export default function FAQPage() {
  const faqs = [
    {
      question: "Siparişler ne zaman kargoya verilir?",
      answer: "Tüm siparişler stoklarımızda mevcut ise aynı gün, aksi takdirde en geç 3 iş günü içerisinde kargoya teslim edilmektedir."
    },
    {
      question: "Orijinallik garantisi veriyor musunuz?",
      answer: "Evet. STEP SPACE üzerinde satılan tüm ürünler %100 orijinaldir ve uzman ekibimiz tarafından detaylı orijinallik kontrolünden geçtikten sonra tarafınıza gönderilir."
    },
    {
      question: "Hangi kargo şirketleriyle çalışıyorsunuz?",
      answer: "Şu an için Yurtiçi Kargo ve MNG Kargo ile güvenli teslimat sağlamaktayız."
    },
    {
      question: "Uluslararası gönderim yapıyor musunuz?",
      answer: "Şu an için sadece Türkiye sınırları içerisinde hizmet vermekteyiz. Ancak ilerleyen dönemlerde global gönderimlerimiz başlayacaktır."
    },
    {
      question: "Aldığım ürünün numarası uymazsa ne yapmalıyım?",
      answer: "Kullanılmamış ve etiketi koparılmamış ürünleri 14 gün içerisinde iade edebilir veya numara değişimi talep edebilirsiniz."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 tracking-tighter">Sıkça Sorulan Sorular</h1>
      
      <div className="bg-white/50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
