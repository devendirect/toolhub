// Encodage / décodage d'entités HTML, sans dépendance au DOM.
//
// L'implémentation précédente passait par un <textarea> détaché
// (`el.textContent = s; return el.innerHTML`). Deux problèmes :
//   1. elle imposait un rendu client-only à toute la page outil ;
//   2. elle n'échappait en réalité que &, < et > — ni les guillemets, ni les
//      caractères accentués, contrairement à ce que la fiche de l'outil annonce.
//
// Couverture : les entités nommées HTML 4 (Latin-1, ponctuation, symboles
// courants, alphabet grec). HTML 5 en définit environ deux mille de plus, souvent
// des alias ; celles-là ne sont pas nommées ici, mais les références numériques
// (&#233; / &#xE9;) sont décodées dans tous les cas.

/** Noms d'entités des points de code 160 à 255, dans l'ordre. */
const LATIN1 =
  "nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr " +
  "deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest " +
  "Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml " +
  "Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times " +
  "Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig " +
  "agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml " +
  "igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide " +
  "oslash ugrave uacute ucirc uuml yacute thorn yuml";

/** Entités hors plage Latin-1, nom → point de code. */
const OTHER: Record<string, number> = {
  quot: 34, amp: 38, apos: 39, lt: 60, gt: 62,
  OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376, fnof: 402,
  circ: 710, tilde: 732,
  Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918,
  Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924, Nu: 925,
  Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932, Upsilon: 933,
  Phi: 934, Chi: 935, Psi: 936, Omega: 937,
  alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950,
  eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956, nu: 957,
  xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962, sigma: 963, tau: 964,
  upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969,
  ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207,
  ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218,
  ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225,
  bull: 8226, hellip: 8230, permil: 8240, prime: 8242, Prime: 8243,
  lsaquo: 8249, rsaquo: 8250, oline: 8254, frasl: 8260, euro: 8364,
  trade: 8482, larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596,
  minus: 8722, lowast: 8727, radic: 8730, infin: 8734, ne: 8800, le: 8804, ge: 8805,
};

/** nom → caractère */
const BY_NAME = new Map<string, string>();
/** caractère → nom (le premier nom déclaré gagne) */
const BY_CHAR = new Map<string, string>();

for (const [i, name] of LATIN1.split(" ").entries()) {
  const char = String.fromCodePoint(160 + i);
  BY_NAME.set(name, char);
  BY_CHAR.set(char, name);
}
for (const [name, code] of Object.entries(OTHER)) {
  const char = String.fromCodePoint(code);
  BY_NAME.set(name, char);
  if (!BY_CHAR.has(char)) BY_CHAR.set(char, name);
}

/** Caractères toujours échappés, même quand ils sont ASCII. */
const ALWAYS = new Set(["&", "<", ">", '"', "'"]);

/**
 * Échappe un texte en entités HTML.
 *
 * `& < > " '` sont toujours convertis — ce sont eux qui permettent de sortir d'un
 * attribut ou d'ouvrir une balise. Au-delà de l'ASCII imprimable, on utilise
 * l'entité nommée quand elle existe (`é` → `&eacute;`), sinon la référence
 * numérique décimale.
 */
export function encodeEntities(str: string): string {
  let out = "";
  // Itération par point de code : `for…of` ne coupe pas les paires de
  // substitution, donc un emoji reste un seul caractère.
  for (const char of str) {
    const code = char.codePointAt(0)!;
    if (ALWAYS.has(char) || code > 126) {
      const name = BY_CHAR.get(char);
      out += name ? `&${name};` : `&#${code};`;
    } else {
      out += char;
    }
  }
  return out;
}

const REF = /&(#[Xx][0-9A-Fa-f]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);/g;

/**
 * Décode les entités HTML d'une chaîne.
 *
 * Une référence inconnue est laissée telle quelle plutôt que supprimée : mieux
 * vaut rendre `&unknown;` visible que de le faire disparaître silencieusement.
 */
export function decodeEntities(str: string): string {
  return str.replace(REF, (whole, ref: string) => {
    if (ref[0] === "#") {
      const hex = ref[1] === "x" || ref[1] === "X";
      const code = parseInt(hex ? ref.slice(2) : ref.slice(1), hex ? 16 : 10);
      // Les points de code hors plage Unicode, ainsi que les substituts isolés,
      // ne sont pas représentables : on préfère laisser la référence brute.
      if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return whole;
      if (code >= 0xd800 && code <= 0xdfff) return whole;
      return String.fromCodePoint(code);
    }
    return BY_NAME.get(ref) ?? whole;
  });
}
