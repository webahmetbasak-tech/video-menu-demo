# Siyah İnci – İnci Lounge · Interactive Video Menu

**Demo konsepti.** Restoranın resmî web sitesi değildir; ürünler, fiyatlar ve
görseller yalnızca sunum amaçlı örneklerdir.

Mobil öncelikli, premium bir QR restoran menüsü. Ana fikir tek cümlede:

> **Ürüne dokun → sinematik videosu oynasın.**

Tamamen statik: **HTML5 + CSS3 + Vanilla JavaScript**.
Framework yok, backend yok, veritabanı yok, build adımı yok, npm bağımlılığı yok.
`index.html` dosyasına çift tıklayıp doğrudan açabilirsiniz.

---

## İçindekiler

- [Hızlı başlangıç](#hızlı-başlangıç)
- [Dosya yapısı](#dosya-yapısı)
- [GitHub Pages'e yayınlama (adım adım)](#github-pagese-yayınlama-adım-adım)
- [Menüyü düzenleme](#menüyü-düzenleme)
- [Video ekleme](#video-ekleme)
- [Görsel ekleme](#görsel-ekleme)
- [QR kodu](#qr-kodu)
- [Açılış (intro) videosu](#açılış-intro-videosu)
- [Performans mimarisi](#performans-mimarisi)
- [Erişilebilirlik](#erişilebilirlik)
- [Tarayıcı desteği](#tarayıcı-desteği)
- [Doğrulama sonuçları](#doğrulama-sonuçları)
- [Sık karşılaşılan durumlar](#sık-karşılaşılan-durumlar)

---

## Hızlı başlangıç

**Yöntem 1 — çift tıkla:** `index.html` dosyasını tarayıcıda açın. Her şey çalışır.

**Yöntem 2 — yerel sunucu** (QR kodun gerçek bir adres üretmesi için önerilir):

```bash
# Python 3 (Windows'ta genelde kurulu)
python -m http.server 8000

# veya Node.js
npx serve .
```

Ardından `http://localhost:8000` adresini açın.

> `file://` ile açtığınızda QR kod yerel dosya yolunu kodlar; bu normaldir.
> Siteyi yayına aldığınızda QR otomatik olarak gerçek adresi içerir.

---

## Dosya yapısı

```
.
├── index.html          # Sayfa iskeleti (içerik JS ile üretilir)
├── style.css           # Tasarım sistemi + tüm görsel katman
├── script.js           # MENÜ VERİSİ + video motoru + modallar + QR encoder
├── README.md
├── .nojekyll           # GitHub Pages'in Jekyll işlemesini atlamasını sağlar
└── assets/
    ├── images/         # Kapak görselleri
    │   ├── trabzon-kiymali-kapali-pide.jpg   ← gerçek fotoğraf
    │   └── *.svg                              ← zarif yer tutucular (~2 KB)
    └── videos/
        ├── intro.mp4                          ← açılış videosu
        └── <ürün-id>.mp4                      ← ürün videoları
```

Üç ana dosya dışında hiçbir şey gerekmez. Harici font, CDN, kütüphane veya
API çağrısı **yoktur** — internet olmadan da çalışır.

---

## GitHub Pages'e yayınlama (adım adım)

Ücretsizdir ve yaklaşık 2 dakika sürer.

### 1. Depoyu oluşturun

1. <https://github.com/new> adresine gidin.
2. **Repository name**: örneğin `video-menu-demo`
3. **Public** seçin. *(GitHub Pages ücretsiz planda yalnızca public depolarda çalışır.)*
4. **Create repository**.

### 2. Dosyaları yükleyin

**Seçenek A — tarayıcıdan sürükle bırak (en kolay):**

1. Depo sayfasında **Add file ▸ Upload files**.
2. `index.html`, `style.css`, `script.js`, `README.md`, `.nojekyll` dosyalarını
   ve **`assets` klasörünün tamamını** sürükleyin.
3. Alttaki **Commit changes** düğmesine basın.

**Seçenek B — komut satırından:**

```bash
cd "proje-klasörünüz"
git init
git add .
git commit -m "Interactive video menu demo"
git branch -M main
git remote add origin https://github.com/KULLANICI-ADINIZ/video-menu-demo.git
git push -u origin main
```

### 3. GitHub Pages'i açın

1. Depo sayfasında üstteki **Settings** sekmesi.
2. Sol menüden **Pages**.
3. **Build and deployment** altında:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. **Save**.

### 4. Adresi alın

1–2 dakika bekleyin, sayfayı yenileyin. En üstte yeşil kutuda adresiniz çıkar:

```
https://KULLANICI-ADINIZ.github.io/video-menu-demo/
```

Bu adresi telefonunuzda açın. Menüdeki **QR Kod** düğmesi artık bu gerçek
adresi kodlar — masa kartlarına bastırabilirsiniz.

> **Yayın gecikmesi:** İlk yayın 1–2 dakika sürer. Sonraki güncellemeler
> genellikle 30–60 saniyede yansır. Değişiklik görünmüyorsa tarayıcı önbelleğini
> temizleyin (`Ctrl+F5`) veya gizli sekmede deneyin.

---

## Menüyü düzenleme

Gerçek menüye geçmek için **yalnızca `script.js` dosyasının başındaki veri
bloğunu** değiştirin. Başka hiçbir yere dokunmanız gerekmez.

### Kategoriler

```js
var CATEGORIES = [
  { id: 'kahvalti',  name: 'Kahvaltı' },
  { id: 'ana-yemek', name: 'Ana Yemekler' },
  // ...
];
```

`id` → ASCII, tireli (bölüm bağlantısı olarak kullanılır).
`name` → ekranda görünen ad.

### Ürünler

```js
{
  id: 'san-sebastian',                              // benzersiz, ASCII, tireli
  name: 'San Sebastian Cheesecake',
  category: 'Tatlılar',                             // CATEGORIES'teki name ile BİREBİR aynı
  price: '250 TL',                                  // serbest metin
  description: 'Yüksek ısıda karamelize edilmiş...',
  image: 'assets/images/san-sebastian.svg',
  video: 'assets/videos/san-sebastian.mp4',         // video yoksa bu satırı hiç yazmayın
  badge: 'Efsane',                                  // opsiyonel — kart köşesindeki altın rozet
  tags: ['Günlük üretim', 'Bask usulü']             // opsiyonel — detay sayfasındaki rozetler
}
```

**Dikkat:** `category` değeri `CATEGORIES` içindeki bir `name` ile birebir
eşleşmezse ürün menüde görünmez. Böyle bir durumda tarayıcı konsoluna
uyarı yazılır — `F12` ile kontrol edebilirsiniz.

Sayaçlar (ürün / video / kategori sayısı) veriden otomatik hesaplanır.

---

## Video ekleme

1. Videoyu `assets/videos/` klasörüne koyun.
2. Dosya adını **ürünün `id` değeriyle aynı** yapın: `<id>.mp4`
3. Ürüne `video: 'assets/videos/<id>.mp4'` satırını ekleyin.

Kart otomatik olarak ▶ **Videoyu izle** rozetini ve oynat düğmesini kazanır.

### Video hazırlama önerileri

| Özellik | Öneri | Neden |
|---|---|---|
| Format | **MP4 / H.264 + AAC** | Her telefonda çalışır |
| Süre | **5–10 saniye**, döngüye uygun | Kısa, etkileyici, hafif |
| Boyut | **2–4 MB** | Mobil veride hızlı açılır |
| Çözünürlük | 1280×720 (yatay) veya 720×1280 (dikey) | İkisi de desteklenir |
| **faststart** | **Şart** | `moov` atomu başta olmalı, yoksa video ancak tamamı indikten sonra oynar |

`faststart` için (ffmpeg kuruluysa):

```bash
ffmpeg -i giris.mp4 -c copy -movflags +faststart assets/videos/urun-id.mp4
```

> Detay sayfası, videonun en/boy oranını **otomatik algılar** ve kadrajı ona
> göre ayarlar. Yatay ve dikey videoları karıştırabilirsiniz.

**Dosya adlarında Türkçe karakter, boşluk veya `…` kullanmayın.** Yalnızca
`a-z`, `0-9` ve `-` kullanın — aksi hâlde adres satırında sorun çıkar.

### Video dosyası yoksa ne olur?

Hiçbir şey bozulmaz. Sayfa `error` olayını yakalar, ürünü sessizce normal
(videosuz) bir ürüne dönüştürür ve kapak fotoğrafını sinematik bir
yavaş yakınlaşma efektiyle gösterir. Konsola hata düşmez.

---

## Görsel ekleme

1. Fotoğrafı `assets/images/` klasörüne koyun.
2. Ürünün `image` alanını yeni dosyaya yönlendirin.

| Özellik | Öneri |
|---|---|
| En/boy | **4:3** (kartlar bu oranda kırpar) |
| Genişlik | 1000–1400 px yeterli |
| Format | **WebP** tercih edilir, `.jpg` de olur |
| Boyut | 150–300 KB |

Şu an `trabzon-kiymali-kapali-pide.jpg` gerçek bir fotoğraftır; diğerleri
**SVG yer tutucudur** (her biri ~2 KB, altın çizgili, asla bozuk görünmez).
Gerçek fotoğrafları koydukça `image` yollarını güncellemeniz yeterli.

Görsel bulunamazsa nötr koyu bir dolgu gösterilir — kırık görsel ikonu **çıkmaz**.

---

## QR kodu

QR kod **hiçbir kütüphane veya CDN kullanmadan** üretilir — encoder `script.js`
içinde yazılıdır (byte modu, hata düzeltme seviyesi M, sürüm 1–10). Bu sayede
internet olmadan da çalışır ve dışarıya tek bir istek gitmez.

Kodun işaret ettiği adres `script.js` başındaki tek satırla belirlenir:

```js
var SITE_URL = 'https://webahmetbasak-tech.github.io/video-menu-demo/';
```

Sabit olduğu için, menüyü dizüstü bilgisayarda `file://` ile açıp müşteriye
telefondan okutabilirsiniz — QR yine yayındaki gerçek adrese gider.
Boş bırakırsanız (`''`) sayfanın kendi adresi kullanılır.

Modaldeki **PNG indir** düğmesi kodu 1024 px genişliğinde kaydeder; masa
kartı veya afiş baskısı için yeterlidir.

## Açılış (intro) videosu

Sayfa açılır → `assets/videos/intro.mp4` oynar → biter → menü belirir.

**Oturumda yalnızca bir kez** oynar. Aynı sekmede sayfayı yenilerseniz intro
gösterilmez ve video **hiç indirilmez** (`sessionStorage` ile hatırlanır).
Yeni sekme veya yeni ziyaret = intro yeniden oynar.

### Ayarlar

`script.js` içinde, intro bölümünün başında:

```js
var INTRO_SPEED  = 1.5;    // oynatma hızı (4,0 sn'lik video ≈ 2,7 sn sürer)
var INTRO_MAX_MS = 3200;   // ekranda kalabileceği en uzun süre
```

Daha hızlı istersen `INTRO_SPEED` değerini artır; her açılışta oynamasını
istersen `INTRO_KEY` ile ilgili iki fonksiyonu boşalt.

### Kırpma yok

Kaynak video 16:9'dur ve içeriği kareyi kenardan kenara doldurur *(ölçüldü:
parlak içerik genişliğin %98–100'ünü kaplıyor)*. Bu yüzden dikey telefonda
ekranı doldurmak için kırpmak logonun yanlarını keserdi. Video bunun yerine
**ortalanmış, 16:9, altın çizgili bir sahnede** `object-fit: contain` ile
gösterilir — hiçbir kenarı kesilmez. Sahne ekran genişliğinin ~%92'sini kaplar.

### Güvenlik ağları

Kullanıcı asla burada takılı kalmaz:

1. **Atla** düğmesi, ekrana dokunma, `Esc` / `Enter` / `Boşluk`
2. 2 saniye içinde oynatma başlamazsa otomatik geçilir *(tarayıcı autoplay engeli)*
3. `INTRO_MAX_MS` sert üst sınırı *(dosya bozuk veya çok yavaşsa)*

Ayrıca:

- Video dosyası yoksa `error` anında geçilir.
- JavaScript kapalıysa intro **hiç gösterilmez**, menü doğrudan açılır.
- İşletim sisteminde "hareketi azalt" açıksa intro atlanır.
- Intro bitince video bellekten sökülür.

**Intro'yu kaldırmak için:** `index.html` içindeki `<div class="intro" id="intro">`
bloğunu silin. Başka bir değişiklik gerekmez.

Sesli başlatılamaz (tarayıcılar sessiz olmayan otomatik oynatmayı engeller),
bu yüzden sol altta bir **ses düğmesi** vardır.

---

## Performans mimarisi

40–100 ürünlü gerçek bir menüde de aynı şekilde çalışsın diye tasarlandı.

**Sayfa açılışında indirilen video sayısı: 0** *(intro hariç)*

| Teknik | Uygulama |
|---|---|
| `<video>` elementi | Sayfada **hiç yoktur** — yalnızca istendiğinde oluşturulur |
| `<source>` etiketi | Yalnızca kullanıcı dokunduğunda eklenir |
| `preload` | `none` — talep anında `auto`'ya çevrilir |
| Aynı anda oynayan video | **Kesinlikle 1** — yenisi başlarken eskisi durur |
| Bellek | Duran videonun kaynağı DOM'dan sökülür, tampon serbest bırakılır |
| Ekran dışı | `IntersectionObserver` ile otomatik duraklatma, geri gelince devam |
| Sekme arka planda | `visibilitychange` ile duraklatma (pil + veri tasarrufu) |
| Görseller | `loading="lazy"` + `decoding="async"` + boyut nitelikleri (CLS yok) |
| Kartlar | Olay delegasyonu — 100 üründe de tek dinleyici |

**Görünür olmak tek başına videoyu başlatmaz.** Tetikleyici daima kullanıcıdır.

### Yaklaşık sayfa ağırlığı

| | |
|---|---|
| HTML + CSS + JS | ~85 KB |
| 16 SVG yer tutucu | ~33 KB |
| Gerçek fotoğraf (1 adet) | ~230 KB |
| **İlk yükleme toplamı** | **~350 KB** |
| Intro videosu | ~0,9 MB *(tek seferlik)* |
| Ürün videosu | ~2 MB *(yalnızca dokunulduğunda)* |

---

## Erişilebilirlik

- Semantik HTML (`header`, `nav`, `main`, `section`, `article`, `footer`)
- Tüm görsellerde anlamlı `alt` metni
- Gerçek `<button>` elemanları — tıklanabilir `div` yok
- Modallarda odak tuzağı; açılınca odak modale girer, kapanınca geldiği düğmeye döner
- `Esc` tüm modalleri kapatır
- Görünür `:focus-visible` halkaları
- `aria-current` ile aktif kategori bildirimi
- 44 px'e yakın dokunmatik hedefler
- `prefers-reduced-motion` desteği *(animasyonlar ve intro kapanır)*
- `prefers-contrast: more` desteği
- WCAG AA kontrast oranları
- "İçeriğe geç" bağlantısı
- Yazdırma stili — temiz bir kâğıt menü çıktısı verir

---

## Tarayıcı desteği

iOS Safari 14+, Chrome/Edge 88+, Firefox 89+, Samsung Internet 15+.

`IntersectionObserver`, `backdrop-filter`, `aspect-ratio` gibi modern özellikler
kullanılır; desteklenmediğinde sayfa **bozulmaz**, yalnızca ilgili
süsleme devre dışı kalır.

---

## Doğrulama sonuçları

Bu demo yayına hazırlanmadan önce gerçek Chrome'da, yerel HTTP sunucusu
üzerinden otomatik test edildi.

**Davranış testi: 38 / 38 geçti**

Doğrulanan başlıca noktalar:

- Açılışta `<video>` ve `<source>` sayısı: **0**
- Intro atlanabiliyor ve sonrasında bellekten sökülüyor
- Video kaynağı yalnızca dokunma anında bağlanıyor
- `muted` / `loop` / `playsInline` doğru
- **Aynı anda yalnızca bir video oynuyor**
- Kaydırınca duraklıyor, geri gelince kaldığı yerden devam ediyor
- Detay sayfası açılınca kart videosu duruyor
- Kapanınca video duruyor, kaynak sökülüyor, `currentTime` sıfırlanıyor
- Videosuz üründe hiçbir video kontrolü görünmüyor
- `Esc` modalleri kapatıyor
- Video en/boy oranı otomatik algılanıyor (ölçülen: 1.7778)

**QR encoder testi: 9 / 9 geçti** — bağımsız yazılmış bir çözücüyle uçtan uca
doğrulandı (Reed-Solomon sendromları sıfır, BCH biçim bilgisi geçerli,
sürüm 1–9, çok bloklu durumlar ve Türkçe UTF-8 karakterler dahil).

**Düzen ölçümü:** 320 / 360 / 390 / 430 / 768 / 1440 px genişliklerde
yatay taşma **yok**.

**Konsol:** hata yok.

---

## Sık karşılaşılan durumlar

**Videolar oynamıyor.**
Dosya adının ürünün `id` değeriyle birebir aynı olduğundan emin olun
(büyük/küçük harf duyarlıdır). `assets/videos/` içinde `.mp4` uzantılı olmalı.

**Video geç başlıyor.**
Dosya büyük olabilir veya `faststart` uygulanmamış olabilir. Yukarıdaki
`ffmpeg` komutunu çalıştırın.

**QR kod yanlış adresi gösteriyor.**
`script.js` başındaki `SITE_URL` değerini güncelleyin — aşağıdaki
[QR kodu](#qr-kodu) bölümüne bakın.

**GitHub Pages'te sayfa boş / stil yok.**
`assets` klasörünün tamamının yüklendiğinden ve `Folder` ayarının `/ (root)`
olduğundan emin olun.

**Ürün menüde görünmüyor.**
`category` değeri `CATEGORIES` içindeki bir `name` ile birebir eşleşmiyordur.
`F12` ile konsolu açın, uyarı orada yazar.

---

## Lisans / kullanım

Bu bir sunum demosudur. Ürün adları, fiyatlar ve açıklamalar örnektir.
Gerçek kullanım öncesi menü içeriğini, görselleri ve videoları
işletmenin kendi materyalleriyle değiştirin.
