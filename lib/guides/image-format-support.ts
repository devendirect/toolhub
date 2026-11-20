import type { Guide } from "../guides";

/**
 * Page de référence : prise en charge des formats d'image par navigateur.
 * Données relevées le 2026-11-20 (voir `claims` et `sources`). Les colonnes Android et
 * les systèmes d'exploitation ne sont pas couverts : pas de source relue pour eux.
 * À revoir à chaque sortie de Chrome, Firefox ou Safari qui touche un de ces formats.
 */
export const GUIDE_IMAGE_FORMAT_SUPPORT: Guide = {
  slug: "image-format-support",
  published: "2026-11-20",
  updated: "2026-11-20",
  tools: ["image-converter", "image-compressor", "compress-to-kb"],
  verified: "2026-11-20",
  sources: [
    { id: "mdn-image-types", title: "Image file type and format guide", publisher: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types", official: true },
    { id: "chrome-155", title: "Chrome 155 release notes", publisher: "Chrome Platform Status", url: "https://chromestatus.com/release-notes/155", official: true },
    { id: "firefox-158", title: "Firefox 158 release notes for developers", publisher: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/158", official: true },
    { id: "webkit-17", title: "WebKit Features in Safari 17.0", publisher: "WebKit", url: "https://webkit.org/blog/14445/webkit-features-in-safari-17-0/", official: true },
    { id: "caniuse-webp", title: "WebP image format", publisher: "Can I use", url: "https://caniuse.com/webp", official: false },
    { id: "caniuse-avif", title: "AVIF image format", publisher: "Can I use", url: "https://caniuse.com/avif", official: false },
    { id: "caniuse-jxl", title: "JPEG XL image format", publisher: "Can I use", url: "https://caniuse.com/jpegxl", official: false },
    { id: "caniuse-heif", title: "HEIF/HEIC image format", publisher: "Can I use", url: "https://caniuse.com/heif", official: false },
  ],
  claims: [
    { text: { fr: "WebP : Chrome 32, Edge 18, Firefox 65, Safari 16 sur macOS et 14 sur iOS", en: "WebP: Chrome 32, Edge 18, Firefox 65, Safari 16 on macOS and 14 on iOS" }, source: "caniuse-webp" },
    { text: { fr: "AVIF : Chrome 85, Edge 121, Firefox 93, Safari 16.4 (prise en charge partielle dès la 16.1 sur macOS)", en: "AVIF: Chrome 85, Edge 121, Firefox 93, Safari 16.4 (partial support from 16.1 on macOS)" }, source: "caniuse-avif", recheck: { fr: "si Safari 16.0 à 16.3 compte comme complet sur iOS", en: "if Safari 16.0 to 16.3 counts as full support on iOS" } },
    { text: { fr: "AVIF : Firefox lit les AVIF animés depuis la version 113, et le format n'a pas de rendu progressif", en: "AVIF: Firefox reads animated AVIF since version 113, and the format has no progressive rendering" }, source: "mdn-image-types" },
    { text: { fr: "JPEG XL : Chrome 155 le décode, Firefox 158 l'active par défaut", en: "JPEG XL: Chrome 155 decodes it, Firefox 158 enables it by default" }, source: "firefox-158" },
    { text: { fr: "JPEG XL : Chrome 155 est la première version stable qui le décode par défaut, pas Edge ni Samsung Internet à ce jour", en: "JPEG XL: Chrome 155 is the first stable version that decodes it by default, not Edge or Samsung Internet so far" }, source: "caniuse-jxl", recheck: { fr: "à chaque version d'Edge", en: "with each Edge release" } },
    { text: { fr: "JPEG XL : Safari 17.0 le lit, sans téléchargement progressif (l'image s'affiche une fois le fichier complet)", en: "JPEG XL: Safari 17.0 reads it, without progressive download (the image shows once the file is complete)" }, source: "mdn-image-types" },
    { text: { fr: "HEIC : seul Safari 17.0 et suivants (macOS et iOS) le lit, aucun autre navigateur n'a de version prise en charge", en: "HEIC: only Safari 17.0 and later (macOS and iOS) reads it, no other browser has a supported version" }, source: "caniuse-heif" },
    { text: { fr: "Nos outils images relisent un .jxl dans Chrome 155 et le convertissent en JPG, PNG ou WebP ; Chrome 154 ne le lit pas", en: "Our image tools read a .jxl in Chrome 155 and convert it to JPG, PNG or WebP; Chrome 154 can't read it" }, source: "test" },
  ],
  en: {
    title: "Image formats by browser: WebP, AVIF, JPEG XL, HEIC",
    description: "Which browsers read WebP, AVIF, JPEG XL and HEIC, from which version, with sources and a check date. A reference table to keep and compare.",
    lead: "WebP and AVIF are read by every current browser. JPEG XL is read by Chrome from version 155, Firefox from 158 and Safari from 17, with Edge still missing. HEIC is only read by Safari. This page lists the first version of each browser that reads each format, with the sources behind every row and the date we last checked.",
    sections: [
      {
        h: "The table: first browser version that reads each format",
        blocks: [
          { p: "Each cell is the first version of the browser that reads the format with no setting to turn on. Safari is shown for macOS and iOS together unless stated. Last check: 20 November 2026." },
          { table: {
            head: ["Format", "Chrome", "Edge", "Firefox", "Safari"],
            rows: [
              ["WebP", "32", "18", "65", "16 (macOS), 14 (iOS)[^caniuse-webp]"],
              ["AVIF", "85", "121", "93", "16.4 (partial from 16.1 on macOS)[^caniuse-avif]"],
              ["JPEG XL", "155[^chrome-155]", "not yet[^caniuse-jxl]", "158[^firefox-158]", "17 (partial)[^webkit-17]"],
              ["HEIC", "no", "no", "no", "17[^caniuse-heif]"],
            ],
          } },
          { p: "\"No\" means the sources list no version that reads the format, not that it can never be added. \"Partial\" means the browser reads the files but not every feature, as detailed below." },
        ],
      },
      {
        h: "WebP and AVIF: safe for current devices",
        blocks: [
          { p: "WebP has been readable in every major browser for years. The versions in the table are old enough that any device updated in the last few years reads it, so WebP is the format to serve when you can only keep one. Safari is the late one: macOS Safari reads it from version 16, and iPhones from iOS 14.[^caniuse-webp]" },
          { p: "AVIF arrived in Chrome 85, Firefox 93 and Edge 121. Safari is where the details sit: support is partial from version 16.1 on macOS and complete from 16.4.[^caniuse-avif] Two limits are worth knowing. Firefox reads animated AVIF only since version 113, and the format has no progressive rendering, so a large AVIF appears all at once instead of sharpening as it loads.[^mdn-image-types]" },
          { p: "In practice, both formats go in a `<picture>` element with a JPEG fallback for devices that stopped receiving updates. The [format guide](/guides/webp-avif-jpeg) shows the markup and explains when each one wins." },
        ],
      },
      {
        h: "JPEG XL: three browsers, one still missing",
        blocks: [
          { p: "Chrome 155 is the first stable Chrome that decodes JPEG XL by default.[^chrome-155] Firefox 158, released on 13 October 2026, enables it by default.[^firefox-158] Safari has read it since version 17.0, in September 2023, but without progressive download: the image appears once the whole file has arrived.[^webkit-17][^mdn-image-types]" },
          { p: "Edge is the gap. Can I use lists no Edge version that reads JPEG XL, even though Edge is built on Chromium, and the same is true of Samsung Internet.[^caniuse-jxl] That can change with any release, and we flag the row for a recheck. Until it does, JPEG XL needs a fallback in a `<picture>` element, like AVIF." },
          { support: { query: "image/jxl", rows: [
            { label: "chrome 155+", state: "yes", note: "by default · Oct 2026" },
            { label: "firefox 158+", state: "yes", note: "by default · Oct 2026" },
            { label: "safari 17+", state: "partial", note: "no progressive download · Sept 2023" },
            { label: "edge", state: "no", note: "no version listed yet" },
          ] } },
          { p: "If you receive a .jxl file and need something every app opens, [JXL to JPG](/convert/jxl-to-jpg) converts it in the tab. In a browser that can't read JPEG XL, our tools say so instead of producing an empty image: we checked that Chrome 155 reads the file and Chrome 154 doesn't." },
        ],
      },
      {
        h: "HEIC: an Apple format, read by Safari only",
        blocks: [
          { p: "HEIC is the default photo format of iPhones. Among browsers, Safari 17.0 and later is the only one that reads it, on macOS and iOS.[^webkit-17][^caniuse-heif] Chrome, Edge and Firefox list no version that does, and Can I use puts it down to the cost and complexity of licensing the format." },
          { p: "That is why a HEIC photo uploaded from a phone often fails on a website that works with JPEG, and why converting is the usual answer. Our [HEIC to JPG](/convert/heic-to-jpg) page brings its own decoder and converts in the tab, or [HEIC to WebP](/convert/heic-to-webp) if the photos are meant for a web page. Nothing is uploaded either way." },
        ],
      },
      {
        h: "What changed recently",
        blocks: [
          { p: "The dated changes that affect this table, newest first:" },
          { ul: [
            "13 October 2026: Firefox 158 enables JPEG XL by default.[^firefox-158]",
            "6 October 2026: Chrome 155 decodes JPEG XL by default.[^chrome-155]",
            "September 2023: Safari 17.0 adds JPEG XL and HEIC.[^webkit-17]",
          ] },
          { p: "Older steps, such as Edge 121 for AVIF, are in the table without a date because we did not check a release date for them. When a browser release changes a row, this page is updated and the check date at the top moves with it." },
        ],
      },
      {
        h: "What this page does not cover",
        blocks: [
          { p: "Three limits, so the table is not read as more than it is. Android browsers are left out: the sources we read list only a single entry for them, which is not enough to state a first version. Operating systems are left out too. Whether Windows or Android can open a HEIC or JPEG XL file outside the browser depends on codecs we did not verify, so we make no claim about it. And a browser version tells you what it can read, not what share of your visitors use it: check your own analytics before dropping a fallback." },
          { p: "The sources are listed at the bottom. Official ones (release notes, MDN, WebKit) back the dates. Can I use, a community-maintained table, backs the version numbers where no release note states them, and is marked as a secondary source." },
        ],
      },
    ],
    faq: [
      { q: "Which image format works in every browser?", a: "JPEG and PNG work everywhere. Among modern formats, WebP is read by every current browser: Chrome 32, Edge 18, Firefox 65 and Safari 16 (14 on iOS) or later. It is the safest choice when you can only serve one." },
      { q: "Does Safari support AVIF?", a: "Yes. Safari reads AVIF fully from version 16.4, with partial support from 16.1 on macOS. Firefox reads animated AVIF since version 113." },
      { q: "Which browsers support JPEG XL?", a: "Chrome from version 155, Firefox from 158 and Safari from 17, where Safari has no progressive download. Edge and Samsung Internet list no supporting version yet, so serve JPEG XL with a fallback." },
      { q: "Can Chrome or Firefox open HEIC photos?", a: "No. Among browsers, only Safari 17 and later reads HEIC. To use an iPhone photo on a website or in another browser, convert it to JPG or WebP first." },
      { q: "How often is this table updated?", a: "Whenever a browser release changes a row, and the check date at the top of the page shows the last verification. The version numbers come from official release notes where they exist and from Can I use otherwise." },
    ],
  },
  fr: {
    title: "Formats d'image par navigateur : WebP, AVIF, JPEG XL, HEIC",
    description: "Quels navigateurs lisent WebP, AVIF, JPEG XL et HEIC, à partir de quelle version, avec les sources et la date de vérification. Un tableau à garder.",
    lead: "Le WebP et l'AVIF sont lus par tous les navigateurs actuels. Le JPEG XL est lu par Chrome à partir de la version 155, Firefox à partir de la 158 et Safari à partir de la 17, Edge restant à la traîne. Le HEIC n'est lu que par Safari. Cette page donne la première version de chaque navigateur qui lit chaque format, avec les sources de chaque ligne et la date de notre dernière vérification.",
    sections: [
      {
        h: "Le tableau : première version qui lit chaque format",
        blocks: [
          { p: "Chaque case donne la première version du navigateur qui lit le format sans réglage à activer. Safari est indiqué pour macOS et iOS ensemble, sauf mention contraire. Dernière vérification : 20 novembre 2026." },
          { table: {
            head: ["Format", "Chrome", "Edge", "Firefox", "Safari"],
            rows: [
              ["WebP", "32", "18", "65", "16 (macOS), 14 (iOS)[^caniuse-webp]"],
              ["AVIF", "85", "121", "93", "16.4 (partiel dès la 16.1 sur macOS)[^caniuse-avif]"],
              ["JPEG XL", "155[^chrome-155]", "pas encore[^caniuse-jxl]", "158[^firefox-158]", "17 (partiel)[^webkit-17]"],
              ["HEIC", "non", "non", "non", "17[^caniuse-heif]"],
            ],
          } },
          { p: "« Non » signifie que les sources ne citent aucune version qui lit le format, pas qu'il ne pourra jamais être ajouté. « Partiel » signifie que le navigateur lit les fichiers mais pas toutes les fonctions, détaillées plus bas." },
        ],
      },
      {
        h: "WebP et AVIF : sûrs sur les appareils actuels",
        blocks: [
          { p: "Le WebP est lisible dans tous les grands navigateurs depuis des années. Les versions du tableau sont assez anciennes pour qu'un appareil mis à jour ces dernières années le lise : c'est le format à servir quand on ne peut en garder qu'un. Safari est le plus tardif : Safari sur macOS le lit depuis la version 16, et les iPhone depuis iOS 14.[^caniuse-webp]" },
          { p: "L'AVIF est arrivé avec Chrome 85, Firefox 93 et Edge 121. C'est chez Safari que se trouvent les nuances : la prise en charge est partielle dès la version 16.1 sur macOS et complète à partir de la 16.4.[^caniuse-avif] Deux limites sont utiles à connaître. Firefox ne lit l'AVIF animé que depuis la version 113, et le format n'a pas de rendu progressif : un gros AVIF apparaît d'un coup au lieu de se préciser pendant le chargement.[^mdn-image-types]" },
          { p: "En pratique, les deux formats se placent dans un élément `<picture>` avec un repli en JPEG pour les appareils qui ne reçoivent plus de mises à jour. Le [guide des formats](/guides/webp-avif-jpeg) montre le code et explique quand chacun l'emporte." },
        ],
      },
      {
        h: "JPEG XL : trois navigateurs, un qui manque encore",
        blocks: [
          { p: "Chrome 155 est la première version stable de Chrome qui décode le JPEG XL par défaut.[^chrome-155] Firefox 158, sortie le 13 octobre 2026, l'active par défaut.[^firefox-158] Safari le lit depuis la version 17.0, en septembre 2023, mais sans téléchargement progressif : l'image s'affiche une fois le fichier entier arrivé.[^webkit-17][^mdn-image-types]" },
          { p: "Edge est le trou. Can I use ne liste aucune version d'Edge qui lise le JPEG XL, bien qu'Edge repose sur Chromium, et il en va de même pour Samsung Internet.[^caniuse-jxl] Cela peut changer à n'importe quelle version, et nous marquons la ligne à revérifier. D'ici là, le JPEG XL demande un repli dans un élément `<picture>`, comme l'AVIF." },
          { support: { query: "image/jxl", rows: [
            { label: "chrome 155+", state: "yes", note: "par défaut · oct. 2026" },
            { label: "firefox 158+", state: "yes", note: "par défaut · oct. 2026" },
            { label: "safari 17+", state: "partial", note: "sans téléchargement progressif · sept. 2023" },
            { label: "edge", state: "no", note: "aucune version listée pour l'instant" },
          ] } },
          { p: "Si vous recevez un fichier .jxl et qu'il vous faut un format que toutes les applications ouvrent, [JXL en JPG](/convert/jxl-to-jpg) le convertit dans l'onglet. Dans un navigateur qui ne lit pas le JPEG XL, nos outils le signalent au lieu de produire une image vide : nous avons vérifié que Chrome 155 lit le fichier et que Chrome 154 ne le lit pas." },
        ],
      },
      {
        h: "HEIC : un format Apple, lu par Safari seulement",
        blocks: [
          { p: "Le HEIC est le format de photo par défaut des iPhone. Parmi les navigateurs, Safari 17.0 et suivants est le seul à le lire, sur macOS et sur iOS.[^webkit-17][^caniuse-heif] Chrome, Edge et Firefox ne listent aucune version qui le lise, et Can I use l'attribue au coût et à la complexité de la licence du format." },
          { p: "C'est pourquoi une photo HEIC envoyée depuis un téléphone échoue souvent sur un site qui fonctionne avec le JPEG, et pourquoi convertir est la réponse habituelle. Notre page [HEIC en JPG](/convert/heic-to-jpg) apporte son propre décodeur et convertit dans l'onglet, ou [HEIC en WebP](/convert/heic-to-webp) si les photos sont destinées à une page web. Rien n'est envoyé dans les deux cas." },
        ],
      },
      {
        h: "Ce qui a changé récemment",
        blocks: [
          { p: "Les changements datés qui touchent ce tableau, du plus récent au plus ancien :" },
          { ul: [
            "13 octobre 2026 : Firefox 158 active le JPEG XL par défaut.[^firefox-158]",
            "6 octobre 2026 : Chrome 155 décode le JPEG XL par défaut.[^chrome-155]",
            "Septembre 2023 : Safari 17.0 ajoute le JPEG XL et le HEIC.[^webkit-17]",
          ] },
          { p: "Les étapes plus anciennes, comme Edge 121 pour l'AVIF, figurent dans le tableau sans date parce que nous n'avons pas vérifié leur date de sortie. Quand une version de navigateur change une ligne, cette page est mise à jour et la date de vérification en haut avec elle." },
        ],
      },
      {
        h: "Ce que cette page ne couvre pas",
        blocks: [
          { p: "Trois limites, pour que le tableau ne soit pas lu comme plus qu'il n'est. Les navigateurs Android sont absents : les sources que nous avons lues n'y donnent qu'une seule entrée, ce qui ne suffit pas à affirmer une première version. Les systèmes d'exploitation le sont aussi. Que Windows ou Android ouvrent un fichier HEIC ou JPEG XL hors du navigateur dépend de codecs que nous n'avons pas vérifiés, donc nous n'affirmons rien là-dessus. Enfin, une version de navigateur dit ce qu'il sait lire, pas quelle part de vos visiteurs l'utilise : regardez vos propres statistiques avant de retirer un repli." },
          { p: "Les sources sont listées en bas de page. Les sources officielles (notes de version, MDN, WebKit) appuient les dates. Can I use, un tableau tenu par la communauté, appuie les numéros de version quand aucune note de version ne les donne, et il est marqué comme source secondaire." },
        ],
      },
    ],
    faq: [
      { q: "Quel format d'image fonctionne dans tous les navigateurs ?", a: "Le JPEG et le PNG fonctionnent partout. Parmi les formats modernes, le WebP est lu par tous les navigateurs actuels : Chrome 32, Edge 18, Firefox 65 et Safari 16 (14 sur iOS) ou plus. C'est le choix le plus sûr quand on ne peut en servir qu'un." },
      { q: "Safari prend-il en charge l'AVIF ?", a: "Oui. Safari lit l'AVIF complètement à partir de la version 16.4, avec une prise en charge partielle dès la 16.1 sur macOS. Firefox lit l'AVIF animé depuis la version 113." },
      { q: "Quels navigateurs prennent en charge le JPEG XL ?", a: "Chrome à partir de la version 155, Firefox à partir de la 158 et Safari à partir de la 17, où il n'y a pas de téléchargement progressif. Edge et Samsung Internet ne listent encore aucune version, donc servez le JPEG XL avec un repli." },
      { q: "Chrome ou Firefox peuvent-ils ouvrir les photos HEIC ?", a: "Non. Parmi les navigateurs, seul Safari 17 et suivants lit le HEIC. Pour utiliser une photo d'iPhone sur un site ou dans un autre navigateur, convertissez-la d'abord en JPG ou en WebP." },
      { q: "À quelle fréquence ce tableau est-il mis à jour ?", a: "Dès qu'une version de navigateur change une ligne, et la date de vérification en haut de page indique la dernière relecture. Les numéros de version viennent des notes de version officielles quand elles existent, de Can I use sinon." },
    ],
  },
};
