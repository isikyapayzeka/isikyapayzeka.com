import type { APIRoute } from "astro";
import { YOLLAR, type Sayfa } from "../i18n";
import { etkinlikTarihi, sayfaTarihi } from "../tazelik";
import { etkinlikler, etkinlikYolu } from "../veri";

// Site haritası: arama motorlarına sitedeki tüm sayfaları ve her sayfanın iki dildeki karşılığını bildirir.
// Yeni etkinlik eklendiğinde kendiliğinden güncellenir; her sayfanın son değişiklik tarihi git geçmişinden okunur.
export const GET: APIRoute = async ({ site }) => {
  const ciftler = [
    ...(Object.keys(YOLLAR) as Sayfa[]).map((s) => ({ ...YOLLAR[s], tarih: sayfaTarihi(s) })),
    ...(await etkinlikler("tr")).map((e) => ({ tr: etkinlikYolu(e.id, "tr"), en: etkinlikYolu(e.id, "en"), tarih: etkinlikTarihi(e.id) })),
  ];
  const tam = (y: string) => new URL(y, site).href;
  // <lastmod>: sayfanın içeriğinin son değiştiği an. Bilinmiyorsa satır yazılmaz.
  const girdi = (c: { tr: string; en: string; tarih: string }, dil: "tr" | "en") =>
    [
      "  <url>",
      `    <loc>${tam(c[dil])}</loc>`,
      c.tarih ? `    <lastmod>${c.tarih}</lastmod>` : "",
      `    <xhtml:link rel="alternate" hreflang="tr" href="${tam(c.tr)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${tam(c.en)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${tam(c.tr)}"/>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...ciftler.flatMap((c) => [girdi(c, "tr"), girdi(c, "en")]),
    "</urlset>",
    "",
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
