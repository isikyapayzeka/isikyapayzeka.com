# isikyapayzeka.com

Işık Yapay Zeka & Veri Bilimi Kulübü'nün sitesi. Bu depoya yapılan her değişiklik Netlify tarafından 1–2 dakika içinde yayına alınır. Site [Astro](https://astro.build) ile yapılmıştır, ama içeriği güncellemek için kod bilmeniz gerekmez.

| Adres | Ne gösterir | Nereden düzenlenir |
|---|---|---|
| https://isikyapayzeka.com | Ana sayfa (TR). İngilizcesi `/en/` | `src/data/`, `src/content/etkinlikler/` |
| /etkinlikler/ · /en/events/ | Yaklaşan ve geçmiş etkinlikler | `src/content/etkinlikler/` |
| /hakkimizda/ · /en/about/ | Kulüp, ekip, iletişim | `src/data/ayarlar.yml`, `src/data/ekip.yml` |
| /sirketler-icin/ · /en/partners/ | Şirketler ve konuşmacılar için | `src/data/ortaklar.yml` |
| /link | Yaka kartlarındaki QR sayfası | `public/link/index.html` (CONFIG bloğu) |
| /qr | Yeni kartlardaki QR, şu an `/link/`'e gider | `public/_redirects` |

Eski yaka kartlarındaki QR `isikyapayzeka.github.io` adresine gider. O adres ayrı bir depodan (`isikyapayzeka/isikyapayzeka.github.io`) `/link/`'e yönlendirilir. **O depoyu silmeyin ve adını değiştirmeyin.**

---

## Site içeriğini güncelleme

Tüm düzenlemeler GitHub web arayüzünden yapılır: dosyayı açın → kalem simgesi → değiştirin → **Commit changes**.

### Yeni etkinlik eklemek
`src/content/etkinlikler/` klasöründe **Add file → Create new file** deyin. Dosya adı `YIL-AY-GÜN-kisa-ad.md` olsun (örnek: `2026-11-27-datathon.md`). İçine şunu yazın:

```
---
baslik: "Mini Datathon"
baslikEn: "Mini Datathon"
tarih: "2026-11-27"
saat: "16:30"
bitis: "19:30"
yer: "Şile Kampüsü, LMF 316"
yerEn: "Şile Campus, LMF 316"
tur: yarisma
konuklar:
  - "Ad Soyad · Şirket"
ortaklar: ["isik-endustri"]
ozet: "Bir cümlelik açıklama."
ozetEn: "One-sentence description."
kayitLinki: "https://forms.gle/..."
link: ""
---
```
- `tur` şunlardan biri: `atolye`, `soylesi`, `yayin`, `sosyal`, `yarisma`, `diger`.
- `ortaklar` içindeki adlar `src/data/ortaklar.yml` dosyasındaki `id` değerleridir.
- Etkinlik tarihi gelene kadar "Yaklaşan etkinlikler"de durur, bitince kendiliğinden "Geçmiş etkinlikler"e geçer.
- Etkinlik bittikten sonra Instagram ya da LinkedIn gönderisinin linkini `link` alanına ekleyin.

### Etkinliğe fotoğraf eklemek
Fotoğrafsız etkinlik kartında kulüp logosu görünür. Fotoğraf eklemek için:

1. Fotoğrafı yatay (4:3) kırpın ve iki boyutta kaydedin: 800 px ve 1600 px genişlik, JPEG.
2. `public/etkinlikler/` klasörüne `ad-800.jpg` ve `ad-1600.jpg` adlarıyla yükleyin (örnek: `datathon-800.jpg`, `datathon-1600.jpg`).
3. Etkinlik dosyasına ekleyin:
   ```
   gorsel: "datathon"
   gorselAlt: "Fotoğrafta ne göründüğünü anlatan kısa cümle"
   gorselAltEn: "Short sentence describing the photo"
   ```

Elde yalnızca afiş varsa tek dosya yeter (`ad.jpg`, kare) ve `afis: true` satırını da ekleyin. Afiş kırpılmadan gösterilir.

Ana sayfanın üstündeki büyük fotoğraf `src/data/ayarlar.yml` içindeki `kapak` alanından gelir, aynı iki boyut kuralı geçerlidir.

### Ekip, ortaklar, genel ayarlar
- `src/data/ekip.yml`: yönetim ekibi. Liste boşken sitede ekip bölümü görünmez. Kişiyi eklemeden önce onayını alın.
- `src/data/ortaklar.yml`: birlikte çalışılan kulüp ve kurumlar.
- `src/data/ayarlar.yml`: dönem, vizyon cümlesi, form ve sosyal medya linkleri.

Bir dosyada yazım hatası olursa Netlify siteyi yayınlamaz, eski sürüm yayında kalır. Netlify'daki hata mesajı hangi dosyanın hangi satırda bozulduğunu söyler.

---

## QR'ın gittiği yeri değiştirmek

Yeni kartlardaki QR `isikyapayzeka.com/qr` adresine gider. Kartları yeniden bastırmadan bu adresin nereye gideceğini değiştirebilirsiniz:

1. Depoda `public/_redirects` dosyasını açın ve kalem simgesine basın.
2. `/qr    /link/   302` satırında ortadaki `/link/` kısmını yeni hedefle değiştirin. Örnek: `/qr    https://forms.gle/....    302`
3. **Commit changes** deyin. Değişiklik 1–2 dakikada yayına girer.

---

## Link sayfasını güncelleme

1. https://github.com/isikyapayzeka/isikyapayzeka.com adresine gidin.
2. `public` → `link` klasörüne, sonra `index.html` dosyasına tıklayın.
3. Sağ üstteki **kalem simgesine** (Edit this file) basın.
4. En üstteki `SAYFA AYARLARI (CONFIG)` bloğunda istediğiniz değeri değiştirin.
5. **Commit changes...** düğmesine basın, açılan pencerede yine **Commit changes** deyin.
6. 1–2 dakika içinde sayfa güncellenir. Telefonda eski hâli görürseniz sayfayı yenileyin.

### Yazım kuralları
- Her değer çift tırnak içinde yazılır: `"https://..."`
- Satır sonlarındaki virgülleri silmeyin.
- Bir butonu gizlemek için değerini boşaltın: `""`
- `AYARLARIN SONU` satırının altına dokunmayın.

### Sık yapılan değişiklikler

**Bir link eklemek** (örnek: üye formu hazır oldu):
```
uyeFormu: "https://forms.gle/....",
```

**E-posta eklemek:** `mailto:` yazmanıza gerek yok, adres yeterli.
```
eposta: "kulup@ornek.edu.tr",
```
`sponsorIletisim` alanına da bir e-posta adresi ya da bir form linki yazabilirsiniz.

**WhatsApp:** Kulübün topluluk veya kanal davet linkini yazın. Kişisel telefon numarası yazmayın.

**Yaklaşan etkinlik eklemek:**
```
etkinlik: {
  baslik: "Yapay Zekaya Giriş Atölyesi",
  baslikEn: "Intro to AI Workshop",
  baslangic: "2026-11-05 18:00",
  bitis: "2026-11-05 20:00",
  yer: "Şile Kampüsü, Konferans Salonu",
  yerEn: "Şile Campus, Conference Hall",
  kayitLinki: "https://forms.gle/....",
  aciklama: "",
  aciklamaEn: ""
},
```
- Tarihleri Türkiye saatiyle, `YIL-AY-GÜN SAAT:DAKİKA` biçiminde yazın.
- "Takvime ekle" ve "Google Takvim" butonları bu bilgilerden kendiliğinden oluşur.
- Bitiş saati geçince kart kendiliğinden kalkar ve etkinlik "Geçmiş etkinlikler" listesine linksiz olarak eklenir.
- `etkinlik` alanı bir seferde tek etkinlik tutar. Yeni etkinliği yazmadan önce eskisini aşağıdaki `gecmisEtkinlikler` listesine, Instagram ya da LinkedIn gönderisinin linkiyle ekleyin. Aynı etkinlik iki yerde birden yazılı kalırsa listede yine bir kez görünür.
- Etkinlik yoksa `baslik: ""` yapın, kart görünmez.

**Geçmiş etkinlik eklemek:**
```
gecmisEtkinlikler: [
  { baslik: "Yapay Zekaya Giriş Atölyesi", baslikEn: "Intro to AI Workshop", tarih: "2026-11-05", link: "https://www.instagram.com/p/..." },
  { baslik: "Welcome Etkinliği", baslikEn: "Welcome Event", tarih: "2026-10-08", link: "https://www.instagram.com/reel/..." },
]
```
- Başlıkları kısa tutun, telefonda tek satıra sığsın.
- Sıralama önemli değil, sayfa etkinlikleri en yeniden eskiye kendisi dizer.
- `link` boş bırakılabilir. O zaman satır tıklanmaz, sadece tarih ve başlık görünür.
- Liste boşken "Geçmiş etkinlikler" butonu görünmez.

**İngilizce alanlar:** Sonu `En` ile biten alanlar (`baslikEn`, `yerEn`, `aciklamaEn`) sayfa İngilizce açıldığında görünür. Boş bırakılırsa İngilizce sayfada Türkçesi gösterilir. Butonların ve başlıkların İngilizcesi kodun içinde hazır, onlar için bir şey yapmanız gerekmez.

**Dönem değişince:** `donem: "2027–28",`

### Bir şey bozulursa
Depoda `public/link/index.html` → **History** bölümünden önceki sürümü açıp içeriğini geri kopyalayabilirsiniz. Sayfa boş görünüyorsa büyük ihtimalle bir tırnak ya da virgül eksik kalmıştır. Son değiştirdiğiniz satırı kontrol edin.

---

## Notlar
- Sayfa ilk açılışta dil sorar (Türkçe / English). Seçim o telefonda hatırlanır, sağ üstteki düğmeyle değiştirilebilir.
- Google Formlar ve WhatsApp grubu tek dilli kalır. Gerekirse formlara İngilizce açıklama eklenebilir.
- Logolar dosyanın içine gömülüdür, ayrıca yüklemeniz gerekmez.
- Aynı link iki kez yazılırsa sayfada yalnızca bir kez görünür.
- `konum` alanı şu an Google Haritalar'da "Işık Üniversitesi Şile Kampüsü" aramasını açar. Kesin bir konum linkiniz varsa onunla değiştirin.
