// Arama motorları ve yapay zekâ asistanları için yapısal veri (schema.org, JSON-LD).
// Sayfalarda görünmez; kulübün kim olduğunu ve etkinliklerin ne zaman, nerede olduğunu makinelere anlatır.
import { METIN, yol, type Dil } from "./i18n";
import type { Etkinlik } from "./veri";

type Ayarlar = { instagram: string; linkedin: string; eposta: string; kapak: string };
type Dugum = Record<string, unknown>;

const KAMPUS = {
  "@type": "PostalAddress",
  streetAddress: "Meşrutiyet Mahallesi, Üniversite Sokak No:2",
  addressLocality: "Şile",
  addressRegion: "İstanbul",
  postalCode: "34980",
  addressCountry: "TR",
};

const kulupKimligi = (site: URL) => new URL("/#kulup", site).href;

// Türkiye saatiyle ISO 8601 ("2026-11-27T19:00:00+03:00"). Türkiye yıl boyu UTC+3.
function yerelIso(d: Date) {
  return new Date(d.getTime() + 3 * 3600 * 1000).toISOString().slice(0, 19) + "+03:00";
}

// Kulüp: her sayfada aynı kimlikle (@id) yer alır, böylece etkinlikler ona bağlanır.
export function kulupSemasi(dil: Dil, A: Ayarlar, site: URL): Dugum {
  const M = METIN[dil];
  const diger = METIN[dil === "tr" ? "en" : "tr"];
  return {
    "@type": "Organization",
    "@id": kulupKimligi(site),
    name: M.kulup,
    alternateName: ["Işık DSAI", M.kulupKisa, diger.kulup],
    url: new URL(yol("anasayfa", dil), site).href,
    logo: { "@type": "ImageObject", url: new URL("/img/kulup-logo.png", site).href, width: 256, height: 256 },
    ...(A.kapak ? { image: new URL(`/etkinlikler/${A.kapak}-1600.jpg`, site).href } : {}),
    description: M.aciklamalar.anasayfa,
    ...(A.eposta ? { email: A.eposta } : {}),
    address: KAMPUS,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: dil === "en" ? "Işık University" : "Işık Üniversitesi",
      url: "https://www.isikun.edu.tr/",
      sameAs: [
        "https://tr.wikipedia.org/wiki/I%C5%9F%C4%B1k_%C3%9Cniversitesi",
        "https://en.wikipedia.org/wiki/I%C5%9F%C4%B1k_University",
      ],
    },
    sameAs: [A.instagram, A.linkedin].filter(Boolean),
    knowsAbout: M.konular,
  };
}

export function siteSemasi(dil: Dil, site: URL): Dugum {
  const M = METIN[dil];
  return {
    "@type": "WebSite",
    "@id": new URL("/#site", site).href,
    url: site.href,
    name: M.kulup,
    alternateName: M.kulupKisa,
    inLanguage: ["tr", "en"],
    publisher: { "@id": kulupKimligi(site) },
  };
}

// Sayfanın sitedeki yeri: Ana sayfa › Etkinlikler › Etkinlik adı
export function yolSemasi(adimlar: { ad: string; yol: string }[], site: URL): Dugum {
  return {
    "@type": "BreadcrumbList",
    itemListElement: adimlar.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.ad,
      item: new URL(a.yol, site).href,
    })),
  };
}

export function etkinlikSemasi(e: Etkinlik, dil: Dil, site: URL): Dugum {
  const cevrimIci = /çevrim içi|online/i.test(e.yer);
  const sayfa = new URL(e.sayfa, site).href;
  const g = e.gorsel ? `/etkinlikler/${e.gorsel}` : "";
  const gorsel = g ? new URL(e.afis ? `${g}.jpg` : `${g}-1600.jpg`, site).href : "";
  // Saati bilinmeyen etkinlikte (saat boş) yalnızca gün yazılır.
  const baslangic = e.saat ? yerelIso(e.baslangic) : yerelIso(e.baslangic).slice(0, 10);
  return {
    "@type": "Event",
    "@id": `${sayfa}#etkinlik`,
    name: e.baslik,
    ...(e.ozet ? { description: e.ozet } : {}),
    url: sayfa,
    startDate: baslangic,
    ...(e.saat ? { endDate: yerelIso(e.bitis) } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: cevrimIci
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: cevrimIci
      ? { "@type": "VirtualLocation", url: e.kayitLinki || e.link || sayfa }
      : { "@type": "Place", name: e.yer || (dil === "en" ? "Işık University Şile Campus" : "Işık Üniversitesi Şile Kampüsü"), address: KAMPUS },
    ...(gorsel ? { image: [gorsel] } : {}),
    inLanguage: "tr",
    organizer: { "@id": kulupKimligi(site) },
    ...(e.konuklar.length
      ? {
          performer: e.konuklar.map((k) => {
            const [ad, unvan] = k.split(" · ");
            return { "@type": "Person", name: ad, ...(unvan ? { description: unvan } : {}) };
          }),
        }
      : {}),
  };
}

// <script type="application/ld+json"> içine yazılacak metin. "<" kaçışlı: içerik etiketi kapatamaz.
export function jsonLd(dugumler: Dugum[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": dugumler }).replace(/</g, "\\u003c");
}
