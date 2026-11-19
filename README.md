# isikyapayzeka.com

Işık Yapay Zeka & Veri Bilimi Kulübü'nün sitesi. Bu depoya yapılan her değişiklik Netlify tarafından 1–2 dakika içinde yayına alınır.

| Adres | Ne gösterir | Dosya |
|---|---|---|
| https://isikyapayzeka.com/link | Kulübün link sayfası | `link/index.html` |
| https://isikyapayzeka.com/qr | Yeni yaka kartlarındaki QR. Şu an `/link`'e gider. | `_redirects` |
| https://isikyapayzeka.com | Ana site hazır olana kadar `/link`'e gider. | `_redirects` |

Eski yaka kartlarındaki QR `isikyapayzeka.github.io` adresine gider. O adres ayrı bir depodan (`isikyapayzeka/isikyapayzeka.github.io`) `/link`'e yönlendirilir. **O depoyu silmeyin ve adını değiştirmeyin**, yoksa eski kartlar çalışmaz.

Link sayfasının tamamı tek bir dosyadır: `link/index.html`. Kod bilmeniz gerekmez. Yalnızca dosyanın en üstündeki **CONFIG** bloğunu düzenlersiniz.

---

## Bölüm 1: QR'ın gittiği yeri değiştirmek

Yeni kartlardaki QR `isikyapayzeka.com/qr` adresine gider. Kartları yeniden bastırmadan bu adresin nereye gideceğini değiştirebilirsiniz:

1. Depoda `_redirects` dosyasını açın ve kalem simgesine basın.
2. `/qr    /link    302` satırında ortadaki `/link` kısmını yeni hedefle değiştirin. Örnek: `/qr    https://forms.gle/....    302`
3. **Commit changes** deyin. Değişiklik 1–2 dakikada yayına girer.

---

## Bölüm 2: Sayfayı güncelleme

1. https://github.com/isikyapayzeka/isikyapayzeka.com adresine gidin.
2. `link` klasörüne, sonra `index.html` dosyasına tıklayın.
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
Depoda `link/index.html` → **History** bölümünden önceki sürümü açıp içeriğini geri kopyalayabilirsiniz. Sayfa boş görünüyorsa büyük ihtimalle bir tırnak ya da virgül eksik kalmıştır. Son değiştirdiğiniz satırı kontrol edin.

---

## Notlar
- Sayfa ilk açılışta dil sorar (Türkçe / English). Seçim o telefonda hatırlanır, sağ üstteki düğmeyle değiştirilebilir.
- Google Formlar ve WhatsApp grubu tek dilli kalır. Gerekirse formlara İngilizce açıklama eklenebilir.
- Logolar dosyanın içine gömülüdür, ayrıca yüklemeniz gerekmez.
- Aynı link iki kez yazılırsa sayfada yalnızca bir kez görünür.
- `konum` alanı şu an Google Haritalar'da "Işık Üniversitesi Şile Kampüsü" aramasını açar. Kesin bir konum linkiniz varsa onunla değiştirin.
