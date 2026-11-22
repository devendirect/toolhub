import type { Lang } from "./types";
import type { SeasonId } from "./season";

/**
 * Contenu décoratif de chaque saison (textes FR/EN, ASCII, particules).
 * Les couleurs de palette sont dans app/seasons.css ; celles écrites ici ne
 * servent qu'aux dessins ASCII et aux particules.
 */
export interface SeasonDecor {
  banner: Record<Lang, string>;
  prompt: Record<Lang, string>;
  /** Lignes « [ok] … » affichées sous le prompt, au-dessus du titre de l'accueil. */
  logs: Record<Lang, string[]>;
  /** Dessin ASCII (grand écran). "year" = année à venir en gros chiffres (Nouvel An). */
  art?: string[] | "year";
  artColors?: Record<string, string>;
  artFallback?: string;
  particles?: { chars: string[]; colors: string[]; up: boolean; n: number; size: [number, number] };
  /** Petit symbole posé sur le coin du logo (le bonnet de Noël est un SVG à part). */
  sym?: string;
}

export const DECOR: Record<SeasonId, SeasonDecor> = {
  xmas: {
    banner: {
      fr: "Joyeuses fêtes ! Tous les outils restent gratuits et sans inscription.",
      en: "Happy holidays! Every tool stays free, with no sign-up.",
    },
    prompt: { fr: "$ noel --on", en: "$ noel --on" },
    logs: {
      fr: ["[ok] sapin chargé", "[ok] neige activée", "[ok] outils toujours gratuits"],
      en: ["[ok] tree loaded", "[ok] snow enabled", "[ok] tools still free"],
    },
    art: [
      "        *",
      "       /^\\",
      "      /^o^\\",
      "     /^^^o^\\",
      "    /^o^^^o^\\",
      "   /^^^o^^^^o\\",
      "  /^o^^^^^o^^^\\",
      " /^^^^o^^^^^^o^\\",
      "       |||",
    ],
    artColors: { "*": "#ffd166", o: "#ff4d5e", "^": "#3ddc84", "|": "#8a5a3c" },
    artFallback: "#1f8f55",
    particles: { chars: ["•", "·", "❄"], colors: ["#ffffff"], up: false, n: 26, size: [8, 14] },
  },

  newyear: {
    // {year} est remplacé à l'affichage (année à venir en décembre, année en cours en janvier)
    banner: {
      fr: "Bonne année {year} ! Tous les outils restent gratuits.",
      en: "Happy {year}! Every tool stays free.",
    },
    prompt: { fr: "$ ./countdown --to {year}", en: "$ ./countdown --to {year}" },
    logs: { fr: [], en: [] }, // calculés à l'affichage (compte à rebours en décembre)
    art: "year",
    particles: {
      chars: ["■", "▲", "●", "◆"],
      colors: ["#ff4d5e", "#ffd166", "#3ddc84", "#4dabff", "#c084fc"],
      up: false, n: 30, size: [8, 13],
    },
  },

  valentine: {
    banner: {
      fr: "Joyeuse Saint-Valentin ! Le site vous aime aussi, et les outils restent gratuits.",
      en: "Happy Valentine's Day! The site loves you too, and every tool stays free.",
    },
    prompt: { fr: "$ git commit -m \"je t'aime\"", en: "$ git commit -m \"love you\"" },
    logs: {
      fr: ["[ok] 1 file changed, 1 heart inserted(+)", "[ok] push vers origin/love"],
      en: ["[ok] 1 file changed, 1 heart inserted(+)", "[ok] pushed to origin/love"],
    },
    art: [
      " ,d88b.d88b,",
      " 88888888888",
      " 'Y8888888Y'",
      "   'Y888Y'",
      "     'Y'",
    ],
    artFallback: "#ff4d6d",
    particles: { chars: ["♥", "·"], colors: ["#ff4d6d", "#ff8fa3"], up: true, n: 12, size: [10, 18] },
    sym: "♥",
  },

  easter: {
    banner: {
      fr: "Joyeuses Pâques ! Tous les outils restent gratuits et sans inscription.",
      en: "Happy Easter! Every tool stays free, with no sign-up.",
    },
    prompt: { fr: "$ egg --paint", en: "$ egg --paint" },
    logs: {
      fr: ["[ok] œufs peints", "[ok] panier rempli"],
      en: ["[ok] eggs painted", "[ok] basket filled"],
    },
    art: [
      "    ___",
      "   /   \\",
      "  / ~ ~ \\",
      " | ~~~~~ |",
      " | ::::: |",
      "  \\ ~~~ /",
      "   '---'",
    ],
    artFallback: "#ffd166",
    particles: { chars: ["●"], colors: ["#ffc8dd", "#bde0fe", "#c7f9cc", "#fff3b0"], up: false, n: 12, size: [8, 12] },
  },

  halloween: {
    banner: {
      fr: "Joyeux Halloween ! Aucun outil n'est hanté (promis).",
      en: "Happy Halloween! No tool is haunted (promise).",
    },
    prompt: { fr: "$ sudo boo", en: "$ sudo boo" },
    logs: {
      fr: ["[ok] citrouille allumée", "[ok] fantôme en liberté"],
      en: ["[ok] pumpkin lit", "[ok] ghost on the loose"],
    },
    art: [
      "  .-\"\"\"-.",
      " / o   o \\",
      " |   ^   |",
      " |  ___  |",
      " |_/\\_/\\_|",
    ],
    artFallback: "#e6e3f5",
    particles: { chars: ["•", "·"], colors: ["#ff8a1f", "#ffb454", "#ff5c1f"], up: true, n: 24, size: [10, 18] },
    sym: "🎃",
  },

  summer: {
    banner: {
      fr: "Bel été ! Les outils restent gratuits, même en vacances.",
      en: "Enjoy the summer! Every tool stays free, even on holiday.",
    },
    prompt: { fr: "$ vacances --on", en: "$ holiday --on" },
    logs: {
      fr: ["[ok] soleil chargé", "[ok] mode vacances"],
      en: ["[ok] sun loaded", "[ok] holiday mode"],
    },
    art: [
      "   \\  |  /",
      "    .-'-.",
      "-- (     ) --",
      "    '-.-'",
      "   /  |  \\",
    ],
    artFallback: "#ffb454",
    sym: "☀",
  },

  back: {
    banner: {
      fr: "Bonne rentrée ! Les outils sont toujours là, gratuits.",
      en: "Back to school! The tools are still here, and still free.",
    },
    prompt: { fr: "$ ls ~/rentree/", en: "$ ls ~/back-to-school/" },
    logs: {
      fr: ["[ok] feuilles chargées", "[ok] cartable prêt"],
      en: ["[ok] leaves loaded", "[ok] bag packed"],
    },
    particles: { chars: ["🍂", "🍁"], colors: ["#e8803a"], up: false, n: 12, size: [16, 24] },
  },
};
