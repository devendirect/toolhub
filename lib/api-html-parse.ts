import * as cheerio from "cheerio";

export function extractMeta($: cheerio.CheerioAPI, name: string): string {
  return (
    $(`meta[name="${name}"]`).attr("content") ??
    $(`meta[property="${name}"]`).attr("content") ??
    ""
  );
}
