export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 tracking-tighter">İletişim</h1>
      
      <div className="bg-white/50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
        <p className="text-muted-foreground mb-8">
          Bizimle iletişime geçmek için aşağıdaki formu kullanabilir veya doğrudan e-posta adresimizden bize ulaşabilirsiniz.
        </p>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Ad Soyad</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                placeholder="Örn: Ali Yılmaz"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">E-Posta Adresi</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                placeholder="ornek@mail.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">Konu</label>
            <input 
              type="text" 
              id="subject" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              placeholder="Mesajınızın konusu"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Mesajınız</label>
            <textarea 
              id="message" 
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
              placeholder="Detaylı mesajınızı buraya yazabilirsiniz..."
            />
          </div>

          <button 
            type="button" 
            className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Gönder
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">E-Posta</h3>
            <p className="text-muted-foreground text-sm">support@stepspace.com</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Çalışma Saatleri</h3>
            <p className="text-muted-foreground text-sm">Hafta İçi: 09:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
