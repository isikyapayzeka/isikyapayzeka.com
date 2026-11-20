import type { APIRoute } from "astro";
import { etkinlikler, googleTakvimLinki, type Etkinlik } from "../../veri";

// Link sayfası (/link) "Sıradaki etkinlik" kartını bu dosyadan doldurur.
// Build anında bitmemiş etkinlikler yazılır; tarayıcı bitiş saati geçeni ayrıca eler.
export const GET: APIRoute = async ({ site }) => {
  const simdi = Date.now();
  const tr = await etkinlikler("tr");
  const en = await etkinlikler("en");
  const dilde = (e: Etkinlik) => ({
    baslik: e.baslik,
    yer: e.yer,
    gorselAlt: e.gorselAlt,
    sayfa: e.sayfa,
    takvim: e.takvimDosyasi,
    google: googleTakvimLinki(e, new URL(e.sayfa, site).href),
  });
  const liste = tr
    .filter((e) => e.bitis.getTime() >= simdi)
    .sort((a, b) => a.baslangic.getTime() - b.baslangic.getTime())
    .map((e) => {
      const g = e.gorsel ? `/etkinlikler/${e.gorsel}` : "";
      return {
        id: e.id,
        baslangic: e.iso,
        bitis: e.bitisIso,
        kayitLinki: e.kayitLinki,
        gorsel: g ? (e.afis ? `${g}.jpg` : `${g}-800.jpg`) : "",
        tr: dilde(e),
        en: dilde(en.find((x) => x.id === e.id)!),
      };
    });
  return new Response(JSON.stringify({ etkinlikler: liste }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
