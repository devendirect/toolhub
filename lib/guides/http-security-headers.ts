import type { Guide } from "../guides";

export const GUIDE_SECURITY_HEADERS: Guide = {
  slug: "http-security-headers",
  published: "2026-09-25",
  updated: "2026-09-25",
  tools: ["headers-checker"],
  en: {
    title: "HTTP security headers explained, and how to roll them out",
    description: "What CSP, HSTS, X-Frame-Options, nosniff and Referrer-Policy protect against, config examples for Nginx, Apache and Next.js, and a safe rollout order.",
    lead: "Security headers are instructions your server sends with every page, telling the browser what it may do with it: load scripts only from certain places, never downgrade to HTTP, never display the page inside another site's frame. Four of them block well-known attacks at almost no cost; the fifth, Content-Security-Policy, is the most powerful and the one that takes real work.",
    sections: [
      {
        h: "What each header protects against",
        blocks: [
          { table: {
            head: ["Header", "Stops", "Typical value"],
            rows: [
              ["Strict-Transport-Security", "Downgrade to plain HTTP on a hostile network", "`max-age=31536000; includeSubDomains`"],
              ["X-Content-Type-Options", "The browser guessing a file's type and running it as script", "`nosniff`"],
              ["X-Frame-Options", "Clickjacking: your page shown invisibly inside another site", "`DENY` or `SAMEORIGIN`"],
              ["Referrer-Policy", "Full URLs, with their parameters, leaking to other sites", "`strict-origin-when-cross-origin`"],
              ["Permissions-Policy", "Scripts using the camera, microphone or location without need", "`camera=(), microphone=(), geolocation=()`"],
              ["Content-Security-Policy", "Injected scripts (XSS) and unexpected resources", "Depends entirely on the site"],
            ],
          } },
          { p: "The first five are one line each and rarely break anything. That's why you should add them today, and treat CSP as a separate project." },
        ],
      },
      {
        h: "The four easy ones",
        blocks: [
          { p: "X-Content-Type-Options: nosniff tells the browser to trust the declared content type. Without it, a file uploaded as an image but containing script can, in some situations, be executed. It has exactly one valid value, nosniff, and no side effects." },
          { p: "X-Frame-Options: DENY forbids any site, including yours, from displaying the page in a frame; SAMEORIGIN allows your own pages. The modern equivalent is the frame-ancestors directive of CSP, which wins when both are present. Sending both costs nothing and covers older browsers." },
          { p: "Referrer-Policy decides how much of the current URL is sent to the next site when someone clicks a link. Current browsers already default to strict-origin-when-cross-origin, which sends only the domain to other sites, so setting it explicitly mostly protects visitors on older browsers and documents your intent." },
          { p: "Permissions-Policy switches off browser features you don't use. If your site never asks for the camera, saying so means that an injected third-party script can't ask either." },
        ],
      },
      {
        h: "HSTS: once set, hard to take back",
        blocks: [
          { p: "Strict-Transport-Security tells the browser to use HTTPS for your domain for the next max-age seconds, whatever link the user follows. It closes the gap where a first request goes out over plain HTTP and gets intercepted on a public Wi-Fi." },
          { p: "The catch is that the browser remembers. Serve max-age=31536000 and a visitor's browser refuses plain HTTP on your domain for a year, even if you later need it on a subdomain. So roll it out in steps: a few minutes, then a day, then a year, adding includeSubDomains only once every subdomain really serves HTTPS." },
          { p: "The preload list, submitted at hstspreload.org, goes one step further: browsers ship your domain as HTTPS-only before the first visit. It requires a max-age of at least a year, includeSubDomains and the preload directive, and getting removed takes months. Treat it as a one-way door." },
        ],
      },
      {
        h: "Content-Security-Policy: the one that takes work",
        blocks: [
          { p: "CSP lists where each kind of resource may come from: scripts from your own domain and one analytics provider, images from anywhere over HTTPS, no plugins, no framing. A script injected through an XSS flaw then simply doesn't run, because its origin isn't on the list." },
          { p: "The difficulty is that a real site loads more than you think. Ads, consent platforms, analytics, fonts, embedded videos each pull code from several domains, some of which change without notice. This site is an example: its pages load Google's ad script and consent platform, and it doesn't send a CSP yet, which is why our own [security headers checker](/t/headers-checker) grades it B. A policy that lists everything with wildcards and 'unsafe-inline' would earn the A while protecting little; we'd rather keep the honest B until a strict policy works." },
          { p: "The safe way in is report-only mode. Send your policy as Content-Security-Policy-Report-Only: the browser enforces nothing but reports every violation in the console (and to a reporting endpoint if you set one). Browse the whole site, fix or allow what's legitimate, and only then switch the header name to Content-Security-Policy." },
          { code: "Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self' https: data:; script-src 'self' https://www.googletagmanager.com; frame-ancestors 'none'" },
          { p: "Two directives are worth adding even before the full policy: frame-ancestors 'none' (anti-framing, like X-Frame-Options) and upgrade-insecure-requests, which rewrites stray http:// resource URLs to https://." },
        ],
      },
      {
        h: "Adding them: Nginx, Apache, Next.js",
        blocks: [
          { p: "On Nginx, one add_header per header, in the server block, with the always keyword so error pages get them too:" },
          { code: "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;\nadd_header X-Content-Type-Options \"nosniff\" always;\nadd_header X-Frame-Options \"DENY\" always;\nadd_header Referrer-Policy \"strict-origin-when-cross-origin\" always;" },
          { p: "Remember the inheritance rule: a location block that defines any add_header of its own loses every header set in the server block. On Apache, with mod_headers enabled, the same lines become `Header always set X-Content-Type-Options \"nosniff\"`, in the virtual host or an .htaccess file." },
          { p: "In a Next.js app, the headers() function of next.config.ts returns them for any path pattern. This site sets X-Frame-Options, nosniff and Referrer-Policy that way, while HSTS comes from the Nginx server in front of it. Splitting headers between the app and the proxy works, as long as you know which layer sets which, and never set the same header in both with different values." },
          { code: "async headers() {\n  return [{\n    source: \"/(.*)\",\n    headers: [\n      { key: \"X-Frame-Options\", value: \"DENY\" },\n      { key: \"X-Content-Type-Options\", value: \"nosniff\" },\n      { key: \"Referrer-Policy\", value: \"strict-origin-when-cross-origin\" },\n    ],\n  }];\n}" },
        ],
      },
      {
        h: "When a header breaks something: the COOP and COEP example",
        blocks: [
          { p: "Headers can conflict with features you want. Our audio and video converters run FFmpeg compiled to WebAssembly, which needs SharedArrayBuffer, and browsers only allow that on pages that are cross-origin isolated: they must send Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: require-corp." },
          { p: "COEP then blocks any third-party resource that doesn't explicitly allow being embedded, and ad frames don't. The result on those two pages was a permanently empty ad slot, so we send those headers only on the two pages that need them and don't place ads there. The general lesson: apply strict headers where they're needed, check what they block, and don't copy a header set from another site without knowing what each line does." },
        ],
      },
      {
        h: "A rollout order that doesn't break production",
        blocks: [
          { ol: [
            "Add nosniff, X-Frame-Options (or frame-ancestors), Referrer-Policy and Permissions-Policy. Check the site still works, especially anything embedded in an iframe.",
            "Add HSTS with a short max-age, then raise it to a day, then a year once you're sure every page and subdomain serves HTTPS.",
            "Write a CSP in report-only mode, browse every type of page, and clean up the violations.",
            "Switch the CSP to enforcing mode, keep watching the console for a while, and only then consider HSTS preload.",
          ] },
          { p: "After each step, reload the server, retest a page (not only the home page, since headers are often set per path) and check the result in a headers checker or with `curl -sIL https://your-site`." },
        ],
      },
    ],
    faq: [
      { q: "Which security header should I add first?", a: "X-Content-Type-Options: nosniff, then X-Frame-Options and Referrer-Policy. They're one line each and almost never break anything. HSTS comes next, with a short max-age at first, and Content-Security-Policy last, starting in report-only mode." },
      { q: "Do I still need X-XSS-Protection?", a: "No. It controlled an XSS filter that browsers have removed, and OWASP recommends not sending it or setting it to 0. A Content-Security-Policy is what protects against XSS today." },
      { q: "Can security headers slow down my site?", a: "No measurable impact: they're a few hundred bytes added to each response. They can break features, though, if a policy blocks a resource you need, which is why CSP should start in report-only mode." },
      { q: "Why do my headers show on the home page but not on other pages?", a: "Usually because headers are set per path. On Nginx, a location block with its own add_header drops the ones from the server block. Test several page types, and error pages too, which need the always keyword." },
    ],
  },
  fr: {
    title: "Les en-têtes de sécurité HTTP expliqués et déployés",
    description: "Ce que CSP, HSTS, X-Frame-Options, nosniff et Referrer-Policy empêchent, des exemples Nginx, Apache et Next.js, et un ordre de déploiement sans casse.",
    lead: "Les en-têtes de sécurité sont des consignes que votre serveur envoie avec chaque page pour dire au navigateur ce qu'il a le droit d'en faire : ne charger des scripts que depuis certains endroits, ne jamais repasser en HTTP, ne jamais afficher la page dans le cadre d'un autre site. Quatre d'entre eux bloquent des attaques connues pour un coût quasi nul ; le cinquième, Content-Security-Policy, est le plus puissant et le seul qui demande un vrai travail.",
    sections: [
      {
        h: "Ce que protège chaque en-tête",
        blocks: [
          { table: {
            head: ["En-tête", "Empêche", "Valeur type"],
            rows: [
              ["Strict-Transport-Security", "Le retour forcé en HTTP simple sur un réseau hostile", "`max-age=31536000; includeSubDomains`"],
              ["X-Content-Type-Options", "Le navigateur qui devine le type d'un fichier et l'exécute comme script", "`nosniff`"],
              ["X-Frame-Options", "Le clickjacking : votre page affichée, invisible, dans un autre site", "`DENY` ou `SAMEORIGIN`"],
              ["Referrer-Policy", "La fuite d'URL complètes, paramètres compris, vers d'autres sites", "`strict-origin-when-cross-origin`"],
              ["Permissions-Policy", "Des scripts qui utilisent caméra, micro ou localisation sans raison", "`camera=(), microphone=(), geolocation=()`"],
              ["Content-Security-Policy", "Les scripts injectés (XSS) et les ressources inattendues", "Dépend entièrement du site"],
            ],
          } },
          { p: "Les cinq premiers tiennent en une ligne et ne cassent presque jamais rien. C'est pourquoi il faut les ajouter dès aujourd'hui, et traiter la CSP comme un projet à part." },
        ],
      },
      {
        h: "Les quatre faciles",
        blocks: [
          { p: "X-Content-Type-Options: nosniff demande au navigateur de se fier au type de contenu annoncé. Sans lui, un fichier envoyé comme image mais contenant du script peut, dans certaines situations, être exécuté. Il n'a qu'une valeur valable, nosniff, et aucun effet de bord." },
          { p: "X-Frame-Options: DENY interdit à tout site, y compris le vôtre, d'afficher la page dans un cadre ; SAMEORIGIN autorise vos propres pages. L'équivalent moderne est la directive frame-ancestors de la CSP, qui l'emporte quand les deux sont présents. Envoyer les deux ne coûte rien et couvre les anciens navigateurs." },
          { p: "Referrer-Policy décide quelle part de l'URL courante est transmise au site suivant quand quelqu'un clique sur un lien. Les navigateurs actuels appliquent déjà strict-origin-when-cross-origin par défaut, qui n'envoie que le domaine aux autres sites : le fixer explicitement protège surtout les visiteurs aux navigateurs anciens et documente votre intention." },
          { p: "Permissions-Policy désactive les fonctions du navigateur que vous n'utilisez pas. Si votre site ne demande jamais la caméra, le dire empêche aussi un script tiers injecté de la demander." },
        ],
      },
      {
        h: "HSTS : une fois posé, difficile à retirer",
        blocks: [
          { p: "Strict-Transport-Security indique au navigateur d'utiliser HTTPS pour votre domaine pendant max-age secondes, quel que soit le lien suivi. Il comble la faille de la première requête partie en HTTP simple et interceptée sur un Wi-Fi public." },
          { p: "Le piège, c'est que le navigateur s'en souvient. Envoyez max-age=31536000, et le navigateur d'un visiteur refuse le HTTP simple sur votre domaine pendant un an, même si vous en avez besoin plus tard sur un sous-domaine. Déployez-le donc par paliers : quelques minutes, puis un jour, puis un an, en n'ajoutant includeSubDomains qu'une fois que chaque sous-domaine sert vraiment du HTTPS." },
          { p: "La liste de préchargement, soumise sur hstspreload.org, va plus loin : les navigateurs embarquent votre domaine comme HTTPS seulement, avant même la première visite. Elle exige un max-age d'au moins un an, includeSubDomains et la directive preload, et en sortir prend des mois. Considérez-la comme une porte à sens unique." },
        ],
      },
      {
        h: "Content-Security-Policy : celle qui demande du travail",
        blocks: [
          { p: "La CSP liste d'où chaque type de ressource a le droit de venir : scripts depuis votre domaine et un fournisseur de mesure d'audience, images depuis n'importe où en HTTPS, pas de plugins, pas d'intégration en cadre. Un script injecté par une faille XSS ne s'exécute alors tout simplement pas, puisque son origine n'est pas sur la liste." },
          { p: "La difficulté, c'est qu'un vrai site charge plus de choses qu'on ne le croit. Publicités, plateformes de consentement, mesure d'audience, polices, vidéos intégrées tirent chacune du code de plusieurs domaines, dont certains changent sans prévenir. Ce site en est un exemple : ses pages chargent le script publicitaire et la plateforme de consentement de Google, et il n'envoie pas encore de CSP, d'où la note B que lui donne notre propre [vérificateur d'en-têtes de sécurité](/t/headers-checker). Une politique qui liste tout avec des jokers et 'unsafe-inline' décrocherait le A en protégeant peu ; nous préférons garder un B honnête jusqu'à ce qu'une politique stricte fonctionne." },
          { p: "La façon sûre de commencer est le mode rapport. Envoyez votre politique sous le nom Content-Security-Policy-Report-Only : le navigateur n'applique rien mais signale chaque violation dans la console (et à une adresse de rapport si vous en configurez une). Parcourez tout le site, corrigez ou autorisez ce qui est légitime, puis seulement renommez l'en-tête en Content-Security-Policy." },
          { code: "Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self' https: data:; script-src 'self' https://www.googletagmanager.com; frame-ancestors 'none'" },
          { p: "Deux directives valent la peine avant même la politique complète : frame-ancestors 'none' (anti-cadre, comme X-Frame-Options) et upgrade-insecure-requests, qui réécrit en https:// les adresses de ressources restées en http://." },
        ],
      },
      {
        h: "Les ajouter : Nginx, Apache, Next.js",
        blocks: [
          { p: "Sous Nginx, un add_header par en-tête, dans le bloc server, avec le mot-clé always pour que les pages d'erreur les reçoivent aussi :" },
          { code: "add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;\nadd_header X-Content-Type-Options \"nosniff\" always;\nadd_header X-Frame-Options \"DENY\" always;\nadd_header Referrer-Policy \"strict-origin-when-cross-origin\" always;" },
          { p: "Retenez la règle d'héritage : un bloc location qui définit le moindre add_header perd tous ceux du bloc server. Sous Apache, avec mod_headers activé, les mêmes lignes deviennent `Header always set X-Content-Type-Options \"nosniff\"`, dans l'hôte virtuel ou un fichier .htaccess." },
          { p: "Dans une application Next.js, la fonction headers() de next.config.ts les renvoie pour n'importe quel motif de chemin. Ce site pose ainsi X-Frame-Options, nosniff et Referrer-Policy, tandis que HSTS vient du serveur Nginx placé devant. Répartir les en-têtes entre l'application et le proxy fonctionne, à condition de savoir quelle couche pose lequel, et de ne jamais poser le même en-tête dans les deux avec des valeurs différentes." },
          { code: "async headers() {\n  return [{\n    source: \"/(.*)\",\n    headers: [\n      { key: \"X-Frame-Options\", value: \"DENY\" },\n      { key: \"X-Content-Type-Options\", value: \"nosniff\" },\n      { key: \"Referrer-Policy\", value: \"strict-origin-when-cross-origin\" },\n    ],\n  }];\n}" },
        ],
      },
      {
        h: "Quand un en-tête casse quelque chose : l'exemple COOP et COEP",
        blocks: [
          { p: "Des en-têtes peuvent entrer en conflit avec des fonctions voulues. Nos convertisseurs audio et vidéo font tourner FFmpeg compilé en WebAssembly, qui a besoin de SharedArrayBuffer, et les navigateurs ne l'autorisent que sur les pages isolées des autres origines : elles doivent envoyer Cross-Origin-Opener-Policy: same-origin et Cross-Origin-Embedder-Policy: require-corp." },
          { p: "COEP bloque alors toute ressource tierce qui n'autorise pas explicitement son intégration, et les cadres publicitaires ne le font pas. Résultat sur ces deux pages : un emplacement publicitaire vide en permanence. Nous n'envoyons donc ces en-têtes que sur les deux pages qui en ont besoin, et n'y plaçons pas de publicité. La leçon générale : appliquez les en-têtes stricts là où ils sont nécessaires, vérifiez ce qu'ils bloquent, et ne copiez pas le jeu d'en-têtes d'un autre site sans savoir ce que fait chaque ligne." },
        ],
      },
      {
        h: "Un ordre de déploiement qui ne casse pas la production",
        blocks: [
          { ol: [
            "Ajoutez nosniff, X-Frame-Options (ou frame-ancestors), Referrer-Policy et Permissions-Policy. Vérifiez que le site fonctionne toujours, surtout ce qui est intégré dans un iframe.",
            "Ajoutez HSTS avec un max-age court, puis passez à un jour, puis à un an une fois sûr que chaque page et sous-domaine sert du HTTPS.",
            "Écrivez une CSP en mode rapport, parcourez chaque type de page et éliminez les violations.",
            "Passez la CSP en mode appliqué, surveillez encore la console un moment, et seulement ensuite envisagez le préchargement HSTS.",
          ] },
          { p: "Après chaque étape, rechargez le serveur, retestez une page (pas seulement l'accueil, les en-têtes étant souvent définis par chemin) et vérifiez le résultat dans un vérificateur d'en-têtes ou avec `curl -sIL https://votre-site`." },
        ],
      },
    ],
    faq: [
      { q: "Quel en-tête de sécurité ajouter en premier ?", a: "X-Content-Type-Options: nosniff, puis X-Frame-Options et Referrer-Policy. Ils tiennent en une ligne et ne cassent presque jamais rien. HSTS vient ensuite, d'abord avec un max-age court, et Content-Security-Policy en dernier, en commençant par le mode rapport." },
      { q: "Faut-il encore envoyer X-XSS-Protection ?", a: "Non. Il pilotait un filtre XSS que les navigateurs ont retiré, et l'OWASP recommande de ne pas l'envoyer ou de le régler à 0. C'est une Content-Security-Policy qui protège du XSS aujourd'hui." },
      { q: "Les en-têtes de sécurité ralentissent-ils le site ?", a: "Aucun impact mesurable : ce sont quelques centaines d'octets ajoutés à chaque réponse. Ils peuvent en revanche casser des fonctions si une politique bloque une ressource utile, d'où l'intérêt de commencer la CSP en mode rapport." },
      { q: "Pourquoi mes en-têtes apparaissent-ils sur l'accueil mais pas sur les autres pages ?", a: "En général parce que les en-têtes sont définis par chemin. Sous Nginx, un bloc location qui a son propre add_header perd ceux du bloc server. Testez plusieurs types de pages, et les pages d'erreur aussi, qui demandent le mot-clé always." },
    ],
  },
};
