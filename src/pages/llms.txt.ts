import type { APIRoute } from "astro";
import { METIN, YOLLAR, type Sayfa } from "../i18n";
import { ayarlar, etkinlikler } from "../veri";

// llms.txt: yapay zekâ asistanları (ChatGPT, Claude, Perplexity vb.) için sitenin düz metin özeti.
// Kulübün ne olduğu, sayfalar ve etkinlikler veriden derlenir; yeni etkinlik eklenince kendiliğinden güncellenir.
export const GET: APIRoute = async ({ site }) => {
  const tr = METIN.tr;
  const en = METIN.en;
  const A = await ayarlar();
  const tumu = await etkinlikler("tr");
  const ing = new Map((await etkinlikler("en")).map((e) => [e.id, e]));
  const tam = (y: string) => new URL(y, site).href;
  const simdi = Date.now();
  const satir = (e: (typeof tumu)[number]) => {
    const parcalar = [e.gun + (e.saat ? ` ${e.saat}` : ""), e.tur, e.yer, e.konuklar.join(", ")].filter(Boolean).join("; ");
    return `- [${e.baslik}](${tam(e.sayfa)}): ${parcalar}.${e.ozet ? ` ${e.ozet}` : ""}`;
  };
  const yaklasan = tumu.filter((e) => e.bitis.getTime() >= simdi).reverse();
  const gecmis = tumu.filter((e) => e.bitis.getTime() < simdi);
  const sayfalar = (Object.keys(YOLLAR) as Sayfa[]).map((s) => `- [${tr.menu[s]}](${tam(YOLLAR[s].tr)}): ${tr.aciklamalar[s]}`);
  const sayfalarEn = (Object.keys(YOLLAR) as Sayfa[]).map((s) => `- [${en.menu[s]}](${tam(YOLLAR[s].en)}): ${en.aciklamalar[s]}`);

  const metin = [
    `# ${tr.kulup}`,
    "",
    `> ${tr.aciklamalar.anasayfa}`,
    "",
    tr.hakkimizdaMetin,
    "",
    `- Diğer adları: Işık DSAI, ${en.kulup}`,
    "- Üniversite: Işık Üniversitesi (Şile Kampüsü, İstanbul, Türkiye)",
    `- Dönem: ${A.donem}`,
    `- Kimler katılabilir: ${tr.kimlerMetin}`,
    A.eposta ? `- E-posta: ${A.eposta}` : "",
    A.instagram ? `- Instagram: ${A.instagram}` : "",
    A.linkedin ? `- LinkedIn: ${A.linkedin}` : "",
    A.uyeFormu ? `- Üyelik formu: ${A.uyeFormu}` : "",
    "",
    "## Sayfalar",
    "",
    ...sayfalar,
    "",
    ...(yaklasan.length ? ["## Yaklaşan etkinlikler", "", ...yaklasan.map(satir), ""] : []),
    "## Geçmiş etkinlikler",
    "",
    ...gecmis.map(satir),
    "",
    "## English",
    "",
    `> ${en.aciklamalar.anasayfa}`,
    "",
    en.hakkimizdaMetin,
    "",
    ...sayfalarEn,
    ...tumu.map((e) => `- [${ing.get(e.id)!.baslik}](${tam(ing.get(e.id)!.sayfa)}): ${ing.get(e.id)!.gun}`),
    "",
  ]
    .filter((s, i, d) => !(s === "" && d[i - 1] === ""))
    .join("\n");
  return new Response(metin, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
