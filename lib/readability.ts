export interface ReadResult {
  flesch:     number;
  fog:        number;
  asl:        number;
  asw:        number;
  complexPct: number;
  wordCount:  number;
  sentCount:  number;
}

export function syllablesEn(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  const adj = w.length > 4 && w.endsWith("e") ? w.slice(0, -1) : w;
  return Math.max(1, (adj.match(/[aeiouy]+/g) ?? []).length);
}

export function syllablesFr(word: string): number {
  const w = word.toLowerCase().replace(/[^a-zàâæéèêëîïôœùûü]/g, "");
  if (!w) return 0;
  return Math.max(1, (w.match(/[aeiouyàâæéèêëîïôœùûü]+/g) ?? []).length);
}

export function analyze(text: string, lang: "fr" | "en"): ReadResult | null {
  const sentences = text.split(/[.!?…]+/).map((s) => s.trim()).filter((s) => s.length > 1);
  const words     = text.split(/\s+/).filter((w) => w.replace(/[^a-zA-ZÀ-ÿ]/g, "").length > 0);
  if (words.length < 5) return null;

  const countSyl     = lang === "fr" ? syllablesFr : syllablesEn;
  const sylCounts    = words.map((w) => countSyl(w));
  const totalSyl     = sylCounts.reduce((s, n) => s + n, 0);
  const complexCount = sylCounts.filter((n) => n >= 3).length;

  const asl    = words.length / Math.max(1, sentences.length);
  const asw    = totalSyl / words.length;
  const flesch = lang === "fr"
    ? 207 - 1.015 * asl - 73.6 * asw
    : 206.835 - 1.015 * asl - 84.6 * asw;
  const fog = 0.4 * (asl + 100 * complexCount / words.length);

  return {
    flesch:     Math.max(0, Math.min(100, Math.round(flesch))),
    fog:        Math.round(fog * 10) / 10,
    asl:        Math.round(asl * 10) / 10,
    asw:        Math.round(asw * 10) / 10,
    complexPct: Math.round(100 * complexCount / words.length),
    wordCount:  words.length,
    sentCount:  sentences.length,
  };
}

export function fleschLevel(score: number, levels: readonly string[]): string {
  if (score >= 80) return levels[4] ?? "";
  if (score >= 60) return levels[3] ?? "";
  if (score >= 40) return levels[2] ?? "";
  if (score >= 20) return levels[1] ?? "";
  return levels[0] ?? "";
}
