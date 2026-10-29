import type { Guide } from "../guides";

export const GUIDE_ONE_PDF_APPLICATION: Guide = {
  slug: "one-pdf-application",
  published: "2026-10-29",
  updated: "2026-10-29",
  tools: ["pdf-merge", "pdf-converter", "image-compressor", "compress-to-kb"],
  sources: [
    { id: "gmail-limit", title: "Send attachments with your Gmail message", publisher: "Gmail Help", url: "https://support.google.com/mail/answer/6584?hl=en", official: true },
    { id: "service-public-location", title: "Futur locataire d'un logement privé : justificatifs à donner au propriétaire", publisher: "Service-Public.fr", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F1169", official: true },
  ],
  en: {
    title: "How to send an application as one clean PDF",
    description: "Turn scans, photos and PDFs into one ordered, lightweight PDF for a rental, job or school application: scanning, converting, merging and file size.",
    lead: "A clean application is a single PDF with the documents in the order requested, every page the right way up, a size that fits in an email, and a clear file name. To get there: scan or photograph each document properly, convert the photos to PDF, merge everything in the requested order, check the size, then read the result as the recipient will. None of it requires paid software.",
    sections: [
      {
        h: "Why one file makes a difference",
        blocks: [
          { p: "Rental, job and school applications almost always ask for a set of documents: ID, proof of income, certificates, a cover letter, a résumé. They usually arrive as a dozen attachments named `IMG_4521.jpg`, `scan0003.pdf` or `Document (2).pdf`." },
          { p: "For the person receiving them, that's a chore: open each file, guess what it is, rotate the sideways ones, look for the missing piece. Someone who receives thirty applications in a week reads the easy ones first. The content is the same; the impression isn't." },
          { p: "A clean application is a single PDF, two at most; documents in the order of the listing or the form; every page the right way up; a size that passes through any mailbox; and a file name that says what it is, such as `Rental-application-Claire-Martin.pdf`." },
        ],
      },
      {
        h: "Step 1: scan or photograph properly",
        blocks: [
          { p: "Start by writing down the list of requested documents, in the order given. That list is your table of contents." },
          { p: "For paper documents, a phone is enough. The scanning feature built into most phones, in the notes app or the file manager, straightens the page, crops the edges and boosts contrast. It usually does better than a plain photo. If you do take a photo, a few habits help:" },
          { ul: [
            "Lay the document flat on a dark surface, so its edges stand out.",
            "Hold the phone parallel to the page, directly above it, to avoid a trapezoid shape.",
            "Use even daylight and avoid the shadow of your hand or phone.",
            "Photograph each page separately, filling the frame.",
          ] },
          { p: "Black-and-white or grayscale scans are perfectly readable for text documents and much lighter than color. Keep color for documents where it carries information, such as an ID card." },
        ],
      },
      {
        h: "Step 2: convert photos to PDF",
        blocks: [
          { p: "You now have a mix of JPEG or HEIC photos, PDFs downloaded from your bank or employer, and maybe screenshots. Only PDFs can be merged, so the images need converting first." },
          { p: "The [PDF converter](/t/pdf-converter) turns one or several images into a PDF, one page per image, and the dedicated pages for [JPG to PDF](/convert/jpg-to-pdf) and [HEIC to PDF](/convert/heic-to-pdf) cover the most common cases, including iPhone photos. This is also the moment to check that every page is the right way up." },
          { p: "If a photo is very heavy, shrink it before converting: a phone photo can weigh several megabytes, and the PDF will weigh at least as much. A width of about 1,600 pixels keeps an A4 page readable when printed. The [image compressor](/t/image-compressor) does this without visible loss." },
        ],
      },
      {
        h: "Step 3: merge in the requested order",
        blocks: [
          { p: "Next, combine all the PDFs into one, following your list. When a document has several pages, such as three payslips, keep them together and in chronological order." },
          { p: "A habit that saves time: number the files before adding them, for example `1-id.pdf`, `2-payslips.pdf`, `3-tax-notice.pdf`. They then arrive in the right order without any rearranging." },
          { p: "The [PDF merge tool](/t/pdf-merge) shows the page count and size of each file, lets you move them with arrows, and produces a single file. Pages are copied as they are, without being re-encoded, so text stays selectable and quality doesn't change. Two things don't survive a merge: electronic signatures, which are tied to the exact bytes of the original file, and fillable form fields. Send a signed document as a separate attachment if its signature must remain verifiable." },
          { p: "A first page listing the contents is appreciated and takes two minutes: a simple list of the documents, in order." },
        ],
      },
      {
        h: "Step 4: check the size",
        blocks: [
          { p: "Many email services cap attachments. Gmail, for example, limits a personal account to 25 MB per message.[^gmail-limit] Fifteen pages scanned in color at high resolution can exceed that easily." },
          { p: "If the file is too heavy, shrinking the merged PDF afterwards rarely works well. It's more effective to go back to the images: reduce their dimensions, switch text documents to grayscale, then convert and merge again. When an online form sets a limit per document, such as 2 MB or 500 KB, the [compress to KB tool](/t/compress-to-kb) adjusts an image to fit under a precise target." },
        ],
      },
      {
        h: "Step 5: read it as the recipient will",
        blocks: [
          { p: "Open the final file and scroll through it from start to finish, as the person receiving it will. A page upside down, a document cut off at the edge, a missing payslip, an unreadable photo: now is the time to catch them, not after the email has gone." },
          { p: "Then rename the file clearly and send it." },
        ],
      },
      {
        h: "Sensitive documents",
        blocks: [
          { p: "An application gathers your most personal data: identity, income, address, sometimes bank details. Two precautions." },
          { p: "First, choose tools that process files in your browser rather than sites that upload them to their servers. utilisio's PDF and image tools work this way: the files never leave your computer." },
          { p: "Second, send only what's requested. In France, the documents a landlord may ask from a future tenant are listed by decree, and the landlord may not require others.[^service-public-location] Other countries have their own rules; check them before handing over extra documents." },
        ],
      },
    ],
    faq: [
      { q: "How do I combine several PDFs into one?", a: "Drop them into a PDF merge tool, put them in the order you want and download the result. utilisio's merge tool does this in the browser, without uploading the files." },
      { q: "How do I add a phone photo to a PDF application?", a: "Convert the photo to PDF first, with a JPG or HEIC to PDF converter, then merge it with the other documents. Shrink very heavy photos before converting." },
      { q: "My application PDF is too big to email. What can I do?", a: "Go back to the images: reduce their dimensions, use grayscale for text documents, then convert and merge again. That works better than compressing the final PDF." },
    ],
  },
  fr: {
    title: "Envoyer un dossier en un seul PDF propre",
    description: "Transformer scans, photos et PDF en un seul fichier ordonné et léger pour un dossier de location, de candidature ou d'inscription, étape par étape.",
    lead: "Un dossier propre, c'est un seul PDF, avec les pièces dans l'ordre demandé, toutes les pages dans le bon sens, un poids qui passe par courriel et un nom de fichier clair. Pour y arriver : numériser ou photographier correctement chaque document, convertir les photos en PDF, tout assembler dans l'ordre demandé, vérifier le poids, puis relire le résultat comme le destinataire. Rien de tout cela ne demande de logiciel payant.",
    sections: [
      {
        h: "Pourquoi un seul fichier change tout",
        blocks: [
          { p: "Un dossier de location, de candidature ou d'inscription demande presque toujours une série de pièces : pièce d'identité, justificatifs de revenus, attestations, lettre de motivation, CV. Elles arrivent en général sous forme d'une douzaine de pièces jointes nommées `IMG_4521.jpg`, `scan0003.pdf` ou `Document (2).pdf`." },
          { p: "Pour la personne qui les reçoit, c'est une corvée : ouvrir chaque fichier, deviner ce qu'il contient, tourner ceux qui sont à l'envers, chercher la pièce qui manque. Quelqu'un qui reçoit trente dossiers dans la semaine lit d'abord les plus simples. Le contenu est le même ; l'impression ne l'est pas." },
          { p: "Un dossier propre, c'est un seul PDF, deux au maximum ; les pièces dans l'ordre de l'annonce ou du formulaire ; toutes les pages dans le bon sens ; un poids qui passe dans n'importe quelle boîte de réception ; et un nom de fichier explicite, comme `Dossier-location-Martin-Claire.pdf`." },
        ],
      },
      {
        h: "Étape 1 : numériser ou photographier correctement",
        blocks: [
          { p: "Commencez par noter la liste des pièces demandées, dans l'ordre indiqué. Cette liste sera votre sommaire." },
          { p: "Pour les documents papier, un téléphone suffit. La fonction de numérisation intégrée à la plupart des téléphones, dans l'application de notes ou le gestionnaire de fichiers, redresse la page, recadre les bords et renforce le contraste. Elle fait généralement mieux qu'une simple photo. Si vous prenez une photo, quelques réflexes aident :" },
          { ul: [
            "Posez le document à plat sur une surface sombre, pour que ses bords se détachent.",
            "Tenez le téléphone parallèle à la page, juste au-dessus, pour éviter l'effet trapèze.",
            "Préférez une lumière du jour uniforme, sans l'ombre de la main ou du téléphone.",
            "Photographiez chaque page séparément, en remplissant le cadre.",
          ] },
          { p: "Pour un document texte, une numérisation en noir et blanc ou en niveaux de gris reste parfaitement lisible et pèse beaucoup moins lourd qu'en couleur. Gardez la couleur pour les documents où elle porte une information, comme une carte d'identité." },
        ],
      },
      {
        h: "Étape 2 : convertir les photos en PDF",
        blocks: [
          { p: "Vous avez maintenant un mélange de photos JPEG ou HEIC, de PDF téléchargés depuis votre banque ou votre employeur, et peut-être de captures d'écran. Seuls des PDF peuvent être assemblés : il faut d'abord convertir les images." },
          { p: "Le [convertisseur PDF](/t/pdf-converter) transforme une ou plusieurs images en PDF, une page par image, et les pages dédiées [JPG vers PDF](/convert/jpg-to-pdf) et [HEIC vers PDF](/convert/heic-to-pdf) couvrent les cas les plus courants, y compris les photos d'iPhone. C'est aussi le moment de vérifier que chaque page est dans le bon sens." },
          { p: "Si une photo est très lourde, réduisez-la avant de la convertir : une photo de téléphone peut peser plusieurs mégaoctets, et le PDF pèsera au moins autant. Une largeur d'environ 1 600 pixels garde une page A4 lisible à l'impression. Le [compresseur d'images](/t/image-compressor) le fait sans perte visible." },
        ],
      },
      {
        h: "Étape 3 : assembler dans l'ordre demandé",
        blocks: [
          { p: "Ensuite, fusionnez tous les PDF en un seul, en suivant votre liste. Quand une pièce compte plusieurs pages, comme trois bulletins de salaire, gardez-les ensemble et dans l'ordre chronologique." },
          { p: "Une habitude qui fait gagner du temps : numérotez les fichiers avant de les ajouter, par exemple `1-piece-identite.pdf`, `2-bulletins-salaire.pdf`, `3-avis-imposition.pdf`. Ils arrivent alors dans le bon ordre sans rien déplacer." },
          { p: "L'outil de [fusion de PDF](/t/pdf-merge) affiche le nombre de pages et le poids de chaque fichier, permet de les déplacer avec des flèches et produit un seul fichier. Les pages sont copiées telles quelles, sans être réencodées : le texte reste sélectionnable et la qualité ne change pas. Deux choses ne survivent pas à la fusion : les signatures électroniques, liées aux octets exacts du fichier d'origine, et les champs de formulaire à remplir. Envoyez un document signé en pièce jointe séparée si sa signature doit rester vérifiable." },
          { p: "Une première page qui liste le contenu est appréciée et prend deux minutes : une simple liste des pièces, dans l'ordre." },
        ],
      },
      {
        h: "Étape 4 : vérifier le poids",
        blocks: [
          { p: "Beaucoup de messageries limitent la taille des pièces jointes. Gmail, par exemple, plafonne un compte personnel à 25 Mo par message.[^gmail-limit] Quinze pages numérisées en couleur à haute résolution dépassent facilement cette limite." },
          { p: "Si le fichier est trop lourd, compresser le PDF assemblé après coup donne rarement de bons résultats. Il est plus efficace de revenir aux images : réduire leurs dimensions, passer les documents texte en niveaux de gris, puis convertir et assembler à nouveau. Quand un formulaire en ligne impose une limite par pièce, comme 2 Mo ou 500 Ko, l'outil [réduire une image à X Ko](/t/compress-to-kb) ajuste une image pour passer sous une cible précise." },
        ],
      },
      {
        h: "Étape 5 : relire comme le destinataire",
        blocks: [
          { p: "Ouvrez le fichier final et parcourez-le du début à la fin, comme le fera la personne qui le reçoit. Une page à l'envers, un document coupé au bord, un bulletin manquant, une photo illisible : c'est maintenant qu'il faut les repérer, pas une fois le courriel parti." },
          { p: "Renommez ensuite le fichier clairement, et envoyez-le." },
        ],
      },
      {
        h: "Les documents sensibles",
        blocks: [
          { p: "Un dossier rassemble vos données les plus personnelles : identité, revenus, adresse, parfois coordonnées bancaires. Deux précautions." },
          { p: "D'abord, choisissez des outils qui traitent les fichiers dans votre navigateur plutôt que des sites qui les envoient sur leurs serveurs. Les outils PDF et image d'utilisio fonctionnent ainsi : les fichiers ne quittent jamais votre ordinateur." },
          { p: "Ensuite, n'envoyez que ce qui est demandé. En France, les pièces qu'un propriétaire peut demander à un futur locataire sont fixées par décret, et il ne peut pas en exiger d'autres.[^service-public-location] La liste à jour figure sur Service-Public.fr." },
        ],
      },
    ],
    faq: [
      { q: "Comment rassembler plusieurs PDF en un seul ?", a: "Déposez-les dans un outil de fusion de PDF, mettez-les dans l'ordre voulu et téléchargez le résultat. L'outil de fusion d'utilisio le fait dans le navigateur, sans envoyer les fichiers." },
      { q: "Comment ajouter une photo prise au téléphone à un dossier PDF ?", a: "Convertissez d'abord la photo en PDF, avec un convertisseur JPG ou HEIC vers PDF, puis fusionnez-la avec les autres pièces. Réduisez les photos très lourdes avant la conversion." },
      { q: "Mon dossier PDF est trop lourd pour être envoyé par courriel, que faire ?", a: "Revenez aux images : réduisez leurs dimensions, passez les documents texte en niveaux de gris, puis convertissez et assemblez à nouveau. C'est plus efficace que de compresser le PDF final." },
    ],
  },
};
