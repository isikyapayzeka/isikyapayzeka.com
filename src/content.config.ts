import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

// YAML'da tırnaksız yazılan tarih Date olarak gelir; her durumda "YYYY-MM-DD" metnine çevrilir.
const gun = z
  .union([z.string(), z.date()])
  .transform((v) => (typeof v === "string" ? v : v.toISOString().slice(0, 10)))
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Tarih YYYY-AA-GG biçiminde olmalı");
const saat = z.string().regex(/^\d{1,2}:\d{2}$/, "Saat SS:DD biçiminde olmalı");

const etkinlikler = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/etkinlikler" }),
  schema: z.object({
    baslik: z.string(),
    baslikEn: z.string().default(""),
    tarih: gun,
    saat: saat.default("00:00"),
    bitis: saat.optional(),
    yer: z.string().default(""),
    yerEn: z.string().default(""),
    tur: z.enum(["atolye", "soylesi", "yayin", "sosyal", "yarisma", "diger"]).default("diger"),
    konuklar: z.array(z.string()).default([]),
    ortaklar: z.array(z.string()).default([]),
    ozet: z.string().default(""),
    ozetEn: z.string().default(""),
    kayitLinki: z.string().default(""),
    link: z.string().default(""),
    // public/etkinlikler/ içindeki görselin adı. Fotoğrafsa "<ad>-800.jpg" ve "<ad>-1600.jpg"
    // dosyaları beklenir; afis: true ise tek dosya "<ad>.jpg" kullanılır ve kırpılmadan gösterilir.
    gorsel: z.string().default(""),
    gorselAlt: z.string().default(""),
    gorselAltEn: z.string().default(""),
    afis: z.boolean().default(false),
  }),
});

const ekip = defineCollection({
  loader: file("src/data/ekip.yml"),
  schema: z.object({
    ad: z.string(),
    rol: z.string(),
    rolEn: z.string().default(""),
    bolum: z.string().default(""),
    bolumEn: z.string().default(""),
    linkedin: z.string().default(""),
    foto: z.string().default(""),
  }),
});

const ortaklar = defineCollection({
  loader: file("src/data/ortaklar.yml"),
  schema: z.object({
    ad: z.string(),
    adEn: z.string().default(""),
    tur: z.enum(["kulup", "kurum", "sponsor"]),
    link: z.string().default(""),
  }),
});

const ayarlar = defineCollection({
  loader: file("src/data/ayarlar.yml"),
  schema: z.object({
    donem: z.string(),
    vizyon: z.string(),
    vizyonEn: z.string(),
    uyeFormu: z.string().default(""),
    ekipBasvuru: z.string().default(""),
    whatsapp: z.string().default(""),
    instagram: z.string().default(""),
    linkedin: z.string().default(""),
    eposta: z.string().default(""),
    konum: z.string().default(""),
    // Ana sayfanın üstündeki fotoğraf (public/etkinlikler/<kapak>-800.jpg ve -1600.jpg).
    kapak: z.string().default(""),
    kapakAlt: z.string().default(""),
    kapakAltEn: z.string().default(""),
  }),
});

export const collections = { etkinlikler, ekip, ortaklar, ayarlar };
