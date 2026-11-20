import { readFileSync } from "node:fs";
import { getCollection, getEntry } from "astro:content";
import type { Dil } from "./i18n";
import { METIN, yol } from "./i18n";

const TZ = "Europe/Istanbul";

// "2026-04-30" + "16:30" → Türkiye saatiyle an (Türkiye yıl boyu UTC+3).
function an(tarih: string, saat: string) {
  const [s, d] = saat.split(":");
  return new Date(`${tarih}T${s.padStart(2, "0")}:${d}:00+03:00`);
}

// Akademik dönem: Eylül'den Ağustos'a ("2025–26").
function akademikDonem(tarih: string) {
  const [y, m] = tarih.split("-").map(Number);
  const bas = m >= 9 ? y : y - 1;
  return `${bas}–${String(bas + 1).slice(2)}`;
}

// public/etkinlikler/<ad>.jpg dosyasının piksel boyutu (JPEG başlığından okunur).
// Afişler kırpılmadan kendi oranlarıyla gösterildiği için kartın yüksekliği buna göre ayarlanır.
function jpegBoyutu(ad: string) {
  try {
    const b = readFileSync(`public/etkinlikler/${ad}.jpg`);
    let i = 2;
    while (i < b.length) {
      const isaret = b[i + 1];
      const uzunluk = b.readUInt16BE(i + 2);
      if (isaret >= 0xc0 && isaret <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(isaret)) {
        return { en: b.readUInt16BE(i + 7), boy: b.readUInt16BE(i + 5) };
      }
      i += 2 + uzunluk;
    }
  } catch {}
  return { en: 1, boy: 1 };
}

export type Etkinlik = Awaited<ReturnType<typeof etkinlikler>>[number];

export async function etkinlikler(dil: Dil) {
  const M = METIN[dil];
  const ortakListe = await getCollection("ortaklar");
  const ortakAd = new Map(ortakListe.map((o) => [o.id, dil === "en" && o.data.adEn ? o.data.adEn : o.data.ad]));
  const tumu = await getCollection("etkinlikler");
  return tumu
    .map(({ id, data: e }) => {
      const baslangic = an(e.tarih, e.saat);
      const bitis = e.bitis ? an(e.tarih, e.bitis) : new Date(baslangic.getTime() + 2 * 3600 * 1000);
      const sec = (tr: string, en: string) => (dil === "en" && en ? en : tr);
      return {
        id,
        baslik: sec(e.baslik, e.baslikEn),
        ozet: sec(e.ozet, e.ozetEn),
        yer: sec(e.yer, e.yerEn),
        tur: M.turler[e.tur],
        konuklar: e.konuklar,
        ortaklar: e.ortaklar.map((o) => ortakAd.get(o) ?? o),
        ortakIdleri: e.ortaklar,
        link: e.link,
        kayitLinki: e.kayitLinki,
        gorsel: e.gorsel,
        gorselAlt: sec(e.gorselAlt, e.gorselAltEn),
        afis: e.afis,
        afisBoyut: e.gorsel && e.afis ? jpegBoyutu(e.gorsel) : null,
        galeri: e.galeri,
        sayfa: etkinlikYolu(id, dil),
        takvimDosyasi: `${dil === "en" ? "/en/calendar/" : "/takvim/"}${id}.ics`,
        baslangic,
        bitis,
        donem: akademikDonem(e.tarih),
        gun: new Intl.DateTimeFormat(M.yerel, { timeZone: TZ, day: "numeric", month: "long", year: "numeric" }).format(baslangic),
        gunKisa: new Intl.DateTimeFormat(M.yerel, { timeZone: TZ, day: "numeric", month: "short" }).format(baslangic),
        haftaGunu: new Intl.DateTimeFormat(M.yerel, { timeZone: TZ, weekday: "long" }).format(baslangic),
        saat: e.saat === "00:00" ? "" : e.saat + (e.bitis ? `–${e.bitis}` : ""),
        iso: baslangic.toISOString(),
        bitisIso: bitis.toISOString(),
      };
    })
    .sort((a, b) => b.baslangic.getTime() - a.baslangic.getTime());
}

export async function ayarlar() {
  const kayit = await getEntry("ayarlar", "site");
  if (!kayit) throw new Error("src/data/ayarlar.yml içinde 'site' bulunamadı");
  return kayit.data;
}

export async function ortaklar(dil: Dil) {
  const liste = await getCollection("ortaklar");
  return liste.map(({ id, data: o }) => ({ id, ...o, ad: dil === "en" && o.adEn ? o.adEn : o.ad }));
}

export async function ekip(dil: Dil) {
  const liste = await getCollection("ekip");
  return liste.map(({ id, data: k }) => ({
    id,
    ...k,
    rol: dil === "en" && k.rolEn ? k.rolEn : k.rol,
    bolum: dil === "en" && k.bolumEn ? k.bolumEn : k.bolum,
  }));
}

// Ana sayfadaki rakamlar: veriden build sırasında sayılır, sayfaya düz metin olarak yazılır.
export async function rakamlar() {
  const tumu = await getCollection("etkinlikler");
  const gecmis = tumu.filter((e) => an(e.data.tarih, e.data.saat).getTime() < Date.now());
  const konuklar = new Set(gecmis.flatMap((e) => e.data.konuklar));
  const ortakKulupler = new Set(
    (await getCollection("ortaklar")).filter((o) => o.data.tur === "kulup").map((o) => o.id),
  );
  const calisilanKulupler = new Set(gecmis.flatMap((e) => e.data.ortaklar).filter((o) => ortakKulupler.has(o)));
  return { etkinlik: gecmis.length, konuk: konuklar.size, ortak: calisilanKulupler.size };
}

// Etkinliğin kendi sayfası: /etkinlikler/<id>/ ve /en/events/<id>/
export function etkinlikYolu(id: string, dil: Dil) {
  return `${yol("etkinlikler", dil)}${id}/`;
}

// "20261127T160000Z" biçimi (takvimler UTC ister).
function utc(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function googleTakvimLinki(e: Etkinlik, sayfaUrl: string) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: e.baslik,
    dates: `${utc(e.baslangic)}/${utc(e.bitis)}`,
    details: [e.ozet, e.kayitLinki, sayfaUrl].filter(Boolean).join("\n\n"),
    location: e.yer,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

// RFC 5545: virgül, noktalı virgül ve satır sonu kaçışlı; 75 baytı geçen satırlar katlanır.
function icsKacis(m: string) {
  return m.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
function katla(satir: string) {
  const enc = new TextEncoder();
  const parcalar: string[] = [];
  let p = "";
  for (const ch of satir) {
    const sinir = parcalar.length ? 74 : 75;
    if (enc.encode(p + ch).length > sinir) { parcalar.push(p); p = ch; } else p += ch;
  }
  parcalar.push(p);
  return parcalar.join("\r\n ");
}
export function icsMetni(e: Etkinlik, sayfaUrl: string) {
  const satirlar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//isikyapayzeka.com//Etkinlikler//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.id}@isikyapayzeka.com`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(e.baslangic)}`,
    `DTEND:${utc(e.bitis)}`,
    `SUMMARY:${icsKacis(e.baslik)}`,
    e.yer ? `LOCATION:${icsKacis(e.yer)}` : "",
    `DESCRIPTION:${icsKacis([e.ozet, e.kayitLinki, sayfaUrl].filter(Boolean).join("\n\n"))}`,
    `URL:${sayfaUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return satirlar.map(katla).join("\r\n") + "\r\n";
}

export function epostaHref(adres: string, konu = "") {
  return `mailto:${adres}${konu ? `?subject=${encodeURIComponent(konu)}` : ""}`;
}
