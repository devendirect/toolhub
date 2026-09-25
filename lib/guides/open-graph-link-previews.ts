import type { Guide } from "../guides";

export const GUIDE_OPEN_GRAPH: Guide = {
  slug: "open-graph-link-previews",
  published: "2026-09-25",
  updated: "2026-09-25",
  tools: ["meta-preview", "seo-analyzer"],
  en: {
    title: "Open Graph tags: getting your link previews right",
    description: "The Open Graph and Twitter Card tags every page needs, the og:image size that works everywhere, and why previews stay wrong after you fix them.",
    lead: "Five tags decide how a link looks when it's shared on Facebook, LinkedIn, X, Slack or Discord: og:title, og:description, og:image, og:url and twitter:card. Give every page its own values, use an absolute https:// URL for a 1200 × 630 image, render the tags in the HTML the server sends, and remember that each network caches the first preview it saw.",
    sections: [
      {
        h: "The minimal set of tags",
        blocks: [
          { p: "Here is what a page needs, in its <head>, for a clean preview almost everywhere:" },
          { code: "<meta property=\"og:title\" content=\"Merge PDF files without uploading them\">\n<meta property=\"og:description\" content=\"Combine several PDFs into one, in your browser.\">\n<meta property=\"og:image\" content=\"https://example.com/og/pdf-merge.png\">\n<meta property=\"og:url\" content=\"https://example.com/tools/pdf-merge\">\n<meta property=\"og:type\" content=\"website\">\n<meta property=\"og:site_name\" content=\"Example\">\n<meta name=\"twitter:card\" content=\"summary_large_image\">" },
          { p: "Open Graph tags use the property attribute, Twitter Card tags use name. og:type is website for most pages and article for blog posts. og:site_name shows your brand above or below the title on several platforms, and og:locale (fr_FR, en_US) helps when you publish in more than one language." },
          { p: "You don't need twitter:title, twitter:description or twitter:image if the Open Graph versions exist: X falls back to them. twitter:card is the exception, because it has no Open Graph equivalent: summary gives a small square thumbnail next to the text, summary_large_image a wide image above it." },
        ],
      },
      {
        h: "What each platform reads",
        blocks: [
          { table: {
            head: ["Platform", "Title", "Image", "Worth knowing"],
            rows: [
              ["Google search", "title tag", "Rarely shown", "Reads the title tag and meta description, not Open Graph, and may rewrite both"],
              ["Facebook, LinkedIn", "og:title", "og:image", "Fall back to the title and description when Open Graph is missing"],
              ["X", "twitter:title, then og:title", "twitter:image, then og:image", "twitter:card sets the layout"],
              ["Slack, Discord", "og:title", "og:image", "Read the same Open Graph tags when they unfold a link"],
            ],
          } },
          { p: "That split explains a common surprise: the same page shows one headline in Google and another on Facebook. It's not an error. The search title can target the query, the social title the click, as long as both describe the same page. The [meta tag preview](/t/meta-preview) shows the Google result, the Facebook card and the X card side by side, so you can compare them before publishing." },
        ],
      },
      {
        h: "The image: size, format and address",
        blocks: [
          { p: "1200 × 630 pixels, a 1.91:1 ratio, is the size that fills the large card on Facebook, LinkedIn and X. Much smaller images get shown as a thumbnail or not at all. Keep the important part, text or a face, away from the edges, since some apps crop the image to a square." },
          { p: "Use JPEG or PNG. WebP works on most platforms but not all of them, and an og:image is one place where compatibility matters more than a few kilobytes." },
          { p: "The address must be absolute. `/images/cover.png` works in a browser, which resolves it against the page, but the crawlers of social networks expect `https://example.com/images/cover.png` and simply show no image otherwise. It's the most frequent cause of a card without a picture, and the meta tag preview flags a relative og:image instead of pretending it works." },
          { p: "Finally, the image must be publicly reachable. An image behind a login, on a staging server, or on a host that blocks requests from other sites loads fine for you and fails for the crawler." },
        ],
      },
      {
        h: "One set of tags per page, not per site",
        blocks: [
          { p: "The quiet failure is a site where every page shares the home page's title and image. Nothing looks broken, but every shared article shows the same generic card. Each template, home, article, product, tool, needs its own og:title, og:description, og:url and ideally its own image." },
          { p: "Frameworks make this easy and add their own trap. In Next.js, a page's metadata is merged with its layout's, but only at the top level: when a page defines its own openGraph object, it replaces the layout's openGraph entirely. On this site, that's how og:site_name and og:type, set once in the layout, disappeared from every tool page, which only showed up when we ran our own pages through the preview tool. Repeat the shared fields in each page, or build the page's openGraph from a shared base object." },
          { p: "For the images themselves, generating them beats drawing them by hand once you have more than a handful of pages. Next.js can render an image per page from a template (an opengraph-image file using ImageResponse), with the page title written on it, so every new page gets a proper card automatically." },
        ],
      },
      {
        h: "Why the preview is still wrong after you fixed it",
        blocks: [
          { p: "Facebook, LinkedIn and chat apps store the preview of a URL the first time someone shares it, and keep serving that copy. You fix the tags, share again, and see last month's image. The page is fine; their copy is old." },
          { p: "To force a refresh, paste the URL into Facebook's Sharing Debugger and click Scrape Again, or into LinkedIn's Post Inspector. Do it before sharing again, not after. For Slack, a changed URL (a harmless query parameter) gets a fresh preview when you're in a hurry." },
          { p: "One more cause, easy to miss: tags added by JavaScript after the page loads. The crawlers that build previews generally don't run scripts, so they see the HTML the server sent. If a tool that reads raw HTML, like the meta tag preview or the [SEO analyzer](/t/seo-analyzer), can't find your tags, the social networks can't either. Render them on the server." },
        ],
      },
      {
        h: "A checklist before publishing",
        blocks: [
          { ol: [
            "og:title and og:description are specific to this page, not copied from the home page.",
            "og:image is an absolute https:// URL, 1200 × 630, JPEG or PNG, reachable without a login.",
            "og:url matches the page's canonical URL.",
            "twitter:card is set to summary_large_image if you want the wide image on X.",
            "The tags are in the HTML source (Ctrl+U), not added later by a script.",
            "The preview looks right in a preview tool, and you've refreshed the networks' cache if the URL was shared before.",
          ] },
        ],
      },
    ],
    faq: [
      { q: "What size should an og:image be?", a: "1200 × 630 pixels, a 1.91:1 ratio. That fills the large card on Facebook, LinkedIn and X. Use an absolute https:// URL and a JPEG or PNG file, and keep important content away from the edges in case an app crops it." },
      { q: "Do I need both Open Graph and Twitter Card tags?", a: "Mostly Open Graph. X falls back to og:title, og:description and og:image when the twitter: versions are missing. Add twitter:card, which has no Open Graph equivalent and chooses between the small and large layout." },
      { q: "Why does LinkedIn still show my old image?", a: "Because LinkedIn cached the preview the first time the URL was shared. Paste the URL into LinkedIn's Post Inspector to make it fetch the page again. Facebook works the same way with its Sharing Debugger." },
      { q: "Do Open Graph tags help SEO?", a: "Not directly: Google ranks and titles pages from the title tag, meta description and content. Good previews help indirectly, because a clear card gets more clicks and shares, which bring visitors and links." },
    ],
  },
  fr: {
    title: "Balises Open Graph : réussir l'aperçu de vos liens",
    description: "Les balises Open Graph et Twitter Card qu'il faut à chaque page, la taille d'og:image qui marche partout, et pourquoi l'aperçu reste faux après correction.",
    lead: "Cinq balises décident de l'aspect d'un lien partagé sur Facebook, LinkedIn, X, Slack ou Discord : og:title, og:description, og:image, og:url et twitter:card. Donnez à chaque page ses propres valeurs, une image de 1200 × 630 en URL absolue https://, générez les balises dans le HTML envoyé par le serveur, et rappelez-vous que chaque réseau garde en cache le premier aperçu qu'il a vu.",
    sections: [
      {
        h: "Le jeu minimal de balises",
        blocks: [
          { p: "Voici ce qu'il faut à une page, dans son <head>, pour un aperçu propre presque partout :" },
          { code: "<meta property=\"og:title\" content=\"Fusionner des PDF sans les envoyer\">\n<meta property=\"og:description\" content=\"Réunissez plusieurs PDF en un seul, dans votre navigateur.\">\n<meta property=\"og:image\" content=\"https://example.com/og/pdf-merge.png\">\n<meta property=\"og:url\" content=\"https://example.com/outils/pdf-merge\">\n<meta property=\"og:type\" content=\"website\">\n<meta property=\"og:site_name\" content=\"Exemple\">\n<meta name=\"twitter:card\" content=\"summary_large_image\">" },
          { p: "Les balises Open Graph utilisent l'attribut property, les Twitter Cards l'attribut name. og:type vaut website pour la plupart des pages et article pour un billet de blog. og:site_name affiche votre marque au-dessus ou au-dessous du titre sur plusieurs plateformes, et og:locale (fr_FR, en_US) aide quand vous publiez en plusieurs langues." },
          { p: "Inutile d'ajouter twitter:title, twitter:description ou twitter:image si les versions Open Graph existent : X se rabat dessus. twitter:card fait exception, car elle n'a pas d'équivalent Open Graph : summary donne une petite vignette carrée à côté du texte, summary_large_image une image large au-dessus." },
        ],
      },
      {
        h: "Ce que lit chaque plateforme",
        blocks: [
          { table: {
            head: ["Plateforme", "Titre", "Image", "Bon à savoir"],
            rows: [
              ["Recherche Google", "Balise title", "Rarement affichée", "Lit la balise title et la meta description, pas Open Graph, et peut réécrire les deux"],
              ["Facebook, LinkedIn", "og:title", "og:image", "Se rabattent sur le titre et la description quand Open Graph manque"],
              ["X", "twitter:title, puis og:title", "twitter:image, puis og:image", "twitter:card fixe la mise en page"],
              ["Slack, Discord", "og:title", "og:image", "Lisent les mêmes balises Open Graph quand ils déplient un lien"],
            ],
          } },
          { p: "Cette répartition explique une surprise courante : la même page affiche un titre dans Google et un autre sur Facebook. Ce n'est pas une erreur. Le titre de recherche peut viser la requête, le titre social le clic, tant que les deux décrivent la même page. L'[aperçu des balises meta](/t/meta-preview) montre côte à côte le résultat Google, la carte Facebook et la carte X, pour les comparer avant de publier." },
        ],
      },
      {
        h: "L'image : taille, format et adresse",
        blocks: [
          { p: "1200 × 630 pixels, soit un ratio de 1,91:1, est la taille qui remplit la grande carte sur Facebook, LinkedIn et X. Une image bien plus petite s'affiche en vignette, ou pas du tout. Gardez l'essentiel, texte ou visage, loin des bords, car certaines applications recadrent l'image en carré." },
          { p: "Prenez du JPEG ou du PNG. Le WebP passe sur la plupart des plateformes, mais pas toutes, et une og:image est justement l'endroit où la compatibilité compte plus que quelques kilo-octets." },
          { p: "L'adresse doit être absolue. `/images/couverture.png` fonctionne dans un navigateur, qui la résout par rapport à la page, mais les robots des réseaux sociaux attendent `https://example.com/images/couverture.png` et n'affichent tout simplement pas d'image sinon. C'est la cause la plus fréquente d'une carte sans image, et l'aperçu des balises meta signale une og:image relative au lieu de faire comme si elle fonctionnait." },
          { p: "Enfin, l'image doit être accessible publiquement. Une image derrière une connexion, sur un serveur de préproduction ou sur un hébergeur qui bloque les requêtes venues d'autres sites se charge chez vous et échoue pour le robot." },
        ],
      },
      {
        h: "Des balises par page, pas par site",
        blocks: [
          { p: "L'échec silencieux, c'est un site dont toutes les pages reprennent le titre et l'image de l'accueil. Rien ne paraît cassé, mais chaque article partagé affiche la même carte générique. Chaque gabarit, accueil, article, produit, outil, a besoin de ses propres og:title, og:description, og:url et, idéalement, de sa propre image." },
          { p: "Les frameworks facilitent la tâche et ajoutent leur propre piège. Dans Next.js, les métadonnées d'une page sont fusionnées avec celles de son layout, mais seulement au premier niveau : quand une page définit son propre objet openGraph, il remplace entièrement celui du layout. Sur ce site, c'est ainsi que og:site_name et og:type, définis une fois dans le layout, ont disparu de chaque page outil, ce qui n'est apparu qu'en passant nos propres pages dans l'outil d'aperçu. Répétez les champs communs dans chaque page, ou construisez l'openGraph de la page à partir d'un objet de base partagé." },
          { p: "Pour les images elles-mêmes, les générer vaut mieux que les dessiner à la main dès qu'on dépasse quelques pages. Next.js peut produire une image par page à partir d'un modèle (un fichier opengraph-image utilisant ImageResponse), avec le titre de la page écrit dessus : chaque nouvelle page reçoit automatiquement une vraie carte." },
        ],
      },
      {
        h: "Pourquoi l'aperçu reste faux après correction",
        blocks: [
          { p: "Facebook, LinkedIn et les messageries enregistrent l'aperçu d'une URL la première fois qu'elle est partagée, et continuent de servir cette copie. Vous corrigez les balises, repartagez, et voyez l'image du mois dernier. La page est correcte ; c'est leur copie qui est vieille." },
          { p: "Pour forcer la mise à jour, collez l'URL dans le Sharing Debugger de Facebook et cliquez sur Scrape Again, ou dans le Post Inspector de LinkedIn. Faites-le avant de repartager, pas après. Pour Slack, en cas d'urgence, une URL modifiée (un paramètre sans effet) obtient un aperçu neuf." },
          { p: "Une dernière cause, facile à manquer : des balises ajoutées par JavaScript après le chargement. Les robots qui fabriquent les aperçus n'exécutent généralement pas les scripts : ils voient le HTML envoyé par le serveur. Si un outil qui lit le HTML brut, comme l'aperçu des balises meta ou l'[analyseur SEO](/t/seo-analyzer), ne trouve pas vos balises, les réseaux sociaux non plus. Générez-les côté serveur." },
        ],
      },
      {
        h: "La liste de contrôle avant publication",
        blocks: [
          { ol: [
            "og:title et og:description sont propres à cette page, pas copiés de l'accueil.",
            "og:image est une URL absolue en https://, en 1200 × 630, JPEG ou PNG, accessible sans connexion.",
            "og:url correspond à l'URL canonique de la page.",
            "twitter:card vaut summary_large_image si vous voulez l'image large sur X.",
            "Les balises sont dans le code source HTML (Ctrl+U), pas ajoutées ensuite par un script.",
            "L'aperçu est correct dans un outil d'aperçu, et vous avez vidé le cache des réseaux si l'URL avait déjà été partagée.",
          ] },
        ],
      },
    ],
    faq: [
      { q: "Quelle taille donner à une og:image ?", a: "1200 × 630 pixels, soit un ratio de 1,91:1. Elle remplit la grande carte sur Facebook, LinkedIn et X. Utilisez une URL absolue en https:// et un fichier JPEG ou PNG, et gardez l'essentiel loin des bords au cas où une application la recadrerait." },
      { q: "Faut-il à la fois les balises Open Graph et Twitter Card ?", a: "Surtout Open Graph. X se rabat sur og:title, og:description et og:image quand les versions twitter: manquent. Ajoutez twitter:card, qui n'a pas d'équivalent Open Graph et choisit entre la petite et la grande mise en page." },
      { q: "Pourquoi LinkedIn affiche-t-il encore mon ancienne image ?", a: "Parce que LinkedIn a gardé en cache l'aperçu du premier partage de l'URL. Collez l'URL dans le Post Inspector de LinkedIn pour qu'il récupère à nouveau la page. Facebook fonctionne de la même façon avec son Sharing Debugger." },
      { q: "Les balises Open Graph aident-elles le SEO ?", a: "Pas directement : Google classe et titre les pages à partir de la balise title, de la meta description et du contenu. De bons aperçus aident indirectement, car une carte claire obtient plus de clics et de partages, qui amènent visiteurs et liens." },
    ],
  },
};
