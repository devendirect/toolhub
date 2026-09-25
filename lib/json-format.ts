/**
 * Lecture et mise en forme de JSON sans les défauts de JSON.parse seul :
 *
 * - la position d'une erreur : les navigateurs ne la donnent pas tous (Safari
 *   jamais, Chrome pas pour « [1,2,] »). Un petit analyseur la calcule ici,
 *   avec la cause probable (virgule finale, apostrophes, commentaire…) ;
 * - les grands entiers : JSON.parse arrondit tout entier au-delà de 2^53, ce
 *   qui changeait les identifiants d'API (1234567890123456789 →
 *   1234567890123456800). Ils sont conservés au chiffre près ;
 * - les clés en double : JSON.parse garde la dernière sans prévenir.
 */

export type JsonHint =
  | "trailingComma" | "singleQuote" | "comment" | "unquotedKey" | "expectedColon"
  | "expectedComma" | "unterminatedString" | "controlChar" | "badEscape" | "badNumber"
  | "notJson" | "unexpectedEnd" | "trailingContent" | "unexpected";

export interface JsonError { pos: number; line: number; col: number; hint: JsonHint }
interface BigInt_ { start: number; end: number }

export interface Inspection {
  error: JsonError | null;
  bigInts: BigInt_[];
  duplicateKeys: string[];
}

const NUM_RE = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

export function inspectJson(src: string): Inspection {
  let i = 0;
  const bigInts: BigInt_[] = [];
  const duplicateKeys: string[] = [];
  const fail = (hint: JsonHint, at = i): never => { throw { at, hint }; };

  const ws = () => {
    while (i < src.length) {
      const c = src[i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r") i++;
      else if (c === "/" && (src[i + 1] === "/" || src[i + 1] === "*")) fail("comment");
      else break;
    }
  };

  // Renvoie le texte brut entre guillemets (échappements compris) : suffit pour
  // repérer les clés en double, et évite de reconstruire chaque chaîne
  const str = (): string => {
    const start = ++i;
    while (true) {
      const c = src.charCodeAt(i);
      if (Number.isNaN(c)) fail("unterminatedString", start - 1);
      if (c === 34) { i++; return src.slice(start, i - 1); }       // "
      if (c === 92) {                                               // \
        const e = src[i + 1];
        if (e === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(src.slice(i + 2, i + 6))) fail("badEscape");
          i += 6; continue;
        }
        if (!e || !'"\\/bfnrt'.includes(e)) fail("badEscape");
        i += 2; continue;
      }
      if (c < 32) fail("controlChar");
      i++;
    }
  };

  const num = () => {
    NUM_RE.lastIndex = i;
    const m = NUM_RE.exec(src);
    if (!m) fail("badNumber");
    const tok = m![0];
    if (!/[.eE]/.test(tok) && !Number.isSafeInteger(Number(tok))) bigInts.push({ start: i, end: i + tok.length });
    i += tok.length;
  };

  const value = (path: string): void => {
    ws();
    const c = src[i];
    if (c === "{") return obj(path);
    if (c === "[") return arr(path);
    if (c === '"') { str(); return; }
    if (c === "-" || (c !== undefined && c >= "0" && c <= "9")) return num();
    for (const lit of ["true", "false", "null"]) if (src.startsWith(lit, i)) { i += lit.length; return; }
    if (c === "'") fail("singleQuote");
    if (c === undefined) fail("unexpectedEnd");
    if (/^(undefined|NaN|Infinity|-Infinity)/.test(src.slice(i))) fail("notJson");
    fail("unexpected");
  };

  const obj = (path: string) => {
    i++; ws();
    if (src[i] === "}") { i++; return; }
    const keys = new Set<string>();
    while (true) {
      ws();
      const c = src[i];
      if (c === "'") fail("singleQuote");
      if (c === "}") fail("trailingComma");
      if (c === undefined) fail("unexpectedEnd");
      if (c !== '"') fail(/[A-Za-z_$]/.test(c!) ? "unquotedKey" : "unexpected");
      const key = str();
      const keyPath = path ? `${path}.${key}` : key;
      if (keys.has(key)) duplicateKeys.push(keyPath);
      keys.add(key);
      ws();
      if (src[i] !== ":") fail(src[i] === undefined ? "unexpectedEnd" : "expectedColon");
      i++;
      value(keyPath);
      ws();
      if (src[i] === ",") { i++; continue; }
      if (src[i] === "}") { i++; return; }
      fail(src[i] === undefined ? "unexpectedEnd" : "expectedComma");
    }
  };

  const arr = (path: string) => {
    i++; ws();
    if (src[i] === "]") { i++; return; }
    let n = 0;
    while (true) {
      ws();
      if (src[i] === "]") fail("trailingComma");
      value(`${path}[${n++}]`);
      ws();
      if (src[i] === ",") { i++; continue; }
      if (src[i] === "]") { i++; return; }
      fail(src[i] === undefined ? "unexpectedEnd" : "expectedComma");
    }
  };

  try {
    value("");
    ws();
    if (i < src.length) fail("trailingContent");
    return { error: null, bigInts, duplicateKeys };
  } catch (e) {
    // Imbrication extrême : l'analyse récursive dépasse la pile. On renonce aux
    // contrôles fins (formatJson retombe sur JSON.parse seul) plutôt que de planter.
    if (e instanceof RangeError) return { error: null, bigInts: [], duplicateKeys: [] };
    if (!e || typeof e !== "object" || !("hint" in e)) throw e;
    const { at, hint } = e as { at: number; hint: JsonHint };
    const before = src.slice(0, at);
    const line = before.split("\n").length;
    const col = at - before.lastIndexOf("\n");
    return { error: { pos: at, line, col, hint }, bigInts: [], duplicateKeys: [] };
  }
}

function sortDeep(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v !== null && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, val]) => [k, sortDeep(val)])
    );
  }
  return v;
}

export interface FormatOptions { indent: number | "tab"; sortKeys: boolean; minify: boolean }

export type FormatResult =
  | { ok: true; output: string; parsed: unknown; bigIntCount: number; duplicateKeys: string[] }
  | { ok: false; error: JsonError };

// Caractère d'usage privé : ne peut pas se trouver par hasard dans une vraie donnée
const MARK = "\uE000";

export function formatJson(src: string, opts: FormatOptions): FormatResult {
  const ins = inspectJson(src);
  if (ins.error) return { ok: false, error: ins.error };

  // Grands entiers : remplacés par des chaînes repères avant JSON.parse, puis restitués tels quels
  const raws: string[] = [];
  const parts: string[] = [];
  let last = 0;
  ins.bigInts.forEach(({ start, end }, k) => {
    raws.push(src.slice(start, end));
    parts.push(src.slice(last, start), `"${MARK}${k}${MARK}"`);
    last = end;
  });
  parts.push(src.slice(last));
  const prepared = raws.length ? parts.join("") : src;

  let parsed: unknown;
  try {
    parsed = JSON.parse(prepared);
  } catch {
    return { ok: false, error: { pos: 0, line: 1, col: 1, hint: "unexpected" } };
  }
  const val = opts.sortKeys ? sortDeep(parsed) : parsed;
  let output = opts.minify ? JSON.stringify(val) : JSON.stringify(val, null, opts.indent === "tab" ? "\t" : opts.indent);
  if (raws.length) output = output.replace(new RegExp(`"${MARK}(\\d+)${MARK}"`, "g"), (_, k: string) => raws[Number(k)]!);

  return { ok: true, output, parsed, bigIntCount: raws.length, duplicateKeys: ins.duplicateKeys };
}
