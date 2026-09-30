import type { Localized } from "./types";

/**
 * Meta descriptions des pages /convert/* (120–155 car., vérifiées par
 * __tests__/catalog/convert-seo.test.ts). `pair.why` reste le texte d'ouverture
 * de la page : trop long pour une meta, Google le tronquait.
 */
export const CONVERT_META: Record<string, Localized> = {
  /* ── Paires image ── */
  "jpg-to-webp": {
    en: "Convert JPG to WebP in your browser and cut file size by roughly a quarter to a third at similar quality. Faster pages, no upload, free.",
    fr: "Convertissez un JPG en WebP dans le navigateur et gagnez environ un quart à un tiers de poids à qualité comparable. Pages plus rapides, sans envoi.",
  },
  "jpg-to-png": {
    en: "Convert JPG to PNG to stop quality loss: PNG is lossless, so you can edit and re-save the image as often as you like. Free, runs in your browser.",
    fr: "Convertissez un JPG en PNG pour stopper la perte de qualité : le PNG est sans perte, retouchez et réenregistrez à volonté. Gratuit, dans le navigateur.",
  },
  "png-to-webp": {
    en: "Convert PNG to WebP online, free: screenshots and graphics get much lighter and keep transparency. Nothing uploaded, it all runs in your browser.",
    fr: "Convertir un PNG en WebP en ligne, gratuitement : captures et graphiques bien plus légers, transparence conservée. Aucun envoi, tout reste chez vous.",
  },
  "png-to-jpg": {
    en: "Convert a photo saved as PNG to JPG and shrink it several times over: JPG compression is built for photos. Free, no upload, in your browser.",
    fr: "Convertissez une photo enregistrée en PNG vers le JPG et divisez son poids par plusieurs fois : le JPG est fait pour la photo. Gratuit, sans envoi.",
  },
  "webp-to-jpg": {
    en: "Convert WebP to JPG when an app, email client or upload form refuses WebP. JPG opens everywhere. Free, no signup, conversion stays in your browser.",
    fr: "Convertissez un WebP en JPG quand un logiciel, un client mail ou un formulaire refuse le WebP. Le JPG s'ouvre partout. Gratuit, dans votre navigateur.",
  },
  "webp-to-png": {
    en: "Convert WebP to PNG online, free: a lossless file that keeps transparency and opens in any editor or document. Nothing uploaded, runs in your browser.",
    fr: "Convertir un WebP en PNG en ligne, gratuitement : fichier sans perte, transparence conservée, lisible partout. Aucun envoi, tout reste dans le navigateur.",
  },
  "avif-to-jpg": {
    en: "Many apps still can't open AVIF. Convert AVIF to JPG in your browser and get a file that works everywhere, without installing any software.",
    fr: "Beaucoup d'applications n'ouvrent pas encore l'AVIF. Convertissez un AVIF en JPG dans le navigateur, lisible partout, sans rien installer.",
  },
  "avif-to-png": {
    en: "Convert AVIF to PNG for a lossless copy that keeps transparency and opens in any editor or document. Free, no upload, done in your browser.",
    fr: "Convertissez un AVIF en PNG pour une copie sans perte qui garde la transparence et s'ouvre dans tout éditeur. Gratuit, sans envoi, dans le navigateur.",
  },

  "heic-to-jpg": {
    en: "Convert one or many iPhone HEIC photos to JPG, downloaded as a single ZIP. Free, no limit, decoded in your browser: your photos are never uploaded.",
    fr: "Convertissez une ou plusieurs photos HEIC d'iPhone en JPG, réunies dans un ZIP. Gratuit, sans limite, décodé dans le navigateur, sans aucun envoi.",
  },
  "heic-to-png": {
    en: "Convert an iPhone HEIC photo to a lossless PNG that any image editor can open, ready for retouching. Free, decoded in your browser, nothing uploaded.",
    fr: "Convertissez une photo HEIC d'iPhone en PNG sans perte, lisible par tout éditeur d'images et prêt à retoucher. Gratuit, décodé dans le navigateur.",
  },

  /* ── Paires PDF ── */
  "pdf-to-png": {
    en: "Convert every page of a PDF to a sharp, lossless PNG, ideal for diagrams, screenshots and fine text. Choose 1×, 2× or 3× scale. No upload.",
    fr: "Convertissez chaque page d'un PDF en PNG net et sans perte, idéal pour schémas, captures et texte fin. Échelle 1×, 2× ou 3× au choix. Sans envoi.",
  },
  "pdf-to-jpg": {
    en: "Convert PDF pages to light JPG images for slides, a web gallery or an email attachment. Rendered in your browser with PDF.js, nothing uploaded.",
    fr: "Convertissez les pages d'un PDF en images JPG légères pour une présentation, une galerie web ou un e-mail. Rendu dans le navigateur, rien n'est envoyé.",
  },
  "jpg-to-pdf": {
    en: "Combine one or more JPG photos or scanned pages into a single PDF that opens the same everywhere. One image per page, built in your browser.",
    fr: "Regroupez une ou plusieurs photos JPG ou pages scannées en un seul PDF qui s'ouvre partout à l'identique. Une image par page, créé dans le navigateur.",
  },
  "png-to-pdf": {
    en: "Turn PNG screenshots, diagrams or scans into one PDF without losing quality: one file to send instead of several. Free, runs in your browser.",
    fr: "Transformez captures, schémas ou scans PNG en un seul PDF sans perte de qualité : un fichier à envoyer au lieu de plusieurs. Gratuit, dans le navigateur.",
  },
  "webp-to-pdf": {
    en: "Convert WebP images saved from the web into a PDF for a report, an application or an archive. Decoded by your browser, one image per page.",
    fr: "Convertissez des images WebP récupérées sur le web en PDF pour un rapport, une candidature ou une archive. Décodées par le navigateur, une par page.",
  },
  "avif-to-pdf": {
    en: "Convert AVIF images straight into one shareable PDF using your browser's built-in AVIF decoder. Free, no software to install, nothing uploaded.",
    fr: "Convertissez des images AVIF directement en un seul PDF partageable grâce au décodeur AVIF du navigateur. Gratuit, rien à installer, aucun envoi.",
  },
  "heic-to-pdf": {
    en: "Gather several iPhone HEIC photos into a single PDF, one photo per page: ideal for photographed documents. Free, decoded in your browser, no upload.",
    fr: "Rassemblez plusieurs photos HEIC d'iPhone en un seul PDF, une photo par page : idéal pour des documents photographiés. Gratuit, sans envoi.",
  },
};

/**
 * Balises <title> dédiées, pour les paires dont Search Console montre des
 * requêtes plus longues que « Convertir X en Y » (« … en ligne », « gratuit »).
 * Le H1 reste pairTitle() ; sans entrée ici, le <title> aussi.
 */
export const CONVERT_TITLE: Record<string, Localized> = {
  "heic-to-jpg": {
    en: "Convert HEIC to JPG free, online, no upload",
    fr: "Convertir HEIC en JPG gratuit, en ligne, sans envoi",
  },
  "heic-to-pdf": {
    en: "Convert HEIC to PDF free: several photos, one file",
    fr: "Convertir HEIC en PDF gratuit : plusieurs photos, un PDF",
  },
  "png-to-webp": {
    en: "Convert PNG to WebP online, free, no upload",
    fr: "Convertir PNG en WebP en ligne, gratuit et sans envoi",
  },
  "webp-to-png": {
    en: "Convert WebP to PNG online, free, no upload",
    fr: "Convertir WebP en PNG en ligne, gratuit et sans envoi",
  },
};
