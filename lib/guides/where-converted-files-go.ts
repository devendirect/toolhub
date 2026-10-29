import type { Guide } from "../guides";

export const GUIDE_WHERE_FILES_GO: Guide = {
  slug: "where-converted-files-go",
  published: "2026-10-29",
  updated: "2026-10-29",
  tools: ["pdf-merge", "image-converter", "compress-to-kb", "hash-generator", "audio-converter", "headers-checker"],
  sources: [
    { id: "mdn-cors", title: "Cross-Origin Resource Sharing (CORS)", publisher: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS", official: true },
  ],
  en: {
    title: "Where do your files go when you convert them online?",
    description: "Most online converters upload your file to their servers. How to tell, what to check before dropping a sensitive document, and the offline test.",
    lead: "Most online conversion sites upload your file to their servers, convert it there, keep the result for a while so you can download it, then delete it after a delay that varies from site to site. A growing number of tools work differently and process the file inside the browser tab, so it never leaves your computer. The simplest way to tell them apart: load the page, go offline, and see whether the tool still works.",
    sections: [
      {
        h: "What happens on a typical conversion site",
        blocks: [
          { p: "The classic model has four steps. Your file is uploaded to the site's server. A program converts it there. The result is stored long enough for you to download it. Then both files are deleted, after an hour, a day, or whatever the site has decided." },
          { p: "Nothing in this model is dishonest. Converting a video or a Word document used to require software that no browser could run, so sending the file to a server was the only option. But it means a copy of your file existed, at least for a while, on a machine you don't control, run by a company you may know nothing about, sometimes in another country." },
          { p: "For a picture of a sunset, that hardly matters. The question becomes real with the files people convert most often in everyday life: scanned ID documents for an application, payslips and tax notices, signed contracts, quotes and invoices, medical results, family photos. These are exactly the documents you wouldn't email to a stranger." },
        ],
      },
      {
        h: "What to check before dropping a file",
        blocks: [
          { p: "You can't audit a server, but a few signals tell you a lot in under a minute." },
          { ul: [
            "Does the site say what happens to uploaded files, and when they're deleted? A clear sentence near the upload area is a minimum. If you can't find one, assume the worst.",
            "Who runs it? A legal notice with a company name and a country is more reassuring than a site with no contact page.",
            "How does it make money? A page covered in ads lives from traffic; a paid plan with a free tier has an obvious model. Neither proves anything, but a site with no visible model deserves more caution.",
            "Does it ask for an email address to send you the result? That's rarely necessary, and often a way to build a mailing list.",
            "Does it need an account for a one-off task? Accounts link your files to your identity.",
          ] },
          { p: "None of these checks is decisive on its own. Together, they separate a service that thought about your data from one that didn't." },
        ],
      },
      {
        h: "Processing in the browser",
        blocks: [
          { p: "Browsers have changed. They can now draw and re-encode images with the Canvas API, compute checksums with the Web Crypto API, and run compiled programs through WebAssembly, which is how a full audio and video converter like FFmpeg can work inside a tab. Libraries such as pdf-lib and PDF.js read, assemble and render PDF files without any server." },
          { p: "With this approach, the file is read from your disk into the page's memory, processed there, and the result is offered as a download. The site only sends you the code of the tool, like any web page. Your document stays on your machine." },
          { p: "That's how most utilisio tools work: [merging PDFs](/t/pdf-merge), [converting images](/t/image-converter), [shrinking a photo to a target size](/t/compress-to-kb), [computing a hash](/t/hash-generator) or [converting audio](/t/audio-converter) all happen in the tab." },
        ],
      },
      {
        h: "The offline test",
        blocks: [
          { p: "Here's a check anyone can do, with no technical knowledge." },
          { ol: [
            "Open the tool's page and let it load completely.",
            "Turn off your connection: airplane mode, or unplug the network.",
            "Use the tool with a test file.",
            "If you get a result, the processing happened on your computer.",
          ] },
          { p: "The test has one limit. Some tools load a large component the first time you use them: the FFmpeg engine behind audio and video conversion is about 25 MB, fetched on demand so the page stays light. Run the tool once while online, then try again offline. If it still works, nothing is being sent." },
          { p: "For developers, the Network tab of the browser's developer tools gives a more precise answer: use the tool and check whether a request goes out at the moment you drop the file or start the conversion." },
        ],
      },
      {
        h: "The tools that do need a server",
        blocks: [
          { p: "Not everything can run in a browser. For security reasons, a script on one website isn't allowed to read responses from another website unless that site explicitly permits it.[^mdn-cors] That rule protects you every day, but it means a page can't fetch an arbitrary URL and inspect its headers or HTML on its own." },
          { p: "So three utilisio tools go through a server: the [HTTP headers checker](/t/headers-checker), the SEO analyzer and the meta tag preview. They're labeled as network tools in the interface. What they receive is a public URL, not a file, and their results stay in memory for a minute at most. Like any web server, ours keeps standard access logs, which record the IP address and the requested URL." },
          { p: "That's the kind of transparency to look for elsewhere too: a tool that needs a server for a good reason should say which reason, and what it keeps." },
        ],
      },
      {
        h: "A simple rule of thumb",
        blocks: [
          { p: "Sort files into two groups. Public or harmless files can go anywhere. Personal or confidential documents should go only to a tool that processes them locally, or to a service whose terms you've actually read. When in doubt, the offline test settles it in thirty seconds." },
        ],
      },
    ],
    faq: [
      { q: "Do online converters keep my files?", a: "Most upload your file to their servers and delete it after a delay they set themselves, from an hour to several days. Tools that process files in the browser never receive the file at all." },
      { q: "How can I tell if a tool works locally?", a: "Load the page, go offline and use the tool. If it still produces a result, the processing happened on your computer. Tools that download a component on first use need one online run first." },
      { q: "Are my files uploaded when I use utilisio?", a: "Not for file tools: they run in your browser. Only three network tools, which analyze a public URL, go through a server, and they're labeled as such." },
    ],
  },
  fr: {
    title: "Où vont vos fichiers quand vous les convertissez en ligne ?",
    description: "La plupart des convertisseurs en ligne envoient vos fichiers sur leurs serveurs. Comment le savoir, quoi vérifier, et le test de la connexion coupée.",
    lead: "La plupart des sites de conversion en ligne envoient votre fichier sur leurs serveurs, le convertissent là-bas, gardent le résultat le temps que vous le téléchargiez, puis le suppriment après un délai qui varie d'un site à l'autre. De plus en plus d'outils fonctionnent autrement et traitent le fichier dans l'onglet du navigateur : il ne quitte jamais votre ordinateur. Le moyen le plus simple de les distinguer : charger la page, couper la connexion, et voir si l'outil fonctionne encore.",
    sections: [
      {
        h: "Ce qui se passe sur un site de conversion classique",
        blocks: [
          { p: "Le modèle classique tient en quatre étapes. Votre fichier est envoyé sur le serveur du site. Un programme le convertit. Le résultat est stocké le temps que vous le téléchargiez. Puis les deux fichiers sont supprimés, au bout d'une heure, d'un jour, ou de ce que le site a décidé." },
          { p: "Ce modèle n'a rien de malhonnête. Convertir une vidéo ou un document Word demandait autrefois des logiciels qu'aucun navigateur ne pouvait faire tourner : passer par un serveur était la seule solution. Mais cela veut dire qu'une copie de votre fichier a existé, au moins un moment, sur une machine que vous ne contrôlez pas, gérée par une société dont vous ne savez peut-être rien, parfois dans un autre pays." },
          { p: "Pour une photo de coucher de soleil, cela n'a guère d'importance. La question devient réelle avec les fichiers qu'on convertit le plus souvent au quotidien : pièces d'identité scannées pour un dossier, bulletins de salaire et avis d'imposition, contrats signés, devis et factures, résultats médicaux, photos de famille. Ce sont précisément les documents qu'on n'enverrait pas par courriel à un inconnu." },
        ],
      },
      {
        h: "Ce qu'il faut vérifier avant de déposer un fichier",
        blocks: [
          { p: "On ne peut pas inspecter un serveur, mais quelques indices en disent beaucoup en moins d'une minute." },
          { ul: [
            "Le site dit-il ce que deviennent les fichiers envoyés, et quand ils sont supprimés ? Une phrase claire près de la zone de dépôt est un minimum. Si vous n'en trouvez pas, partez du principe le moins favorable.",
            "Qui l'édite ? Des mentions légales avec un nom de société et un pays rassurent davantage qu'un site sans page de contact.",
            "Comment gagne-t-il de l'argent ? Une page couverte de publicités vit de son trafic ; une offre payante avec une version gratuite a un modèle évident. Rien de cela ne prouve quoi que ce soit, mais un site sans modèle visible mérite plus de prudence.",
            "Demande-t-il une adresse électronique pour envoyer le résultat ? C'est rarement nécessaire, et souvent une façon de constituer une liste de contacts.",
            "Exige-t-il un compte pour une tâche ponctuelle ? Un compte relie vos fichiers à votre identité.",
          ] },
          { p: "Aucun de ces indices ne tranche seul. Ensemble, ils séparent un service qui a réfléchi à vos données d'un service qui ne l'a pas fait." },
        ],
      },
      {
        h: "Le traitement dans le navigateur",
        blocks: [
          { p: "Les navigateurs ont changé. Ils savent aujourd'hui dessiner et réencoder des images avec l'API Canvas, calculer des empreintes avec l'API Web Crypto, et exécuter des programmes compilés grâce à WebAssembly : c'est ainsi qu'un convertisseur audio et vidéo complet comme FFmpeg peut fonctionner dans un onglet. Des bibliothèques comme pdf-lib et PDF.js lisent, assemblent et affichent des PDF sans aucun serveur." },
          { p: "Avec cette approche, le fichier est lu depuis votre disque dans la mémoire de la page, traité sur place, et le résultat vous est proposé en téléchargement. Le site ne vous envoie que le code de l'outil, comme n'importe quelle page web. Votre document reste sur votre machine." },
          { p: "C'est ainsi que fonctionnent la plupart des outils d'utilisio : [fusionner des PDF](/t/pdf-merge), [convertir des images](/t/image-converter), [réduire une photo à un poids cible](/t/compress-to-kb), [calculer une empreinte](/t/hash-generator) ou [convertir un fichier audio](/t/audio-converter), tout se passe dans l'onglet." },
        ],
      },
      {
        h: "Le test de la connexion coupée",
        blocks: [
          { p: "Voici une vérification à la portée de tous, sans connaissance technique." },
          { ol: [
            "Ouvrez la page de l'outil et laissez-la se charger entièrement.",
            "Coupez la connexion : mode avion, ou câble réseau débranché.",
            "Utilisez l'outil avec un fichier de test.",
            "Si vous obtenez un résultat, le traitement a eu lieu sur votre ordinateur.",
          ] },
          { p: "Le test a une limite. Certains outils chargent un gros composant à la première utilisation : le moteur FFmpeg des conversions audio et vidéo pèse environ 25 Mo, téléchargé à la demande pour que la page reste légère. Utilisez l'outil une fois connecté, puis recommencez hors ligne. S'il fonctionne encore, rien n'est envoyé." },
          { p: "Pour les développeurs, l'onglet Réseau des outils de développement du navigateur donne une réponse plus précise : utilisez l'outil et regardez si une requête part au moment où vous déposez le fichier ou lancez la conversion." },
        ],
      },
      {
        h: "Les outils qui ont vraiment besoin d'un serveur",
        blocks: [
          { p: "Tout ne peut pas tourner dans un navigateur. Pour des raisons de sécurité, un script d'un site n'a pas le droit de lire les réponses d'un autre site, sauf si celui-ci l'autorise explicitement.[^mdn-cors] Cette règle vous protège tous les jours, mais elle empêche une page d'aller chercher seule une adresse quelconque pour en inspecter les en-têtes ou le HTML." },
          { p: "Trois outils d'utilisio passent donc par un serveur : le [vérificateur d'en-têtes HTTP](/t/headers-checker), l'analyseur SEO et l'aperçu des balises meta. Ils sont signalés comme outils réseau dans l'interface. Ce qu'ils reçoivent est une adresse publique, pas un fichier, et leurs résultats restent au plus une minute en mémoire. Comme tout serveur web, le nôtre conserve des journaux d'accès standard, qui enregistrent l'adresse IP et l'URL demandée." },
          { p: "C'est le niveau de transparence à rechercher ailleurs aussi : un outil qui a besoin d'un serveur pour une bonne raison devrait dire laquelle, et ce qu'il conserve." },
        ],
      },
      {
        h: "Une règle simple",
        blocks: [
          { p: "Rangez vos fichiers en deux groupes. Les fichiers publics ou sans enjeu peuvent aller n'importe où. Les documents personnels ou confidentiels ne devraient aller que vers un outil qui les traite localement, ou vers un service dont vous avez réellement lu les conditions. En cas de doute, le test de la connexion coupée tranche en trente secondes." },
        ],
      },
    ],
    faq: [
      { q: "Les convertisseurs en ligne gardent-ils mes fichiers ?", a: "La plupart envoient votre fichier sur leurs serveurs et le suppriment après un délai qu'ils fixent eux-mêmes, d'une heure à plusieurs jours. Les outils qui traitent les fichiers dans le navigateur ne reçoivent jamais le fichier." },
      { q: "Comment savoir si un outil fonctionne en local ?", a: "Chargez la page, coupez la connexion et utilisez l'outil. S'il produit encore un résultat, le traitement a eu lieu sur votre ordinateur. Les outils qui téléchargent un composant à la première utilisation demandent d'abord un essai connecté." },
      { q: "Mes fichiers sont-ils envoyés quand j'utilise utilisio ?", a: "Pas pour les outils de fichiers : ils tournent dans votre navigateur. Seuls trois outils réseau, qui analysent une adresse publique, passent par un serveur, et ils sont signalés comme tels." },
    ],
  },
};
