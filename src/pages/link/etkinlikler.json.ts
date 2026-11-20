import type { APIRoute } from "astro";
import { etkinlikler, googleTakvimLinki, type Etkinlik } from "../../veri";

// Link sayfası (/link) "Sıradaki etkinlik" kartını ve "Geçmiş etkinlikler" listesini bu dosyadan doldurur.
// Tüm etkinlikler eskiden yeniye yazılır; hangisinin geçmiş olduğuna tarayıcı o anki saate göre karar verir.
export const GET: APIRoute = async ({ site }) => {
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
