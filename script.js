/* =====================================================================
   SIYAH İNCİ – İnci Lounge · Interactive Video Menu (Demo Concept)
   Saf Vanilla JavaScript. Framework yok, bağımlılık yok, build adımı yok.

   İÇİNDEKİLER
     1.  MENÜ VERİSİ           — gerçek menüye geçerken yalnızca burası değişir
     2.  Yardımcılar
     3.  Menüyü ekrana basma
     4.  Kategori navigasyonu (yapışkan + kaydırma takibi)
     5.  Görsel tembel yükleme / giriş animasyonu
     6.  VİDEO MOTORU          — tek aktif video, talep üzerine yükleme
     7.  Ürün / video sayfası (bottom sheet)
     8.  QR kod (kendi encoder'ımız — CDN yok)
     9.  Toast
     10. Başlangıç
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     1. MENÜ VERİSİ
     -------------------------------------------------------------------
     Gerçek menüye geçerken YALNIZCA bu bloğu değiştirin.

       id          : benzersiz, ASCII, tire ile (DOM ve dosya adları için)
       name        : ürün adı
       category    : aşağıdaki CATEGORIES listesindeki bir "name" ile aynı olmalı
       price       : serbest metin ("250 TL")
       description : 1–2 cümle
       image       : assets/images/... (.webp / .avif / .jpg / .svg)
       video       : assets/videos/....mp4  — video yoksa alanı hiç yazmayın
       badge       : (opsiyonel) kart köşesinde altın rozet
       tags        : (opsiyonel) detay sayfasında rozetler
     =================================================================== */

  /* -------------------------------------------------------------------
     QR KODUN İŞARET EDECEĞİ ADRES
     Sabit verildiği için, sayfa bilgisayardan (file://) veya yerel
     sunucudan açılsa bile QR daima yayındaki gerçek adresi gösterir —
     yani menüyü dizüstünde açıp müşteriye telefondan okutabilirsiniz.
     Boş bırakılırsa ('') sayfanın kendi adresi kullanılır.
     ------------------------------------------------------------------- */
  var SITE_URL = 'https://webahmetbasak-tech.github.io/video-menu-demo/';

  var CATEGORIES = [
    { id: 'kahvalti',  name: 'Kahvaltı' },
    { id: 'ana-yemek', name: 'Ana Yemekler' },
    { id: 'burger',    name: 'Burger & Sandviç' },
    { id: 'tatli',     name: 'Tatlılar' },
    { id: 'waffle',    name: 'Waffle & Krep' },
    { id: 'kahve',     name: 'Kahveler' },
    { id: 'icecek',    name: 'İçecekler' }
  ];

  var PRODUCTS = [
    /* ---------------- Kahvaltı ---------------- */
    {
      /* Kapak görseli gerçek fotoğraf (.webp, 82 KB). */
      id: 'inci-serpme',
      name: 'İnci Serpme',
      category: 'Kahvaltı',
      price: '680 TL',
      description: 'Yöresel peynirler, sahanda yumurta, sucuk, bal–kaymak, ev reçelleri, zeytin çeşitleri, taze meyve, sıcak börek ve pişi. Sınırsız çay ile.',
      image: 'assets/images/inci-serpme.webp',
      video: 'assets/videos/inci-serpme.mp4',
      badge: 'İki Kişilik',
      tags: ['2 kişilik', 'Sınırsız çay', '09:00 – 13:00']
    },
    {
      id: 'menemen',
      name: 'Menemen',
      category: 'Kahvaltı',
      price: '220 TL',
      description: 'Bakır sahanda, tereyağında pişmiş domates ve sivri biberle klasik menemen. Yanında sıcak ekmek.',
      image: 'assets/images/menemen.svg',
      tags: ['Vejetaryen', 'Sahanda']
    },

    /* ---------------- Ana Yemekler ---------------- */
    {
      /* Kapak görseli gerçek fotoğraf (.jpg) — diğerleri henüz SVG yer tutucu.
         Fotoğraf ile yer tutucunun yan yana nasıl durduğunu göstermek için
         bilinçli olarak menünün başında bırakıldı. */
      id: 'trabzon-kiymali-kapali-pide',
      name: 'Trabzon Kıymalı Kapalı Pide',
      category: 'Ana Yemekler',
      price: '320 TL',
      description: 'Elde açılan hamur, taş fırında; içinde bol kıyma, tereyağı ve kekik. Trabzon usulü kapalı pişirilir, fırından çıktığı gibi servis edilir.',
      image: 'assets/images/trabzon-kiymali-kapali-pide.jpg',
      video: 'assets/videos/trabzon-kiymali-kapali-pide.mp4',
      badge: 'Taş Fırın',
      tags: ['Taş fırın', 'Trabzon usulü', 'Elde açma']
    },
    {
      /* Kapak görseli gerçek fotoğraf — 1,8 MB PNG'den 188 KB JPEG'e indirildi. */
      id: 'eli-bogrunde',
      name: 'Eli Böğründe Dana',
      category: 'Ana Yemekler',
      price: '780 TL',
      description: 'Sacda pişirilen dana kuşbaşı; közlenmiş biber, domates ve karamelize soğan ile. Yanında turşu, yoğurt ve mevsim yeşillikleri.',
      image: 'assets/images/eli-bogrunde.jpg',
      video: 'assets/videos/eli-bogrunde.mp4',
      badge: 'Paylaşımlık',
      tags: ['Dana kuşbaşı', 'Sacda', 'Meze ve turşu ile']
    },
    {
      id: 'antrikot',
      name: 'Izgara Antrikot',
      category: 'Ana Yemekler',
      price: '890 TL',
      description: '28 gün dinlendirilmiş dana antrikot, közlenmiş sebzeler ve tereyağlı patates püresi eşliğinde.',
      image: 'assets/images/antrikot.svg',
      badge: 'Şef Önerisi',
      tags: ['300 gr', 'Dinlendirilmiş et', 'Odun ateşi']
    },
    {
      /* Kapak görseli gerçek fotoğraf — 2 MB'lık PNG'den 202 KB JPEG'e indirildi. */
      id: 'cokertme-kebabi',
      name: 'Çökertme Kebabı',
      category: 'Ana Yemekler',
      price: '520 TL',
      description: 'Dana bonfile dilimleri · kibrit patates · domates sosu · yoğurt · ızgara domates ve biber',
      image: 'assets/images/cokertme-kebabi.jpg',
      video: 'assets/videos/cokertme-kebabi.mp4',
      badge: 'Bodrum Usulü',
      tags: ['Dana bonfile', 'Bodrum usulü']
    },
    {
      id: 'levrek',
      name: 'Fırında Levrek',
      category: 'Ana Yemekler',
      price: '620 TL',
      description: 'Limon ve taze kekikle fırınlanmış bütün levrek, mevsim yeşillikleri ve zeytinyağlı roka salatası ile.',
      image: 'assets/images/levrek.svg',
      tags: ['Günlük balık', 'Glutensiz']
    },
    {
      id: 'inci-burger',
      name: 'İnci Signature Burger',
      category: 'Ana Yemekler',
      price: '480 TL',
      description: 'Çift katlı dana köfte, füme cheddar, karamelize soğan ve şefin özel sosu; brioche ekmek arasında.',
      image: 'assets/images/inci-burger.svg',
      /* video: dosya Çökertme Kebabı için kullanıldı. Kendi videosu
         assets/videos/inci-burger.mp4 olarak eklendiğinde alttaki satırı aç:
         video: 'assets/videos/inci-burger.mp4', */
      badge: 'En Çok Sipariş',
      tags: ['180 gr × 2', 'Brioche', 'Elde şekillendirilmiş']
    },

    /* ---------------- Burger & Sandviç ---------------- */
    {
      /* Kapak görseli gerçek fotoğraf (.webp, 34 KB). */
      id: 'barbeku-soslu-pilic',
      name: 'Barbekü Soslu Piliç',
      category: 'Burger & Sandviç',
      price: '340 TL',
      description: 'Barbekü sosunda marine edilmiş ızgara piliç, közlenmiş sebzeler ve elde kesilmiş patates eşliğinde.',
      image: 'assets/images/barbeku-soslu-pilic.webp',
      video: 'assets/videos/barbeku-soslu-pilic.mp4',
      tags: ['Mangal ateşinde', 'Patates kızartması ile']
    },

    /* ---------------- Tatlılar ---------------- */
    {
      id: 'san-sebastian',
      name: 'San Sebastian Cheesecake',
      category: 'Tatlılar',
      price: '250 TL',
      description: 'Yüksek ısıda karamelize edilmiş, dışı yanık içi akışkan Bask usulü cheesecake. Günlük üretim.',
      /* Kapak görseli gerçek fotoğraf (.webp, 31 KB). */
      image: 'assets/images/san-sebastian.webp',
      video: 'assets/videos/san-sebastian.mp4',
      badge: 'Efsane',
      tags: ['Günlük üretim', 'Bask usulü']
    },
    {
      /* Kapak görseli gerçek fotoğraf (.webp, 21 KB). */
      id: 'sahika',
      name: 'Şahika',
      category: 'Tatlılar',
      price: '220 TL',
      description: 'Çilek · muz · çıtır corn flakes · sütlü Belçika çikolatası veya beyaz çikolata ile',
      image: 'assets/images/sahika.webp',
      video: 'assets/videos/sahika.mp4',
      tags: ['Belçika çikolatası', 'Sütlü veya beyaz']
    },
    {
      id: 'profiterol',
      name: 'Profiterol',
      category: 'Tatlılar',
      price: '210 TL',
      description: 'Ev yapımı çikolata sosunda yüzen kremalı profiterol topları, üzerinde çıtır fındık kırığı.',
      image: 'assets/images/profiterol.svg',
      tags: ['Sıcak çikolata sosu']
    },
    {
      /* Kapak görseli gerçek fotoğraf — 263 KB PNG'den 46 KB JPEG'e indirildi. */
      id: 'inci-special-waffle',
      name: 'İnci Special Waffle',
      category: 'Tatlılar',
      price: '320 TL',
      description: 'Çift katlı özel waffle; beyaz ve sütlü çikolata, mevsim meyveleri, antep fıstığı ve dondurma topu ile.',
      image: 'assets/images/inci-special-waffle.jpg',
      video: 'assets/videos/inci-special-waffle.mp4',
      badge: 'İnci Özel',
      tags: ['Paylaşımlık', 'Dondurma ile']
    },
    {
      id: 'signature-tatli',
      name: 'İnci Signature Dessert',
      category: 'Tatlılar',
      price: '320 TL',
      description: 'Şefin imzasını taşıyan, servis anında hazırlanan özel tabak. İçeriği mevsime göre değişir.',
      image: 'assets/images/signature-tatli.svg',
      video: 'assets/videos/signature-tatli.mp4',
      badge: 'Şef Önerisi',
      tags: ['Masada hazırlanır', 'Mevsimlik']
    },

    /* ---------------- Waffle & Krep ---------------- */
    {
      id: 'cilekli-waffle',
      name: 'Çilekli Waffle',
      category: 'Waffle & Krep',
      price: '280 TL',
      description: 'Taze çilek, beyaz ve sütlü çikolata, antep fıstığı ve dondurma topu ile servis edilen sıcak waffle.',
      image: 'assets/images/cilekli-waffle.svg',
      /* video: dosya İnci Signature Dessert için kullanıldı. Kendi videosu
         assets/videos/cilekli-waffle.mp4 olarak eklendiğinde bu satırı aç:
         video: 'assets/videos/cilekli-waffle.mp4', */
      badge: 'Yeni',
      tags: ['Dondurma ile', 'Paylaşımlık']
    },
    {
      id: 'cikolatali-krep',
      name: 'Çikolatalı Krep',
      category: 'Waffle & Krep',
      price: '240 TL',
      description: 'İnce hamurlu Fransız usulü krep, eritilmiş sütlü çikolata ve muz dilimleri ile.',
      image: 'assets/images/cikolatali-krep.svg',
      tags: ['Fransız usulü']
    },

    /* ---------------- Kahveler ---------------- */
    {
      id: 'latte',
      name: 'Latte',
      category: 'Kahveler',
      price: '120 TL',
      description: 'Çift shot espresso üzerine ipeksi buharlanmış süt; barista imzalı latte art ile.',
      image: 'assets/images/latte.svg',
      tags: ['Çift shot', 'Laktozsuz süt seçeneği']
    },
    {
      id: 'turk-kahvesi',
      name: 'Türk Kahvesi',
      category: 'Kahveler',
      price: '90 TL',
      description: 'Bakır cezvede, kum üzerinde pişirilen dibek kahvesi. Yanında lokum ve soğuk su ile.',
      image: 'assets/images/turk-kahvesi.svg',
      tags: ['Kum üzerinde', 'Lokum ikramı']
    },

    /* ---------------- İçecekler ---------------- */
    {
      id: 'milkshake',
      name: 'Çilekli Milkshake',
      category: 'İçecekler',
      price: '180 TL',
      description: 'Taze çilek ve gerçek dondurma ile hazırlanan yoğun kıvamlı milkshake; üzerinde krema.',
      image: 'assets/images/milkshake.svg',
      tags: ['Gerçek dondurma', 'Buz gibi']
    },
    {
      id: 'limonata',
      name: 'Ev Yapımı Limonata',
      category: 'İçecekler',
      price: '110 TL',
      description: 'Taze sıkılmış limon, nane yaprakları ve bir tutam bal ile günlük hazırlanan ev limonatası.',
      image: 'assets/images/limonata.svg',
      tags: ['Günlük', 'Şeker ilavesiz']
    }
  ];

  /* ===================================================================
     2. YARDIMCILAR
     =================================================================== */

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var supportsIO = typeof window.IntersectionObserver === 'function';

  /* boş / kırık görsel yerine sessiz bir dolgu */
  var FALLBACK_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E" +
    "%3Crect width='4' height='3' fill='%23191920'/%3E%3C/svg%3E";

  /* ===================================================================
     3. MENÜYÜ EKRANA BASMA
     =================================================================== */

  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  var ARROW_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var EXPAND_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M9 3H3v6M15 21h6v-6M3 3l7 7M21 21l-7-7"/></svg>';

  function cardHTML(p) {
    var hasVideo = !!p.video;

    var media =
      '<div class="card__media" data-media="' + esc(p.id) + '">' +
        '<img class="card__img" src="' + esc(p.image) + '" alt="' + esc(p.name) + '" ' +
             'width="1000" height="750" loading="lazy" decoding="async">' +
        '<span class="card__scrim" aria-hidden="true"></span>' +
        (p.badge ? '<span class="badge-tag">' + esc(p.badge) + '</span>' : '') +
        (hasVideo
          ? '<button class="card__play" type="button" data-play="' + esc(p.id) + '" ' +
                    'aria-label="' + esc(p.name) + ' videosunu oynat">' +
              '<span class="playCircle" aria-hidden="true"></span>' +
            '</button>' +
            '<span class="badge-video">Videoyu izle</span>' +
            '<button class="icon-btn card__expand" type="button" data-expand="' + esc(p.id) + '" ' +
                    'aria-label="Tam ekran izle" tabindex="-1">' + EXPAND_SVG + '</button>'
          : '') +
      '</div>';

    var body =
      '<div class="card__body">' +
        '<div class="card__topline">' +
          '<h3 class="card__name">' + esc(p.name) + '</h3>' +
          '<p class="card__price">' + esc(p.price) + '</p>' +
        '</div>' +
        '<p class="card__desc">' + esc(p.description) + '</p>' +
        '<p class="card__cta">' + (hasVideo ? 'Tam ekran izle' : 'Detayları gör') + ARROW_SVG + '</p>' +
      '</div>';

    return '<article class="card' + (hasVideo ? ' card--video' : '') + '" data-id="' + esc(p.id) + '">' +
      '<button class="card__open" type="button" data-open="' + esc(p.id) + '" ' +
              'aria-label="' + esc(p.name) + ' — ' + esc(p.price) + ' — detayları aç"></button>' +
      media + body +
    '</article>';
  }

  function renderMenu() {
    var root = $('#menuRoot');
    if (!root) return;

    var html = '';

    /* Gerçek menü verisi girilirken kategori adı yanlış yazılırsa ürün
       sessizce kaybolmasın — geliştirici için tek satırlık uyarı. */
    var known = CATEGORIES.map(function (c) { return c.name; });
    var orphans = PRODUCTS.filter(function (p) { return known.indexOf(p.category) === -1; });
    if (orphans.length && window.console && console.warn) {
      console.warn('[menü] CATEGORIES içinde karşılığı olmayan kategori: ' +
        orphans.map(function (p) { return p.id + ' → "' + p.category + '"'; }).join(', '));
    }

    CATEGORIES.forEach(function (cat) {
      var items = PRODUCTS.filter(function (p) { return p.category === cat.name; });
      if (!items.length) return;

      html +=
        '<section class="cat-section" id="cat-' + esc(cat.id) + '" aria-labelledby="h-' + esc(cat.id) + '">' +
          '<header class="cat-head">' +
            '<h2 class="cat-head__title" id="h-' + esc(cat.id) + '">' + esc(cat.name) + '</h2>' +
            '<span class="cat-head__rule" aria-hidden="true"></span>' +
            '<span class="cat-head__count">' + items.length + ' ÜRÜN</span>' +
          '</header>' +
          '<div class="grid">' + items.map(cardHTML).join('') + '</div>' +
        '</section>';
    });

    root.innerHTML = html;
  }

  function renderNav() {
    var scroller = $('#catScroller');
    if (!scroller) return;

    scroller.innerHTML = CATEGORIES
      .filter(function (c) { return PRODUCTS.some(function (p) { return p.category === c.name; }); })
      .map(function (c, i) {
        return '<button class="cat-chip" type="button" data-cat="' + esc(c.id) + '"' +
               (i === 0 ? ' aria-current="true"' : '') + '>' + esc(c.name) + '</button>';
      }).join('');
  }

  function renderStats() {
    var videos = PRODUCTS.filter(function (p) { return !!p.video; }).length;
    var cats = CATEGORIES.filter(function (c) {
      return PRODUCTS.some(function (p) { return p.category === c.name; });
    }).length;

    var map = { products: PRODUCTS.length, videos: videos, categories: cats };
    Object.keys(map).forEach(function (k) {
      var el = $('[data-stat="' + k + '"]');
      if (el) el.textContent = map[k];
    });
  }

  /* ===================================================================
     4. KATEGORİ NAVİGASYONU
     =================================================================== */

  var navLocked = 0;

  function navHeight() {
    var nav = $('#catNav');
    return nav ? nav.getBoundingClientRect().height : 58;
  }

  function setActiveChip(catId) {
    var chips = $$('.cat-chip');
    var active = null;

    chips.forEach(function (chip) {
      var on = chip.getAttribute('data-cat') === catId;
      if (on) { chip.setAttribute('aria-current', 'true'); active = chip; }
      else { chip.removeAttribute('aria-current'); }
    });

    if (!active) return;

    var scroller = $('#catScroller');
    if (!scroller) return;

    var target = active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2;
    target = Math.max(0, Math.min(target, scroller.scrollWidth - scroller.clientWidth));

    if (Math.abs(scroller.scrollLeft - target) > 4) {
      if (scroller.scrollTo) {
        scroller.scrollTo({ left: target, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      } else {
        scroller.scrollLeft = target;
      }
    }
  }

  function syncActiveCategory() {
    if (navLocked > Date.now()) return;

    var sections = $$('.cat-section');
    if (!sections.length) return;

    var probe = navHeight() + 28;
    var current = sections[0];

    /* offsetTop kullanmıyoruz: .shell konumlandırılmış olduğu için
       offsetParent sayfa değil, kapsayıcıdır. Rect + scrollY her zaman doğru. */
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= probe) current = sections[i];
    }

    /* sayfanın en altındaysak son kategoriyi işaretle */
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    setActiveChip(current.id.replace(/^cat-/, ''));
  }

  function initNav() {
    var scroller = $('#catScroller');
    if (scroller) {
      scroller.addEventListener('click', function (e) {
        var chip = e.target.closest ? e.target.closest('.cat-chip') : null;
        if (!chip) return;

        var id = chip.getAttribute('data-cat');
        var section = document.getElementById('cat-' + id);
        if (!section) return;

        navLocked = Date.now() + 900;
        setActiveChip(id);
        section.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    }

    /* "QR Menüyü Aç" → ilk kategoriye yumuşak kaydırma */
    $$('[data-action="open-menu"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var first = $('.cat-section');
        if (first) {
          first.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

    /* yapışkan durum rozeti */
    var sentinel = $('#navSentinel');
    var nav = $('#catNav');
    if (sentinel && nav && supportsIO) {
      new IntersectionObserver(function (entries) {
        nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
      }, { threshold: 0 }).observe(sentinel);
    }

    /* kaydırma takibi (rAF ile kısıtlanmış) */
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        syncActiveCategory();
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    syncActiveCategory();
  }

  /* ===================================================================
     5. GÖRSEL TEMBEL YÜKLEME + GİRİŞ ANİMASYONU
     =================================================================== */

  /* Görseller kırılırsa nötr bir dolguya düş — asla bozuk ikon gösterme */
  function initImageFallbacks() {
    $$('.card__img').forEach(function (img) {
      img.addEventListener('error', function handler() {
        img.removeEventListener('error', handler);
        img.src = FALLBACK_IMG;
      });
    });
  }

  /* Kartların akarak gelmesi — açılış videosu bittikten sonra başlatılır. */
  function startReveal() {
    if (!supportsIO || prefersReducedMotion) return;

    document.documentElement.classList.add('js-reveal');

    var observerFired = false;

    var io = new IntersectionObserver(function (entries) {
      observerFired = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        card.classList.add('is-in');
        io.unobserve(card);
        /* kademeli giriş gecikmesini temizle, yoksa hover geçişleri de gecikir */
        window.setTimeout(function () { card.style.transitionDelay = ''; }, 800);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    $$('.card').forEach(function (card, i) {
      /* aynı satırdaki kartlar hafif kademeli gelsin */
      card.style.transitionDelay = (i % 3) * 60 + 'ms';
      io.observe(card);
    });

    /* GÜVENLİK AĞI — boş menü asla kabul edilemez.
       Ekranda kart olmasına rağmen gözlemci hiç tetiklenmediyse (beklenmedik
       tarayıcı davranışı) gizleme sınıfını tamamen kaldır: animasyon gider,
       menü kalır. Ekranda kart yokken tetiklenmemesi normaldir — bu durumda
       müdahale etmeyiz, kartlar kaydırdıkça normal şekilde açılır. */
    window.setTimeout(function () {
      if (observerFired) return;

      var kartEkranda = $$('.card').some(function (c) {
        var r = c.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });

      if (kartEkranda) document.documentElement.classList.remove('js-reveal');
    }, 2500);
  }

  /* ===================================================================
     5b. AÇILIŞ (INTRO) VİDEOSU
     -------------------------------------------------------------------
     Akış:  sayfa açılır → intro oynar → biter → menü belirir.

     Menü intronun ARKASINDA zaten hazır durumda; intro yalnızca bir
     kaplamadır. Kullanıcı asla burada takılı kalmasın diye üç güvenlik ağı:
       1) "Atla" düğmesi, ekrana dokunma, Esc / Enter / Boşluk
       2) 2,6 sn içinde oynatma başlamazsa otomatik geç (autoplay engeli)
       3) 9 sn sert üst sınır (dosya bozuk/çok yavaşsa)
     Video dosyası yoksa `error` anında geçilir.
     =================================================================== */

  /* --- ayarlanabilir intro değerleri --- */
  var INTRO_SPEED  = 1.5;    // oynatma hızı (4,0 sn'lik video ≈ 2,7 sn sürer)
  var INTRO_MAX_MS = 3200;   // ekranda kalabileceği en uzun süre
  var INTRO_KEY    = 'siyah-inci-intro';

  function introIzlendiIsaretle() {
    try { window.sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* gizli mod */ }
  }

  function introDahaOnceIzlendi() {
    try { return window.sessionStorage.getItem(INTRO_KEY) === '1'; } catch (e) { return false; }
  }

  function initIntro(onDone) {
    var intro = $('#intro');
    var video = $('#introVideo');
    var html = document.documentElement;
    var finished = false;
    var timers = [];

    /* Introyu hiç göstermeden menüye geç. Video `data-src` ile beklediği
       için bu yolda TEK BAYT bile indirilmez. */
    function release() {
      html.classList.remove('intro-active');
      if (intro) intro.hidden = true;
      if (typeof onDone === 'function') onDone();
    }

    if (!intro || !video) { release(); return; }

    /* bu oturumda zaten izlendi → doğrudan menü */
    if (introDahaOnceIzlendi()) { release(); return; }

    /* hareket azaltma tercihi → introyu atla */
    if (prefersReducedMotion) {
      finished = true;
      introIzlendiIsaretle();
      release();
      return;
    }

    function finish() {
      if (finished) return;
      finished = true;

      introIzlendiIsaretle();
      timers.forEach(function (t) { window.clearTimeout(t); });
      html.classList.remove('intro-active');
      intro.classList.add('is-done');

      window.setTimeout(function () {
        intro.hidden = true;
        /* açılış videosunu bellekten sök — menü videoları için yer aç */
        try {
          video.pause();
          video.removeAttribute('src');
          video.load();
        } catch (e) { /* yoksay */ }
      }, 520);

      if (typeof onDone === 'function') onDone();
    }

    video.addEventListener('ended', finish);
    video.addEventListener('error', finish);

    /* ilerleme çubuğu */
    var bar = $('#introBar');
    video.addEventListener('timeupdate', function () {
      if (!video.duration || !isFinite(video.duration)) return;
      bar.style.width = Math.min(100, (video.currentTime / video.duration) * 100) + '%';
    });

    $('#introSkip').addEventListener('click', finish);

    /* ses aç/kapat (autoplay için sessiz başlamak zorunda) */
    var soundBtn = $('#introSound');
    soundBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      video.muted = !video.muted;
      soundBtn.classList.toggle('is-on', !video.muted);
      soundBtn.setAttribute('aria-label', video.muted ? 'Sesi aç' : 'Sesi kapat');
      safePlay(video);
    });

    /* videoya / boşluğa dokunmak da geçer (düğmeler hariç) */
    intro.addEventListener('click', function (e) {
      if (e.target === intro || e.target === video ||
          (e.target.classList && e.target.classList.contains('intro__vignette'))) finish();
    });

    document.addEventListener('keydown', function (e) {
      if (finished) return;
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        finish();
      }
    });

    /* güvenlik ağı 2: autoplay engellenirse bekletme */
    timers.push(window.setTimeout(function () {
      if (video.paused || !video.currentTime) finish();
    }, 2000));

    /* güvenlik ağı 3 / süre sınırı: video uzun olsa da bu süreden fazla kalmaz */
    timers.push(window.setTimeout(finish, INTRO_MAX_MS));

    /* kaynağı şimdi bağla ve hızlandırılmış oynat */
    video.src = video.getAttribute('data-src');
    try { video.playbackRate = INTRO_SPEED; } catch (e) { /* yoksay */ }
    video.addEventListener('loadedmetadata', function once() {
      video.removeEventListener('loadedmetadata', once);
      try { video.playbackRate = INTRO_SPEED; } catch (e) { /* yoksay */ }
    });

    safePlay(video);
  }

  /* ===================================================================
     6. VİDEO MOTORU
     -------------------------------------------------------------------
     Kurallar:
       · Sayfa açılışında HİÇBİR video indirilmez (DOM'da <video> yok).
       · <source> yalnızca kullanıcı istediğinde eklenir  → preload="none"
       · Aynı anda YALNIZCA bir video oynar; yenisi başlarken eski durur
         ve kaynağı bellekten sökülür.
       · Ürün ekrandan çıkınca video otomatik duraklar (IntersectionObserver),
         geri geldiğinde kaldığı yerden devam eder.
       · Görünür olmak tek başına oynatmaz — tetikleyici daima kullanıcıdır.
       · Video dosyası yoksa arayüz bozulmaz; fotoğrafa geri düşer.
     =================================================================== */

  var activeVideo = null;   // şu an oynayan/duraklamış tek <video>
  var activeHost  = null;   // .card__media veya .sheet__media
  var autoPaused  = false;  // ekrandan çıktığı için mi duraklatıldı?
  var missingWarned = false;
  var playbackIO = null;

  function markUnavailable(product, note) {
    product.videoUnavailable = true;

    /* kartı sessizce normal (videosuz) karta dönüştür */
    var card = $('.card[data-id="' + product.id + '"]');
    if (card) {
      card.classList.remove('card--video');
      var media = $('.card__media', card);
      if (media) media.classList.remove('is-playing');
      $$('.card__play, .badge-video, .card__expand, .card__video', card).forEach(function (el) {
        el.parentNode.removeChild(el);
      });
      var cta = $('.card__cta', card);
      if (cta) cta.innerHTML = 'Detayları gör' + ARROW_SVG;
    }

    if (!missingWarned) {
      missingWarned = true;
      toast(note || 'Video dosyası bulunamadı — fotoğraf gösteriliyor.');
    }
  }

  /* Aktif videoyu durdur ve kaynağını bellekten sök. */
  function stopActive() {
    if (!activeVideo) return;

    try { activeVideo.pause(); } catch (e) { /* yoksay */ }
    try {
      activeVideo.removeAttribute('src');
      var src = activeVideo.querySelector('source');
      if (src) src.parentNode.removeChild(src);
      activeVideo.load();           // tampondaki veriyi serbest bırakır
    } catch (e) { /* yoksay */ }

    delete activeVideo.dataset.loaded;

    if (activeHost) {
      activeHost.classList.remove('is-playing');
      /* görünmez hâle gelen "büyüt" düğmesi klavye sırasından çıksın */
      $$('.card__expand', activeHost).forEach(function (b) { b.tabIndex = -1; });
      if (playbackIO) { try { playbackIO.unobserve(activeHost); } catch (e) {} }
    }

    activeVideo = null;
    activeHost = null;
    autoPaused = false;
  }

  /* Talep üzerine kaynağı bağla — sayfa yüklenirken DEĞİL. */
  function attachSource(video, product, onFail) {
    if (video.dataset.loaded === '1') return;

    var source = document.createElement('source');
    source.src = product.video;
    source.type = 'video/mp4';

    var failed = false;
    function fail() {
      if (failed) return;
      failed = true;
      onFail();
    }

    /* <source> her seferinde yeni oluşur; <video> ise yeniden kullanılır.
       Eski dinleyiciyi sök ki oynat/durdur döngüsünde birikmesin. */
    source.addEventListener('error', fail);
    if (video._onError) video.removeEventListener('error', video._onError);
    video._onError = fail;
    video.addEventListener('error', fail);

    video.appendChild(source);
    video.dataset.loaded = '1';
    video.preload = 'auto';
    video.load();
  }

  function makeVideoEl(className) {
    var v = document.createElement('video');
    v.className = className;
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'none';
    v.setAttribute('muted', '');
    v.setAttribute('loop', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('disablepictureinpicture', '');
    v.setAttribute('aria-hidden', 'true');
    v.tabIndex = -1;
    return v;
  }

  function safePlay(video) {
    var p;
    try { p = video.play(); } catch (e) { return; }
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* AbortError / NotAllowedError — sessizce yoksay */ });
    }
  }

  /* Ekrandan çıkan videoyu duraklat, geri gelince devam ettir. */
  function ensurePlaybackObserver() {
    if (playbackIO || !supportsIO) return;

    playbackIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target !== activeHost || !activeVideo) return;

        if (entry.intersectionRatio < 0.35) {
          if (!activeVideo.paused) {
            activeVideo.pause();
            autoPaused = true;
            activeHost.classList.remove('is-playing');
          }
        } else if (autoPaused && entry.intersectionRatio > 0.6) {
          autoPaused = false;
          activeHost.classList.add('is-playing');
          safePlay(activeVideo);
        }
      });
    }, { threshold: [0, 0.35, 0.6, 1] });
  }

  /* --- Kart içi (satır içi) oynatma --------------------------------- */
  function playInline(product, startAt) {
    if (!product.video || product.videoUnavailable) return;

    var media = $('.card__media[data-media="' + product.id + '"]');
    if (!media) return;

    stopActive();

    var video = $('.card__video', media);
    if (!video) {
      video = makeVideoEl('card__video');
      media.insertBefore(video, media.firstChild.nextSibling);
    }

    activeVideo = video;
    activeHost = media;
    autoPaused = false;

    attachSource(video, product, function () {
      if (activeHost === media) stopActive();
      markUnavailable(product);
    });

    if (startAt) {
      video.addEventListener('loadedmetadata', function once() {
        video.removeEventListener('loadedmetadata', once);
        try { video.currentTime = startAt; } catch (e) {}
      });
    }

    media.classList.add('is-playing');
    $$('.card__expand', media).forEach(function (b) { b.tabIndex = 0; });

    ensurePlaybackObserver();
    if (playbackIO) playbackIO.observe(media);

    safePlay(video);
  }

  /* Sekme arka plana alınırsa oynatmayı durdur (pil + veri tasarrufu). */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && activeVideo && !activeVideo.paused) {
      activeVideo.pause();
      autoPaused = true;
      if (activeHost) activeHost.classList.remove('is-playing');
    }
  });

  /* ===================================================================
     7. ÜRÜN / VİDEO SAYFASI (bottom sheet)
     =================================================================== */

  var sheetState = { product: null, open: false };
  var lastFocused = null;
  var scrollLockY = 0;

  function lockScroll() {
    scrollLockY = window.scrollY;
    document.body.classList.add('is-locked');
  }
  function unlockScroll() {
    document.body.classList.remove('is-locked');
    /* html{scroll-behavior:smooth} yüzünden geri dönüş animasyonlu olmasın */
    var html = document.documentElement;
    var prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, scrollLockY);
    html.style.scrollBehavior = prev;
  }

  function focusables(root) {
    return $$(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      root
    ).filter(function (el) {
      return !el.hasAttribute('hidden') && el.offsetParent !== null;
    });
  }

  function trapFocus(e, panel) {
    if (e.key !== 'Tab') return;
    var list = focusables(panel);
    if (!list.length) return;

    var first = list[0];
    var last = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function openOverlay(overlay, panel) {
    overlay.hidden = false;
    lockScroll();
    /* bir kare bekle ki geçiş animasyonu tetiklensin */
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { overlay.classList.add('is-open'); });
    });
    panel.focus({ preventScroll: true });
  }

  function closeOverlay(overlay) {
    overlay.classList.remove('is-open');
    var done = function () { overlay.hidden = true; };
    if (prefersReducedMotion) { done(); }
    else { window.setTimeout(done, 380); }
    unlockScroll();
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus({ preventScroll: true });
    }
    lastFocused = null;
  }

  /* --- Sheet içindeki video ----------------------------------------- */
  function sheetVideoEl() {
    var media = $('#sheetMedia');
    var v = $('video', media);
    if (!v) {
      v = makeVideoEl('sheet__video');
      media.insertBefore(v, $('#sheetPoster').nextSibling);
    }
    return v;
  }

  function updateMediaRatio(video) {
    if (!video.videoWidth || !video.videoHeight) return;
    var r = video.videoWidth / video.videoHeight;
    r = Math.max(0.62, Math.min(r, 1.78));   // aşırı dik/yatık videoları sınırla
    $('#sheetMedia').style.setProperty('--media-ratio', r.toFixed(4));
  }

  function playSheetVideo(product, startAt) {
    var media = $('#sheetMedia');
    var note = $('#sheetNote');
    var soundBtn = $('#sheetSound');

    stopActive();

    var video = sheetVideoEl();
    activeVideo = video;
    activeHost = media;
    autoPaused = false;

    media.classList.remove('is-still');

    var loadingTimer = window.setTimeout(function () {
      note.textContent = 'Video yükleniyor…';
      note.hidden = false;
    }, 700);

    function clearLoading() {
      window.clearTimeout(loadingTimer);
      note.hidden = true;
      note.textContent = '';
    }

    function onReady() {
      video.removeEventListener('loadeddata', onReady);
      video._onReady = null;
      clearLoading();
      updateMediaRatio(video);
      media.classList.add('is-playing');
      if (startAt) { try { video.currentTime = startAt; } catch (e) {} }
    }
    /* önceki (hiç tetiklenmemiş) dinleyici varsa sök — bayat startAt uygulamasın */
    if (video._onReady) video.removeEventListener('loadeddata', video._onReady);
    video._onReady = onReady;
    video.addEventListener('loadeddata', onReady);

    attachSource(video, product, function () {
      clearLoading();
      if (activeHost === media) stopActive();
      markUnavailable(product);
      showStill(product);
      note.textContent = 'Video demosu yakında eklenecek.';
      note.hidden = false;
    });

    soundBtn.hidden = false;
    soundBtn.classList.add('is-muted');
    soundBtn.setAttribute('aria-label', 'Sesi aç');

    safePlay(video);
  }

  /* Videosu olmayan (veya bulunamayan) ürünler: sinematik durağan görsel. */
  function showStill(product) {
    var media = $('#sheetMedia');
    media.classList.remove('is-playing');
    media.classList.add('is-still');
    media.style.setProperty('--media-ratio', '4 / 3');
    $('#sheetPlay').hidden = true;
    $('#sheetSound').hidden = true;
  }

  function openSheet(product, opts) {
    opts = opts || {};
    if (!product) return;

    /* Başka bir ürün açılıyor: oynayan HER video burada durur.
       Bunu playSheetVideo'ya bırakamayız — videosuz ürünlerde o yol hiç
       çalışmaz ve önceki ürünün videosu arka planda dönmeye devam ederdi.
       (Genişlet düğmesi currentTime'ı bu çağrıdan ÖNCE okur, o yüzden
       kaldığı yerden devam özelliği bozulmaz.) */
    stopActive();

    lastFocused = document.activeElement;
    sheetState.product = product;
    sheetState.open = true;

    var media = $('#sheetMedia');
    var poster = $('#sheetPoster');
    var note = $('#sheetNote');

    /* önceki durumu temizle */
    media.classList.remove('is-playing', 'is-still');
    note.hidden = true;
    note.textContent = '';

    poster.onerror = function () { poster.onerror = null; poster.src = FALLBACK_IMG; };
    poster.alt = product.name;
    poster.src = product.image;

    $('#sheetCat').textContent = product.category;
    $('#sheetTitle').textContent = product.name;
    $('#sheetPrice').textContent = product.price;
    $('#sheetDesc').textContent = product.description;

    $('#sheetTags').innerHTML = (product.tags || [])
      .map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');

    var playable = !!product.video && !product.videoUnavailable;

    if (playable) {
      media.style.setProperty('--media-ratio', '4 / 3');
      $('#sheetPlay').hidden = false;
      $('#sheetSound').hidden = true;
    } else {
      showStill(product);
    }

    openOverlay($('#sheetOverlay'), $('#sheet'));

    if (playable && opts.autoplay !== false) {
      playSheetVideo(product, opts.startAt || 0);
    }
  }

  function closeSheet() {
    if (!sheetState.open) return;
    sheetState.open = false;

    /* video: durdur, başa sar, kaynağı sök */
    if (activeHost === $('#sheetMedia')) {
      try { activeVideo.currentTime = 0; } catch (e) {}
      stopActive();
    }

    var media = $('#sheetMedia');
    media.classList.remove('is-playing', 'is-still');
    $('#sheetSound').hidden = true;
    $('#sheetNote').hidden = true;

    closeOverlay($('#sheetOverlay'));
    sheetState.product = null;
  }

  /* --- Aşağı sürükleyerek kapatma (mobil) --------------------------- */
  function initSheetDrag() {
    var sheet = $('#sheet');
    var grip = $('#sheetGrip');
    if (!sheet || !grip || !window.PointerEvent) return;

    var startY = 0, delta = 0, dragging = false;

    grip.addEventListener('pointerdown', function (e) {
      if (window.innerWidth >= 760) return;      // masaüstünde sürükleme yok
      dragging = true;
      startY = e.clientY;
      delta = 0;
      sheet.classList.add('is-dragging');
      grip.setPointerCapture(e.pointerId);
    });

    grip.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      delta = Math.max(0, e.clientY - startY);
      sheet.style.transform = 'translateY(' + delta + 'px)';
    });

    function end() {
      if (!dragging) return;
      dragging = false;
      sheet.classList.remove('is-dragging');
      sheet.style.transform = '';
      if (delta > 110) closeSheet();
    }

    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
  }

  /* ===================================================================
     8. QR KOD — kendi encoder'ımız (harici kütüphane / CDN yok)
     -------------------------------------------------------------------
     Byte modu, hata düzeltme seviyesi M, sürüm 1–10.
     Bir restoran menüsü adresi için fazlasıyla yeterli.
     =================================================================== */

  var QR = (function () {

    /* --- Galois alanı GF(256), üreteç polinomu 0x11D --- */
    var EXP = new Uint8Array(512);
    var LOG = new Uint8Array(256);
    (function () {
      var x = 1;
      for (var i = 0; i < 255; i++) {
        EXP[i] = x;
        LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
      }
      for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
    })();

    function mul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

    function genPoly(n) {
      var g = [1];
      for (var i = 0; i < n; i++) {
        var next = new Array(g.length + 1);
        for (var k = 0; k < next.length; k++) next[k] = 0;
        for (var j = 0; j < g.length; j++) {
          next[j] ^= g[j];                        // × x
          next[j + 1] ^= mul(g[j], EXP[i]);       // × α^i
        }
        g = next;
      }
      return g;
    }

    function rsRemainder(data, ecLen) {
      var g = genPoly(ecLen);                     // g[0] === 1
      var buf = new Uint8Array(data.length + ecLen);
      buf.set(data, 0);
      for (var i = 0; i < data.length; i++) {
        var coef = buf[i];
        if (coef === 0) continue;
        for (var j = 1; j <= ecLen; j++) buf[i + j] ^= mul(g[j], coef);
      }
      return buf.subarray(data.length);
    }

    /* --- Hata düzeltme seviyesi M için blok tablosu (sürüm 1–10) ---
       [ecCodewordsPerBlock, grup1Blok, grup1Veri, grup2Blok, grup2Veri] */
    var RS = {
      1:  [10, 1, 16, 0, 0],
      2:  [16, 1, 28, 0, 0],
      3:  [26, 1, 44, 0, 0],
      4:  [18, 2, 32, 0, 0],
      5:  [24, 2, 43, 0, 0],
      6:  [16, 4, 27, 0, 0],
      7:  [18, 4, 31, 0, 0],
      8:  [22, 2, 38, 2, 39],
      9:  [22, 3, 36, 2, 37],
      10: [26, 4, 43, 1, 44]
    };

    var ALIGN = {
      1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
      6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50]
    };

    var MASKS = [
      function (r, c) { return (r + c) % 2 === 0; },
      function (r)    { return r % 2 === 0; },
      function (r, c) { return c % 3 === 0; },
      function (r, c) { return (r + c) % 3 === 0; },
      function (r, c) { return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; },
      function (r, c) { return (r * c) % 2 + (r * c) % 3 === 0; },
      function (r, c) { return ((r * c) % 2 + (r * c) % 3) % 2 === 0; },
      function (r, c) { return ((r + c) % 2 + (r * c) % 3) % 2 === 0; }
    ];

    function dataCapacity(v) {
      var t = RS[v];
      return t[1] * t[2] + t[3] * t[4];
    }

    function utf8Bytes(str) {
      if (typeof TextEncoder === 'function') return new TextEncoder().encode(str);
      var out = [], i, c;
      for (i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) out.push(c);
        else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
        else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      }
      return new Uint8Array(out);
    }

    function buildCodewords(bytes, version) {
      var total = dataCapacity(version);
      var countBits = version < 10 ? 8 : 16;
      var bits = [];

      function push(val, len) {
        for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
      }

      push(0x4, 4);                    // byte modu
      push(bytes.length, countBits);
      for (var i = 0; i < bytes.length; i++) push(bytes[i], 8);

      var cap = total * 8;
      push(0, Math.min(4, cap - bits.length));            // sonlandırıcı
      while (bits.length % 8 !== 0) bits.push(0);         // bayta tamamla

      var pad = [0xec, 0x11], k = 0;
      while (bits.length < cap) { push(pad[k % 2], 8); k++; }

      var cw = new Uint8Array(total);
      for (var b = 0; b < total; b++) {
        var v = 0;
        for (var j = 0; j < 8; j++) v = (v << 1) | bits[b * 8 + j];
        cw[b] = v;
      }
      return cw;
    }

    function interleave(cw, version) {
      var t = RS[version];
      var ecLen = t[0], b1 = t[1], d1 = t[2], b2 = t[3], d2 = t[4];
      var blocks = [], ecBlocks = [], off = 0, i, b;

      for (i = 0; i < b1 + b2; i++) {
        var len = i < b1 ? d1 : d2;
        var blk = cw.subarray(off, off + len);
        off += len;
        blocks.push(blk);
        ecBlocks.push(rsRemainder(blk, ecLen));
      }

      var out = [];
      var maxLen = Math.max(d1, d2);
      for (i = 0; i < maxLen; i++) {
        for (b = 0; b < blocks.length; b++) {
          if (i < blocks[b].length) out.push(blocks[b][i]);
        }
      }
      for (i = 0; i < ecLen; i++) {
        for (b = 0; b < ecBlocks.length; b++) out.push(ecBlocks[b][i]);
      }
      return out;
    }

    /* --- BCH kodları --- */
    function formatBits(mask) {
      var data = (0 << 3) | mask;            // ECC seviyesi M = 0b00
      var d = data << 10;
      for (var i = 4; i >= 0; i--) {
        if ((d >>> (i + 10)) & 1) d ^= 0x537 << i;
      }
      return ((data << 10) | d) ^ 0x5412;
    }

    function versionBits(v) {
      var rem = v;
      for (var i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      return (v << 12) | (rem & 0xfff);
    }

    /* --- Matris --- */
    function build(text) {
      var bytes = utf8Bytes(text);
      var version = 0;

      for (var v = 1; v <= 10; v++) {
        var countBits = v < 10 ? 8 : 16;
        if (4 + countBits + bytes.length * 8 <= dataCapacity(v) * 8) { version = v; break; }
      }
      if (!version) return null;               // 10. sürüme sığmayacak kadar uzun

      var size = version * 4 + 17;
      var mod = [], fn = [], r, c;

      for (r = 0; r < size; r++) {
        mod.push(new Array(size).fill(false));
        fn.push(new Array(size).fill(false));
      }

      function setFn(row, col, dark) {
        if (row < 0 || col < 0 || row >= size || col >= size) return;
        mod[row][col] = dark;
        fn[row][col] = true;
      }

      /* zamanlama desenleri */
      for (var i = 0; i < size; i++) {
        setFn(6, i, i % 2 === 0);
        setFn(i, 6, i % 2 === 0);
      }

      /* konum belirleme (finder) desenleri + ayırıcılar */
      function finder(cr, cc) {
        for (var dy = -4; dy <= 4; dy++) {
          for (var dx = -4; dx <= 4; dx++) {
            var dist = Math.max(Math.abs(dx), Math.abs(dy));
            setFn(cr + dy, cc + dx, dist !== 2 && dist !== 4);
          }
        }
      }
      finder(3, 3);
      finder(3, size - 4);
      finder(size - 4, 3);

      /* hizalama (alignment) desenleri */
      var pos = ALIGN[version];
      for (var a = 0; a < pos.length; a++) {
        for (var b = 0; b < pos.length; b++) {
          var last = pos.length - 1;
          if ((a === 0 && b === 0) || (a === 0 && b === last) || (a === last && b === 0)) continue;
          for (var ddy = -2; ddy <= 2; ddy++) {
            for (var ddx = -2; ddx <= 2; ddx++) {
              setFn(pos[a] + ddy, pos[b] + ddx, Math.max(Math.abs(ddx), Math.abs(ddy)) !== 1);
            }
          }
        }
      }

      /* biçim bilgisi alanını rezerve et (geçici maske 0) */
      function drawFormat(mask) {
        var bits = formatBits(mask);
        function bit(n) { return ((bits >>> n) & 1) === 1; }

        for (var i = 0; i <= 5; i++) setFn(i, 8, bit(i));
        setFn(7, 8, bit(6));
        setFn(8, 8, bit(7));
        setFn(8, 7, bit(8));
        for (var j = 9; j < 15; j++) setFn(8, 14 - j, bit(j));

        for (var k = 0; k < 8; k++) setFn(8, size - 1 - k, bit(k));
        for (var m = 8; m < 15; m++) setFn(size - 15 + m, 8, bit(m));

        setFn(size - 8, 8, true);              // daima koyu modül
      }
      drawFormat(0);

      /* sürüm bilgisi (sürüm ≥ 7) */
      if (version >= 7) {
        var vb = versionBits(version);
        for (var q = 0; q < 18; q++) {
          var on = ((vb >>> q) & 1) === 1;
          var aa = size - 11 + (q % 3);
          var bb = Math.floor(q / 3);
          setFn(bb, aa, on);
          setFn(aa, bb, on);
        }
      }

      /* veri yerleşimi (zikzak) */
      var data = interleave(buildCodewords(bytes, version), version);
      var bitIdx = 0;
      var totalBits = data.length * 8;

      for (var right = size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;                       // 6. sütun zamanlama
        for (var vert = 0; vert < size; vert++) {
          for (var j2 = 0; j2 < 2; j2++) {
            var col = right - j2;
            var upward = ((right + 1) & 2) === 0;
            var row = upward ? size - 1 - vert : vert;
            if (fn[row][col]) continue;
            var dark = false;
            if (bitIdx < totalBits) {
              dark = ((data[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1) === 1;
              bitIdx++;
            }
            mod[row][col] = dark;
          }
        }
      }

      /* maske seçimi (en düşük ceza puanı) */
      var best = 0, bestScore = Infinity;
      for (var mk = 0; mk < 8; mk++) {
        applyMask(mod, fn, size, mk);
        drawFormat(mk);
        var s = penalty(mod, size);
        if (s < bestScore) { bestScore = s; best = mk; }
        applyMask(mod, fn, size, mk);      // maske kendi tersidir → geri al
      }
      applyMask(mod, fn, size, best);
      drawFormat(best);

      return { size: size, modules: mod, version: version };
    }

    function applyMask(mod, fn, size, mask) {
      var f = MASKS[mask];
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          if (!fn[r][c] && f(r, c)) mod[r][c] = !mod[r][c];
        }
      }
    }

    function penalty(mod, size) {
      var score = 0, r, c, i;

      /* Kural 1 — aynı renkte 5+ ardışık modül */
      function runScore(get) {
        var s = 0;
        for (var a = 0; a < size; a++) {
          var run = 1;
          for (var b = 1; b < size; b++) {
            if (get(a, b) === get(a, b - 1)) {
              run++;
            } else {
              if (run >= 5) s += 3 + (run - 5);
              run = 1;
            }
          }
          if (run >= 5) s += 3 + (run - 5);
        }
        return s;
      }
      score += runScore(function (a, b) { return mod[a][b]; });
      score += runScore(function (a, b) { return mod[b][a]; });

      /* Kural 2 — 2×2 tek renk bloklar */
      for (r = 0; r < size - 1; r++) {
        for (c = 0; c < size - 1; c++) {
          var v = mod[r][c];
          if (v === mod[r][c + 1] && v === mod[r + 1][c] && v === mod[r + 1][c + 1]) score += 3;
        }
      }

      /* Kural 3 — 1:1:3:1:1 finder benzeri desenler */
      var P1 = [true, false, true, true, true, false, true, false, false, false, false];
      var P2 = [false, false, false, false, true, false, true, true, true, false, true];

      function matches(arr, at, pat) {
        for (var k = 0; k < 11; k++) if (arr[at + k] !== pat[k]) return false;
        return true;
      }
      for (r = 0; r < size; r++) {
        var row = mod[r];
        var col = [];
        for (i = 0; i < size; i++) col.push(mod[i][r]);
        for (i = 0; i + 11 <= size; i++) {
          if (matches(row, i, P1) || matches(row, i, P2)) score += 40;
          if (matches(col, i, P1) || matches(col, i, P2)) score += 40;
        }
      }

      /* Kural 4 — koyu/açık oran dengesi */
      var dark = 0;
      for (r = 0; r < size; r++) for (c = 0; c < size; c++) if (mod[r][c]) dark++;
      var pct = dark * 100 / (size * size);
      score += Math.floor(Math.abs(pct - 50) / 5) * 10;

      return score;
    }

    /* --- Canvas'a çiz --- */
    function draw(canvas, qr, targetPx, quiet) {
      quiet = quiet == null ? 4 : quiet;
      var total = qr.size + quiet * 2;
      var scale = Math.max(2, Math.floor(targetPx / total));
      var px = total * scale;

      canvas.width = px;
      canvas.height = px;

      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, px, px);
      ctx.fillStyle = '#0a0a0c';

      for (var r = 0; r < qr.size; r++) {
        for (var c = 0; c < qr.size; c++) {
          if (qr.modules[r][c]) {
            ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
          }
        }
      }
      return px;
    }

    return { build: build, draw: draw };
  })();

  /* --- QR modalı ---------------------------------------------------- */
  function currentURL() {
    if (SITE_URL) return SITE_URL;
    return window.location.href.split('#')[0];
  }

  function initQR() {
    var overlay = $('#qrOverlay');
    var canvas = $('#qrCanvas');
    var built = false;

    function render() {
      if (built) return;

      var url = currentURL();
      $('#qrUrl').textContent = url;

      var qr = QR.build(url);
      if (!qr) {
        $('#qrHint').textContent = 'Adres QR koda sığmayacak kadar uzun. Yayına aldıktan sonra kısa adresle tekrar deneyin.';
        canvas.hidden = true;
        return;
      }

      var px = QR.draw(canvas, qr, 240);
      canvas.style.width = px + 'px';
      canvas.style.height = px + 'px';
      canvas.setAttribute('aria-label', 'QR kod: ' + url);

      $('#qrHint').textContent = SITE_URL
        ? 'Bu kodu masa kartlarına bastırabilirsiniz — nereden açılırsa açılsın daima yayındaki menüye götürür.'
        : (window.location.protocol === 'file:'
            ? 'Sayfa bilgisayardan (file://) açıldığı için bu kod yerel bir dosya adresini gösterir. Siteyi yayına aldığınızda kod otomatik olarak gerçek adresi içerir.'
            : 'Bu kodu masa kartlarına bastırabilirsiniz — menüye doğrudan bu sayfadan ulaşılır.');

      built = true;
    }

    $$('[data-action="open-qr"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        stopActive();                 // ekranı kaplayan modal: video arkada dönmesin
        lastFocused = document.activeElement;
        render();
        openOverlay(overlay, $('#qrModal'));
      });
    });

    $('#qrCopy').addEventListener('click', function () {
      var url = currentURL();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          function () { toast('Bağlantı kopyalandı.'); },
          function () { toast('Kopyalanamadı — adresi elle seçebilirsiniz.'); }
        );
      } else {
        toast('Kopyalama desteklenmiyor — adresi elle seçebilirsiniz.');
      }
    });

    $('#qrDownload').addEventListener('click', function () {
      var qr = QR.build(currentURL());
      if (!qr) { toast('QR oluşturulamadı.'); return; }

      var big = document.createElement('canvas');
      QR.draw(big, qr, 1024);

      try {
        var link = document.createElement('a');
        link.download = 'siyah-inci-qr.png';
        link.href = big.toDataURL('image/png');
        link.click();
        toast('QR kod indiriliyor.');
      } catch (e) {
        toast('İndirme başarısız oldu.');
      }
    });
  }

  /* ===================================================================
     9. TOAST
     =================================================================== */

  var toastTimer = null;

  function toast(message) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { el.classList.remove('is-on'); }, 3200);
  }

  /* ===================================================================
     10. BAŞLANGIÇ
     =================================================================== */

  function initInteractions() {

    /* --- Kart etkileşimleri (olay delegasyonu → 40+ üründe de hızlı) --- */
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t.closest) return;

      var playBtn = t.closest('[data-play]');
      if (playBtn) {
        e.preventDefault();
        playInline(byId[playBtn.getAttribute('data-play')]);
        return;
      }

      var expandBtn = t.closest('[data-expand]');
      if (expandBtn) {
        e.preventDefault();
        var pid = expandBtn.getAttribute('data-expand');
        var at = 0;
        /* satır içi oynatmadaki an, tam ekranda kaldığı yerden devam etsin */
        if (activeVideo && activeHost === $('.card__media[data-media="' + pid + '"]')) {
          at = activeVideo.currentTime || 0;
        }
        openSheet(byId[pid], { startAt: at });
        return;
      }

      var openBtn = t.closest('[data-open]');
      if (openBtn) {
        e.preventDefault();
        openSheet(byId[openBtn.getAttribute('data-open')]);
        return;
      }

      var closer = t.closest('[data-close]');
      if (closer) {
        e.preventDefault();
        if (closer.getAttribute('data-close') === 'sheet') closeSheet();
        else closeOverlay($('#qrOverlay'));
      }
    });

    /* --- Sheet içindeki oynat düğmesi --- */
    $('#sheetPlay').addEventListener('click', function () {
      if (sheetState.product) playSheetVideo(sheetState.product, 0);
    });

    /* --- Ses aç/kapat --- */
    $('#sheetSound').addEventListener('click', function () {
      if (!activeVideo) return;
      var on = activeVideo.muted;
      activeVideo.muted = !on;
      this.classList.toggle('is-muted', !on);
      this.setAttribute('aria-label', on ? 'Sesi kapat' : 'Sesi aç');
      if (on) safePlay(activeVideo);   // bazı tarayıcılar ses açılınca duraklatır
    });

    /* --- Klavye: Esc kapatır, Tab modalın içinde döner --- */
    document.addEventListener('keydown', function (e) {
      var qrOpen = !$('#qrOverlay').hidden;
      var sheetOpen = !$('#sheetOverlay').hidden;

      if (e.key === 'Escape') {
        if (qrOpen) { closeOverlay($('#qrOverlay')); return; }
        if (sheetOpen) { closeSheet(); return; }
      }

      if (qrOpen) trapFocus(e, $('#qrModal'));
      else if (sheetOpen) trapFocus(e, $('#sheet'));
    });
  }

  function init() {
    /* Menü, açılış videosunun ARKASINDA hemen hazırlanır —
       intro bittiğinde bekleme olmaz. */
    renderNav();
    renderMenu();
    renderStats();
    initNav();
    initImageFallbacks();
    initInteractions();
    initSheetDrag();
    initQR();

    /* Kartlar en baştan gizli olsun ki intro biterken "görünür → gizli →
       akarak gel" şeklinde bir sıçrama yaşanmasın. */
    if (supportsIO && !prefersReducedMotion) {
      document.documentElement.classList.add('js-reveal');
    }

    /* intro biter bitmez kartlar akarak gelsin */
    initIntro(startReveal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
