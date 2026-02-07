# Altın ve Döviz Fiyat Takip Uygulaması 🪙💱

Altinkaynak'tan anlık altın ve döviz fiyatlarını gösteren modern bir React uygulaması.

## Özellikler ✨

- 📊 Anlık altın fiyatları (Gram, Çeyrek, Yarım, Teklik, 22 Ayar, Ata, Reşat)
- 💱 Anlık döviz kurları (USD, EUR, GBP, CHF, JPY, SAR)
- 🔖 Sekmeli görünüm - Altın ve Döviz ayrı sekmelerde
- 🧮 Altın alım/satım hesaplayıcı
- 🌓 Karanlık/Aydınlık mod desteği
- 🔄 Otomatik yenileme (30 saniyede bir)
- 📱 Responsive tasarım
- 🎨 Modern ve kullanıcı dostu arayüz
- ⚡ Hızlı ve optimize edilmiş performans

## Teknolojiler 🛠️

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool ve dev server
- **Chakra UI** - Component library
- **Framer Motion** - Animasyonlar
- **Axios** - HTTP client
- **React Icons** - İkonlar

## Kurulum 📦

### Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn

### Adımlar

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/ugurdargun/gold.git
   cd gold
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

4. Tarayıcınızda `http://localhost:5173` adresini açın

## Production Build 🚀

```bash
npm run build
npm run preview
```

Build dosyaları `dist` klasöründe oluşturulacaktır.

## Kullanım 💡

### Fiyatları Görüntüleme
- Uygulama açıldığında otomatik olarak güncel altın ve döviz fiyatları yüklenir
- **Altın** ve **Döviz** sekmeleri arasında geçiş yapabilirsiniz
- Fiyatlar her 30 saniyede bir otomatik olarak güncellenir
- Sağ üst köşedeki tema butonuyla karanlık/aydınlık mod arasında geçiş yapabilirsiniz

### Altın Sekmesi
Şu altın türlerini gösterir:
- Gram (24 Ayar)
- Çeyrek, Yarım, Teklik
- 22 Ayar Gram, 22 Ayar Hurda
- Ata Cumhuriyet, Reşat

### Döviz Sekmesi
Şu döviz kurlarını gösterir:
- USD (Amerikan Doları)
- EUR (Euro)
- GBP (İngiliz Sterlini)
- CHF (İsviçre Frangı)
- JPY (Japon Yeni)
- SAR (Suudi Arabistan Riyali)

### Hesaplayıcı Kullanımı
1. Sağ üst köşedeki "Hesaplayıcı" butonuna tıklayın
2. Alım veya satım işlemi seçin
3. "Öğe Ekle" butonuyla altın türü ekleyin
4. Altın türünü ve miktarını seçin
5. Toplam maliyet/değer otomatik olarak hesaplanır

## API 🔌

Uygulama, Altinkaynak'ın resmi API'lerini kullanır:

### Altın API
```
https://static.altinkaynak.com/Gold
```

### Döviz API
```
https://static.altinkaynak.com/Currency
```

API'ler aşağıdaki bilgileri sağlar:
- Alış/Satış fiyatları
- Son güncelleme zamanı
- Fiyat değişim yüzdesi
- Döviz kodları ve açıklamaları

## Lisans 📄

MIT License

## Katkıda Bulunma 🤝

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.

## İletişim 📧

Uğur Dargün - [@ugurdargun](https://github.com/ugurdargun)

Proje Linki: [https://github.com/ugurdargun/gold](https://github.com/ugurdargun/gold)
