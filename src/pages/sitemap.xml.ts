import type { APIRoute } from "astro";
import { YOLLAR, type Sayfa } from "../i18n";
import { etkinlikler, etkinlikYolu } from "../veri";

// Site haritası: arama motorlarına sitedeki tüm sayfaları ve her sayfanın iki dildeki karşılığını bildirir.
// Yeni etkinlik eklendiğinde kendiliğinden güncellenir.
export const GET: APIRoute = async ({ site }) => {
  const ciftler = [
    ...(Object.keys(YOLLAR) as Sayfa[]).map((s) => YOLLAR[s]),
    ...(await etkinlikler("tr")).map((e) => ({ tr: etkinlikYolu(e.id, "tr"), en: etkinlikYolu(e.id, "en") })),
  ];
  const tam = (y: string) => new URL(y, site).href;
  const girdi = (c: { tr: string; en: string }, dil: "tr" | "en") =>
    [
      "  <url>",
      `    <loc>${tam(c[dil])}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="tr" href="${tam(c.tr)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${tam(c.en)}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${tam(c.tr)}"/>`,
      "  </url>",
    ].join("\n");
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...ciftler.flatMap((c) => [girdi(c, "tr"), girdi(c, "en")]),
    "</urlset>",
    "",
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
