import type { Guide } from "../guides";

/**
 * Page de référence : limites et règles officielles de robots.txt, sitemap, favicon,
 * title / meta description et Open Graph. Chaque chiffre vient d'une page officielle
 * (Google Search Central, sitemaps.org, ogp.me) relue le 2026-11-20. Aucune de ces pages
 * Google n'affiche de date de mise à jour : la date de relecture est la nôtre.
 */
export const GUIDE_SEO_FILE_LIMITS: Guide = {
  slug: "seo-file-limits",
  published: "2026-11-20",
  updated: "2026-11-20",
  tools: ["robots-txt", "sitemap-generator", "favicon-generator", "meta-preview", "seo-analyzer"],
  verified: "2026-11-20",
  sources: [
    { id: "g-robots", title: "How Google interprets the robots.txt specification", publisher: "Google Search Central", url: "https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt", official: true },
    { id: "g-sitemap", title: "Build and submit a sitemap", publisher: "Google Search Central", url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap", official: true },
    { id: "g-favicon", title: "Define a favicon to show in search results", publisher: "Google Search Central", url: "https://developers.google.com/search/docs/appearance/favicon-in-search", official: true },
    { id: "g-title", title: "Influence your title links in search results", publisher: "Google Search Central", url: "https://developers.google.com/search/docs/appearance/title-link", official: true },
    { id: "g-snippet", title: "Control your snippets in search results", publisher: "Google Search Central", url: "https://developers.google.com/search/docs/appearance/snippet", official: true },
    { id: "sitemaps-org", title: "Sitemaps XML format", publisher: "sitemaps.org", url: "https://www.sitemaps.org/protocol.html", official: true },
    { id: "ogp", title: "The Open Graph protocol", publisher: "ogp.me", url: "https://ogp.me/", official: true },
  ],
  claims: [
    { text: { fr: "Google lit 500 Kio d'un robots.txt, le reste est ignoré ; le fichier doit être en UTF-8 à la racine de l'hôte", en: "Google reads 500 KiB of a robots.txt, the rest is ignored; the file must be UTF-8 at the host root" }, source: "g-robots" },
    { text: { fr: "Google ne gère pas Crawl-delay et ne retient que user-agent, allow, disallow et sitemap", en: "Google does not support Crawl-delay and only keeps user-agent, allow, disallow and sitemap" }, source: "g-robots" },
    { text: { fr: "Un sitemap : 50 Mo non compressés ou 50 000 URL au maximum", en: "One sitemap: 50 MB uncompressed or 50,000 URLs at most" }, source: "g-sitemap" },
    { text: { fr: "Google ignore priority et changefreq ; lastmod n'est utilisé que s'il est vérifiablement exact", en: "Google ignores priority and changefreq; lastmod is only used when it is verifiably accurate" }, source: "g-sitemap" },
    { text: { fr: "Un index de sitemaps : 50 000 sitemaps et 50 Mo au maximum (limite du protocole, absente de la page Google)", en: "A sitemap index: 50,000 sitemaps and 50 MB at most (a protocol limit, not stated on the Google page)" }, source: "sitemaps-org" },
    { text: { fr: "Favicon : carré d'au moins 8 x 8 px, plus de 48 x 48 px recommandé, un seul par nom d'hôte, URL stable", en: "Favicon: square, at least 8 x 8 px, larger than 48 x 48 px recommended, one per hostname, stable URL" }, source: "g-favicon" },
    { text: { fr: "Google ne fixe aucune longueur maximale de title ni de meta description : l'affichage est tronqué selon la largeur de l'appareil", en: "Google sets no maximum length for a title or a meta description: display is cut to fit the device width" }, source: "g-title" },
    { text: { fr: "Open Graph : quatre propriétés requises (og:title, og:type, og:image, og:url), og:image:alt attendu avec toute image", en: "Open Graph: four required properties (og:title, og:type, og:image, og:url), og:image:alt expected with any image" }, source: "ogp" },
  ],
  en: {
    title: "robots.txt, sitemap, favicon: the official limits",
    description: "The real limits for robots.txt, sitemaps, favicons, titles and Open Graph tags, each taken from Google or the standard, with what is not an official rule.",
    lead: "Google reads the first 500 KiB of a robots.txt and ignores Crawl-delay. A sitemap holds at most 50,000 URLs or 50 MB uncompressed, and Google ignores its priority and changefreq. A favicon must be square and at least 8 by 8 pixels. And there is no official character limit for a title or a meta description, only truncation to the screen width. This page gives each rule with its source.",
    sections: [
      {
        h: "The limits at a glance",
        blocks: [
          { p: "Each row is stated on an official page, linked at the bottom. Where a figure comes from the sitemap protocol rather than from Google, the table says so. Last check: 20 November 2026." },
          { table: {
            head: ["File or tag", "Rule", "Source"],
            rows: [
              ["robots.txt", "500 KiB read, the rest ignored. UTF-8, at the top level of the host.[^g-robots]", "Google"],
              ["sitemap", "50,000 URLs or 50 MB uncompressed per file.[^g-sitemap]", "Google"],
              ["sitemap index", "50,000 sitemaps, 50 MB.[^sitemaps-org]", "sitemaps.org"],
              ["favicon", "Square, at least 8 x 8 px, one per hostname, stable URL.[^g-favicon]", "Google"],
              ["title, description", "No maximum length, truncated to the device width.[^g-title][^g-snippet]", "Google"],
              ["Open Graph", "Four required properties: title, type, image, url.[^ogp]", "ogp.me"],
            ],
          } },
        ],
      },
      {
        h: "robots.txt: what Google reads and what it drops",
        blocks: [
          { p: "Google enforces a limit of 500 kibibytes and ignores whatever comes after it.[^g-robots] A short hand-written file stays far below it, but a very long generated one could exceed it, and the rules after the limit would be ignored. The file must be UTF-8 plain text and sit at the top level of the host: a robots.txt in a subdirectory is not valid, and each host, protocol and port needs its own.[^g-robots]" },
          { p: "Only four fields are kept: user-agent, allow, disallow and sitemap. Crawl-delay is not supported by Google, which is a common surprise because other crawlers read it.[^g-robots] The sitemap line is read by Google, Bing and other major search engines, takes a fully qualified URL, and can be repeated.[^g-robots]" },
          { p: "What happens when the file can't be fetched matters more than its content. Any 4xx error except 429 is treated as if no robots.txt existed, so nothing is blocked. A 5xx error is the opposite case: Google first stops crawling, keeps retrying, then falls back on its last cached copy for up to 30 days.[^g-robots] It also caches a successful read for up to 24 hours, so a change you just made can take a day to be seen.[^g-robots]" },
          { p: "The [robots.txt generator](/t/robots-txt) writes the file with these four fields." },
        ],
      },
      {
        h: "Sitemaps: 50,000 URLs, and which tags count",
        blocks: [
          { p: "A single sitemap is limited to 50 MB uncompressed or 50,000 URLs, whichever comes first.[^g-sitemap] Compressing the file does not raise the size limit: the 50 MB applies to the uncompressed content.[^sitemaps-org] Beyond that, you split the list over several files and list them in a sitemap index, which the protocol also caps at 50,000 sitemaps and 50 MB.[^sitemaps-org] That index limit is not repeated on Google's page, so the figure comes from the protocol itself." },
          { p: "The file must be UTF-8, with fully qualified absolute URLs and escaped special characters.[^g-sitemap][^sitemaps-org] A single sitemap can only list URLs from one host.[^sitemaps-org]" },
          { p: "On the optional tags, Google is explicit. It ignores priority and changefreq.[^g-sitemap] It uses lastmod only when it is consistently and verifiably accurate, which means the date of the last significant change to the page, not the day the sitemap was generated.[^g-sitemap][^sitemaps-org] The protocol still defines changefreq and priority as valid hints, so including them is harmless, but they do not steer Google. The [sitemap generator](/t/sitemap-generator) lets you set both; treat them as optional and keep lastmod honest." },
          { p: "Submitting a sitemap is a hint, not an order: it does not guarantee that Google crawls or indexes the listed URLs.[^g-sitemap]" },
        ],
      },
      {
        h: "Favicon: small requirements, one catch",
        blocks: [
          { p: "Google asks for a square image of at least 8 by 8 pixels, and recommends one larger than 48 by 48.[^g-favicon] Many guides repeat a rule that the size must be a multiple of 48, but the page does not say that. The accepted formats are BMP, GIF, ICO, PNG, JPEG, PPM and TIFF; SVG and WebP are not in the list.[^g-favicon]" },
          { p: "Three constraints catch people out. The favicon URL must be stable, so don't change it often. Google supports one favicon per hostname, so a subdirectory such as /news cannot have its own. And neither the home page nor the icon file may be blocked by robots.txt.[^g-favicon] Even then, a favicon is not guaranteed to appear in results.[^g-favicon] The [favicon generator](/t/favicon-generator) produces the PNG sizes."},
        ],
      },
      {
        h: "Titles and descriptions: no official character limit",
        blocks: [
          { p: "The figures usually quoted, around 60 characters for a title and 155 for a description, are not Google rules. Google says there is no limit on the length of a title element, and none on a meta description, and that the result is cut as needed, typically to fit the device width.[^g-title][^g-snippet] They are rules of thumb, and the real cut-off moves with the device." },
          { p: "What Google does ask for is a title on every page, written for the page, concise, not stuffed with keywords and not repeated from page to page.[^g-title] For descriptions, it says identical or similar text on every page is not helpful, and that it mainly builds the snippet from the page itself, using your description only when it describes the page better.[^g-snippet] The [meta preview](/t/meta-preview) cuts at fixed, approximate lengths, not at Google's real limit, and the [SEO analyzer](/t/seo-analyzer) reads the page's tags, so keep the key words early and read the length as a comfort target, not a limit." },
        ],
      },
      {
        h: "Open Graph: four required properties",
        blocks: [
          { p: "The Open Graph protocol requires four properties on every page: og:title, og:type, og:image and og:url.[^ogp] Description, site name and locale are optional but recommended. When a page sets an image, it should also set og:image:alt, a description of what the image shows rather than a caption.[^ogp]" },
          { p: "The protocol itself gives no image size, dimension or format rule, so the dimensions you read elsewhere come from each platform, not from the standard. For the tags and their pitfalls, see the [Open Graph guide](/guides/open-graph-link-previews)." },
        ],
      },
      {
        h: "How this page was checked",
        blocks: [
          { p: "Every figure was read on the official page listed below on 20 November 2026. The Google pages show no update date, and the sitemap protocol page is dated 2016, so a rule can change without a visible sign: the check date above is ours. Where a widely repeated rule is not on the official page, such as the multiple of 48 for favicons or the 60 and 155 characters for titles, we say so instead of repeating it." },
        ],
      },
    ],
    faq: [
      { q: "What is the maximum size of a robots.txt file?", a: "Google reads the first 500 KiB and ignores the rest. The file must be UTF-8 plain text at the top level of the host, and Google does not support Crawl-delay." },
      { q: "How many URLs can a sitemap contain?", a: "50,000 URLs or 50 MB uncompressed per sitemap, whichever is reached first. For more, split the list and reference the files in a sitemap index." },
      { q: "Does Google use sitemap priority and changefreq?", a: "No. Google ignores both. It uses lastmod only when the date is consistently and verifiably accurate, so keep it to the real date of the last significant change." },
      { q: "What size should a favicon be?", a: "Square, at least 8 by 8 pixels, and Google recommends larger than 48 by 48. Accepted formats include PNG, ICO and JPEG. There is one favicon per hostname." },
      { q: "How long should a title or meta description be?", a: "Google gives no maximum for either. They are cut to fit the screen width, so there is no exact character count. Write a concise title and a description that fits the page, and check the preview." },
    ],
  },
  fr: {
    title: "robots.txt, sitemap, favicon : les limites officielles",
    description: "Les vraies limites de robots.txt, des sitemaps, des favicons, des titres et d'Open Graph, prises chez Google ou dans la norme, sans les idées reçues.",
    lead: "Google lit les 500 premiers Kio d'un robots.txt et ignore Crawl-delay. Un sitemap contient au plus 50 000 URL ou 50 Mo non compressés, et Google ignore ses balises priority et changefreq. Un favicon doit être carré et faire au moins 8 sur 8 pixels. Et il n'existe aucune limite officielle de caractères pour un title ou une meta description, seulement une coupure à la largeur de l'écran. Cette page donne chaque règle avec sa source.",
    sections: [
      {
        h: "Les limites en un coup d'œil",
        blocks: [
          { p: "Chaque ligne est énoncée sur une page officielle, liée en bas de page. Quand un chiffre vient du protocole des sitemaps plutôt que de Google, le tableau le dit. Dernière vérification : 20 novembre 2026." },
          { table: {
            head: ["Fichier ou balise", "Règle", "Source"],
            rows: [
              ["robots.txt", "500 Kio lus, le reste est ignoré. UTF-8, à la racine de l'hôte.[^g-robots]", "Google"],
              ["sitemap", "50 000 URL ou 50 Mo non compressés par fichier.[^g-sitemap]", "Google"],
              ["index de sitemaps", "50 000 sitemaps, 50 Mo.[^sitemaps-org]", "sitemaps.org"],
              ["favicon", "Carré, au moins 8 x 8 px, un par nom d'hôte, URL stable.[^g-favicon]", "Google"],
              ["title, description", "Aucune longueur maximale, coupure selon la largeur de l'appareil.[^g-title][^g-snippet]", "Google"],
              ["Open Graph", "Quatre propriétés requises : title, type, image, url.[^ogp]", "ogp.me"],
            ],
          } },
        ],
      },
      {
        h: "robots.txt : ce que Google lit et ce qu'il laisse tomber",
        blocks: [
          { p: "Google applique une limite de 500 kibioctets et ignore tout ce qui vient après.[^g-robots] Un fichier court écrit à la main reste très en dessous, mais un très long fichier généré pourrait la dépasser, et les règles au-delà seraient ignorées. Le fichier doit être du texte brut en UTF-8 et se trouver à la racine de l'hôte : un robots.txt dans un sous-dossier n'est pas valide, et chaque hôte, protocole et port a le sien.[^g-robots]" },
          { p: "Seuls quatre champs sont retenus : user-agent, allow, disallow et sitemap. Google ne gère pas Crawl-delay, ce qui surprend souvent parce que d'autres robots le lisent.[^g-robots] La ligne sitemap est lue par Google, Bing et d'autres grands moteurs, prend une URL complète et peut être répétée.[^g-robots]" },
          { p: "Ce qui se passe quand le fichier est introuvable compte plus que son contenu. Toute erreur 4xx sauf 429 est traitée comme si aucun robots.txt n'existait, donc rien n'est bloqué. Une erreur 5xx est le cas inverse : Google arrête d'abord d'explorer, réessaie, puis se rabat sur sa dernière copie en cache pendant 30 jours au plus.[^g-robots] Il garde aussi une lecture réussie en cache jusqu'à 24 heures, donc une modification récente peut mettre une journée à être vue.[^g-robots]" },
          { p: "Le [générateur de robots.txt](/t/robots-txt) écrit le fichier avec ces quatre champs." },
        ],
      },
      {
        h: "Sitemaps : 50 000 URL, et les balises qui comptent",
        blocks: [
          { p: "Un seul sitemap est limité à 50 Mo non compressés ou 50 000 URL, selon la première limite atteinte.[^g-sitemap] Compresser le fichier ne relève pas la limite de taille : les 50 Mo s'appliquent au contenu décompressé.[^sitemaps-org] Au-delà, on découpe la liste en plusieurs fichiers listés dans un index de sitemaps, que le protocole plafonne aussi à 50 000 sitemaps et 50 Mo.[^sitemaps-org] Cette limite d'index n'est pas répétée sur la page de Google : le chiffre vient du protocole lui-même." },
          { p: "Le fichier doit être en UTF-8, avec des URL absolues complètes et les caractères spéciaux échappés.[^g-sitemap][^sitemaps-org] Un sitemap ne peut lister que des URL d'un seul hôte.[^sitemaps-org]" },
          { p: "Sur les balises facultatives, Google est explicite. Il ignore priority et changefreq.[^g-sitemap] Il n'utilise lastmod que si la date est constamment et vérifiablement exacte, c'est-à-dire la date du dernier changement important de la page, pas le jour de génération du sitemap.[^g-sitemap][^sitemaps-org] Le protocole définit toujours changefreq et priority comme des indications valides, donc les inclure est sans danger, mais elles ne pilotent pas Google. Le [générateur de sitemap](/t/sitemap-generator) permet de régler les deux ; considérez-les comme facultatives et gardez un lastmod honnête." },
          { p: "Soumettre un sitemap est une indication, pas un ordre : cela ne garantit pas que Google explore ou indexe les URL listées.[^g-sitemap]" },
        ],
      },
      {
        h: "Favicon : peu d'exigences, un piège",
        blocks: [
          { p: "Google demande une image carrée d'au moins 8 sur 8 pixels, et en recommande une de plus de 48 sur 48.[^g-favicon] Beaucoup de guides répètent une règle selon laquelle la taille doit être un multiple de 48, mais la page ne le dit pas. Les formats acceptés sont BMP, GIF, ICO, PNG, JPEG, PPM et TIFF ; SVG et WebP ne figurent pas dans la liste.[^g-favicon]" },
          { p: "Trois contraintes piègent souvent. L'URL du favicon doit être stable : ne la changez pas souvent. Google gère un seul favicon par nom d'hôte, donc un sous-dossier comme /news ne peut pas avoir le sien. Et ni la page d'accueil ni le fichier de l'icône ne doivent être bloqués par robots.txt.[^g-favicon] Même ainsi, l'affichage d'un favicon dans les résultats n'est pas garanti.[^g-favicon] Le [générateur de favicon](/t/favicon-generator) produit les tailles en PNG." },
        ],
      },
      {
        h: "Titres et descriptions : aucune limite officielle de caractères",
        blocks: [
          { p: "Les chiffres que l'on cite d'habitude, environ 60 caractères pour un titre et 155 pour une description, ne sont pas des règles de Google. Google indique qu'il n'y a aucune limite à la longueur d'un élément title, ni d'une meta description, et que le résultat est coupé au besoin, en général pour tenir dans la largeur de l'appareil.[^g-title][^g-snippet] Ce sont des repères pratiques, et la coupure réelle varie avec l'appareil." },
          { p: "Ce que Google demande, c'est un titre sur chaque page, écrit pour la page, concis, sans accumulation de mots-clés et sans répétition d'une page à l'autre.[^g-title] Pour les descriptions, il dit que des textes identiques ou proches sur chaque page n'aident pas, et qu'il construit surtout l'extrait à partir de la page elle-même, en n'utilisant votre description que si elle décrit mieux la page.[^g-snippet] L'[aperçu des balises meta](/t/meta-preview) coupe à des longueurs fixes et approximatives, pas à une limite réelle de Google, et l'[analyseur SEO](/t/seo-analyzer) lit les balises de la page : placez les mots importants au début et lisez la longueur comme un repère de confort, pas comme une limite." },
        ],
      },
      {
        h: "Open Graph : quatre propriétés requises",
        blocks: [
          { p: "Le protocole Open Graph exige quatre propriétés sur chaque page : og:title, og:type, og:image et og:url.[^ogp] La description, le nom du site et la langue sont facultatifs mais recommandés. Quand une page définit une image, elle devrait aussi définir og:image:alt, la description de ce que montre l'image plutôt qu'une légende.[^ogp]" },
          { p: "Le protocole lui-même ne donne aucune règle de taille, de dimensions ou de format d'image : les dimensions que vous lisez ailleurs viennent de chaque plateforme, pas de la norme. Pour les balises et leurs pièges, voir le [guide Open Graph](/guides/open-graph-link-previews)." },
        ],
      },
      {
        h: "Comment cette page a été vérifiée",
        blocks: [
          { p: "Chaque chiffre a été lu sur la page officielle listée ci-dessous le 20 novembre 2026. Les pages de Google n'affichent aucune date de mise à jour et la page du protocole des sitemaps date de 2016 : une règle peut donc changer sans signe visible, et la date de vérification en haut est la nôtre. Quand une règle très répandue ne figure pas sur la page officielle, comme le multiple de 48 pour les favicons ou les 60 et 155 caractères des titres, nous le disons au lieu de la répéter." },
        ],
      },
    ],
    faq: [
      { q: "Quelle est la taille maximale d'un fichier robots.txt ?", a: "Google lit les 500 premiers Kio et ignore le reste. Le fichier doit être du texte brut en UTF-8 à la racine de l'hôte, et Google ne gère pas Crawl-delay." },
      { q: "Combien d'URL un sitemap peut-il contenir ?", a: "50 000 URL ou 50 Mo non compressés par sitemap, selon la première limite atteinte. Au-delà, découpez la liste et référencez les fichiers dans un index de sitemaps." },
      { q: "Google utilise-t-il priority et changefreq dans un sitemap ?", a: "Non. Google ignore les deux. Il n'utilise lastmod que si la date est constamment et vérifiablement exacte : gardez la vraie date du dernier changement important." },
      { q: "Quelle taille pour un favicon ?", a: "Carré, d'au moins 8 sur 8 pixels, et Google recommande plus de 48 sur 48. Les formats acceptés comprennent PNG, ICO et JPEG. Il y a un favicon par nom d'hôte." },
      { q: "Quelle longueur pour un title ou une meta description ?", a: "Google ne fixe de maximum ni pour l'un ni pour l'autre. Ils sont coupés selon la largeur de l'écran, donc il n'y a pas de nombre exact de caractères. Écrivez un titre concis et une description adaptée à la page, et vérifiez l'aperçu." },
    ],
  },
};
