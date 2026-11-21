// Sayfaların gerçek son değişiklik tarihi: içerik dosyalarının git'teki son commit zamanı.
// Site haritasındaki <lastmod>, yapısal verideki dateModified ve alt bilgideki tarih buradan gelir;
// böylece arama motorları ve yapay zekâ asistanları üçünde de aynı tarihi görür.
import { execFileSync } from "node:child_process";
import type { Sayfa } from "./i18n";

const git = (...arg: string[]) =>
  execFileSync("git", arg, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

// Git geçmişi yoksa ya da kırpılmışsa (shallow) tarih bilinemez; yanlış tarih yazmak yerine boş döner.
let gecmisVar: boolean | undefined;
const onbellek = new Map<string, string>();

// ISO 8601 ("2026-11-20T21:43:25+03:00") ya da boş metin.
function sonDegisiklik(yollar: string[]) {
  const anahtar = yollar.join("\n");
  if (!onbellek.has(anahtar)) {
    let tarih = "";
    try {
      gecmisVar ??= git("rev-parse", "--is-shallow-repository") === "false";
      if (gecmisVar) tarih = git("log", "-1", "--format=%cI", "--", ...yollar);
    } catch {
      gecmisVar = false;
    }
    onbellek.set(anahtar, tarih);
  }
  return onbellek.get(anahtar)!;
}

// Dört ana sayfa etkinlik verisini, ayarları ve çevirileri ortak kullanır.
const ORTAK = ["src/content/etkinlikler", "src/data", "src/i18n.ts"];
const GORUNUM: Record<Sayfa, string> = {
  anasayfa: "src/views/AnaSayfa.astro",
  etkinlikler: "src/views/Etkinlikler.astro",
  hakkimizda: "src/views/Hakkimizda.astro",
  sirketler: "src/views/Sirketler.astro",
};

export const sayfaTarihi = (s: Sayfa) => sonDegisiklik([GORUNUM[s], ...ORTAK]);
export const etkinlikTarihi = (id: string) => sonDegisiklik([`src/content/etkinlikler/${id}.md`]);
