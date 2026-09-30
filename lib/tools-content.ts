import type { Lang } from "./types";

/** Section de fond : un sous-titre et ses paragraphes. */
export interface ContentSection {
  h: Record<Lang, string>;
  p: Record<Lang, string[]>;
}

export interface ToolContent {
  desc: Record<Lang, string>;
  useCases: Record<Lang, string[]>;
  /**
   * Contenu de fond : fonctionnement réel, référence de format, pièges courants,
   * limites assumées. C'est la partie qui distingue une page outil d'une simple
   * fiche produit — et ce que Google attend d'une page qui affiche de la
   * publicité. Optionnel : les outils qui n'en ont pas encore gardent l'ancienne
   * structure.
   */
  deepDive?: ContentSection[];
}

export const TOOLS_CONTENT: Partial<Record<string, ToolContent>> = {
  "json-formatter": {
    desc: {
      en: "Paste JSON and get it back indented and validated as you type. When the JSON is broken, the tool gives the line and column of the first error and names the likely cause: a trailing comma, single quotes, a comment, a key without quotes. Large integers such as API IDs are kept digit for digit, duplicate keys are flagged, and you can sort keys, minify or pick 2, 4 or 8 spaces or tabs. Nothing is sent anywhere.",
      fr: "Collez du JSON et récupérez-le indenté et validé à mesure que vous tapez. Quand le JSON est cassé, l'outil donne la ligne et la colonne de la première erreur et nomme la cause probable : virgule finale, apostrophes, commentaire, clé sans guillemets. Les grands entiers comme les identifiants d'API sont conservés au chiffre près, les clés en double sont signalées, et vous pouvez trier les clés, minifier ou choisir 2, 4 ou 8 espaces ou des tabulations. Rien n'est envoyé nulle part.",
    },
    useCases: {
      en: ["Reading a minified API response or webhook body without scrolling through a single 20,000-character line", "Finding the character that breaks a package.json, composer.json or config file after a manual edit", "Sorting keys before comparing two API responses, so the diff only shows real changes", "Checking that a payload is valid JSON before sending it to an API or storing it"],
      fr: ["Lire une réponse d'API ou un corps de webhook minifié sans faire défiler une ligne unique de 20 000 caractères", "Trouver le caractère qui casse un package.json, un composer.json ou un fichier de config après une modification à la main", "Trier les clés avant de comparer deux réponses d'API, pour que le diff ne montre que les vrais changements", "Vérifier qu'un payload est du JSON valide avant de l'envoyer à une API ou de le stocker"],
    },
    deepDive: [
      {
        h: { en: "Finding the error, and naming it", fr: "Trouver l'erreur, et la nommer" },
        p: {
          en: [
            "Browsers don't agree on how to report a JSON error. Chrome gives a line and column for some mistakes and not for others: for [1, 2,] it only says \"Unexpected token ']'\". Safari usually gives no position at all. So the tool reads the text itself and reports the line and column of the first problem, in every browser, along with what it most likely is.",
            "Nearly every broken JSON comes from something that's valid in JavaScript but not in JSON. A trailing comma after the last item. Single quotes instead of double quotes. A key without quotes, typical of an object copied from source code. A comment. Or undefined and NaN, which appear when a JavaScript object is copied from the console. Each has its own message, so you know what to change, not only where.",
            "One subtle case: a line break typed inside a string. It looks harmless in an editor, but JSON strings can't contain raw line breaks or tabs; they must be written \\n and \\t.",
          ],
          fr: [
            "Les navigateurs ne s'accordent pas sur la façon de signaler une erreur JSON. Chrome donne une ligne et une colonne pour certaines fautes et pas pour d'autres : pour [1, 2,], il dit seulement « Unexpected token ']' ». Safari ne donne en général aucune position. L'outil lit donc le texte lui-même et indique la ligne et la colonne du premier problème, dans tous les navigateurs, avec ce qu'il est le plus probablement.",
            "Presque tous les JSON cassés viennent d'une chose valide en JavaScript mais pas en JSON. Une virgule après le dernier élément. Des apostrophes au lieu de guillemets doubles. Une clé sans guillemets, typique d'un objet copié depuis du code. Un commentaire. Ou undefined et NaN, qui apparaissent quand on copie un objet JavaScript depuis la console. Chacun a son propre message : vous savez quoi changer, pas seulement où.",
            "Un cas plus discret : un retour à la ligne tapé à l'intérieur d'une chaîne. Il paraît anodin dans un éditeur, mais une chaîne JSON ne peut pas contenir de retour à la ligne ni de tabulation bruts ; il faut les écrire \\n et \\t.",
          ],
        },
      },
      {
        h: { en: "Long IDs: the number that silently changes", fr: "Les longs identifiants : le nombre qui change en silence" },
        p: {
          en: [
            "JavaScript stores every number as a 64-bit float, which holds integers exactly only up to 9,007,199,254,740,991. Beyond that, JSON.parse rounds. Paste {\"id\": 1234567890123456789} into most online formatters, or into your browser's console, and you get back 1234567890123456800. The formatting worked; the data didn't survive.",
            "That matters because many APIs hand out 64-bit IDs: social networks, chat platforms, databases with large sequences. This formatter reads those numbers as text before parsing and puts the original digits back in the output, then tells you how many it protected.",
            "It can't fix your own code, though. Any JavaScript that calls JSON.parse on that response will round the ID the same way. That's why some APIs send the ID twice, as a number and as a string, the way Twitter's API provides id_str next to id. If you design the API, send long IDs as strings.",
          ],
          fr: [
            "JavaScript stocke tous les nombres en flottants 64 bits, qui ne représentent exactement les entiers que jusqu'à 9 007 199 254 740 991. Au-delà, JSON.parse arrondit. Collez {\"id\": 1234567890123456789} dans la plupart des formateurs en ligne, ou dans la console du navigateur, et vous récupérez 1234567890123456800. La mise en forme a marché ; la donnée, elle, n'a pas survécu.",
            "C'est important parce que beaucoup d'API distribuent des identifiants 64 bits : réseaux sociaux, messageries, bases de données aux grandes séquences. Ce formateur lit ces nombres comme du texte avant l'analyse, remet les chiffres d'origine dans le résultat, puis indique combien il en a protégé.",
            "Il ne peut pas corriger votre propre code pour autant. Tout JavaScript qui appelle JSON.parse sur cette réponse arrondira l'identifiant de la même façon. C'est pour ça que certaines API envoient l'identifiant deux fois, en nombre et en chaîne, comme l'API de Twitter fournit id_str à côté de id. Si vous concevez l'API, envoyez les longs identifiants en chaînes.",
          ],
        },
      },
      {
        h: { en: "Duplicate keys and sorted keys", fr: "Clés en double et clés triées" },
        p: {
          en: [
            "The JSON standard, RFC 8259, says keys in an object should be unique, but doesn't forbid duplicates, and parsers handle them differently. JavaScript keeps the last value and drops the others without a word. The formatter follows the same rule, so it lists each duplicate key with its path: a hand-edited config file with two \"port\" entries is exactly the bug you want to see.",
            "Sort keys orders the keys of every object alphabetically, at every level, and leaves arrays in their original order, since the order of items in an array carries meaning. It's the quickest way to compare two responses from the same API: sort both, then any difference you see is a real one, not a key that moved.",
          ],
          fr: [
            "Le standard JSON, la RFC 8259, dit que les clés d'un objet devraient être uniques, sans interdire les doublons, et les analyseurs ne les traitent pas tous pareil. JavaScript garde la dernière valeur et abandonne les autres sans un mot. Le formateur suit la même règle, donc il liste chaque clé en double avec son chemin : un fichier de config modifié à la main avec deux entrées \"port\" est exactement le bug qu'on veut voir.",
            "Le tri des clés range par ordre alphabétique les clés de chaque objet, à tous les niveaux, et laisse les tableaux dans leur ordre d'origine, puisque l'ordre des éléments d'un tableau a un sens. C'est le moyen le plus rapide de comparer deux réponses d'une même API : triez les deux, et chaque différence visible est une vraie différence, pas une clé qui a changé de place.",
          ],
        },
      },
      {
        h: { en: "Config files: package.json, composer.json, tsconfig.json", fr: "Fichiers de config : package.json, composer.json, tsconfig.json" },
        p: {
          en: [
            "package.json and composer.json are strict JSON: a trailing comma left after deleting a dependency is enough for npm or Composer to refuse the whole file. Paste the file here and the error points at that comma.",
            "tsconfig.json and VS Code's settings.json are different. They accept comments and trailing commas, a relaxed format often called JSONC. The formatter follows strict JSON, so it will flag a comment in them as an error. That's correct for JSON, not a problem in your tsconfig: don't strip comments from a file that is allowed to have them.",
          ],
          fr: [
            "package.json et composer.json sont du JSON strict : une virgule oubliée après la suppression d'une dépendance suffit pour que npm ou Composer refusent le fichier entier. Collez-le ici, et l'erreur pointe cette virgule.",
            "tsconfig.json et le settings.json de VS Code sont différents. Ils acceptent commentaires et virgules finales, un format assoupli souvent appelé JSONC. Le formateur suit le JSON strict et signalera donc un commentaire comme une erreur. C'est juste pour du JSON, et ce n'est pas un problème dans votre tsconfig : ne retirez pas les commentaires d'un fichier qui a le droit d'en avoir.",
          ],
        },
      },
      {
        h: { en: "Size and privacy", fr: "Taille et confidentialité" },
        p: {
          en: [
            "Everything happens in the page: the JSON never leaves your browser, which matters when a response carries tokens or customer data. In our test, a 4.6 MB file with 40,000 records and 40,000 long IDs was read, checked and formatted in under a tenth of a second on a recent laptop. The editor becomes the slower part on very large files, when scrolling through hundreds of thousands of lines.",
          ],
          fr: [
            "Tout se passe dans la page : le JSON ne quitte jamais votre navigateur, ce qui compte quand une réponse contient des jetons ou des données clients. Lors de notre test, un fichier de 4,6 Mo avec 40 000 enregistrements et 40 000 longs identifiants a été lu, vérifié et mis en forme en moins d'un dixième de seconde sur un ordinateur portable récent. Sur de très gros fichiers, c'est l'éditeur qui devient la partie lente, quand on fait défiler des centaines de milliers de lignes.",
          ],
        },
      },
    ],
  },
  "image-converter": {
    desc: {
      en: "Drop an image, choose WebP, JPG or PNG, and download the converted file. You can cap the width at 1920, 1280 or 800 pixels, keeping the proportions, and set the quality to 80, 90 or 100 for JPG and WebP. The tool reads JPG, PNG, WebP, AVIF, GIF and BMP, shows the size gained or lost compared with the original, and does everything in your browser: the file is never uploaded.",
      fr: "Déposez une image, choisissez WebP, JPG ou PNG, et téléchargez le fichier converti. Vous pouvez limiter la largeur à 1920, 1280 ou 800 pixels, proportions conservées, et régler la qualité à 80, 90 ou 100 pour le JPG et le WebP. L'outil lit le JPG, le PNG, le WebP, l'AVIF, le GIF et le BMP, affiche le poids gagné ou perdu par rapport à l'original, et fait tout dans votre navigateur : le fichier n'est jamais envoyé.",
    },
    useCases: {
      en: ["Turning the images of a site you're building into WebP, at the width they're actually displayed, before uploading them", "Converting the heavy PNG photos a client sends into lighter JPG or WebP files", "Getting a JPG out of a WebP or AVIF image downloaded from the web, for software that can't open it", "Removing the location and camera data stored in a photo before publishing it"],
      fr: ["Passer en WebP les images d'un site en cours de création, à la largeur où elles s'affichent vraiment, avant de les mettre en ligne", "Convertir en JPG ou WebP plus légers les photos PNG très lourdes envoyées par un client", "Obtenir un JPG à partir d'une image WebP ou AVIF téléchargée, pour un logiciel qui ne sait pas l'ouvrir", "Retirer les données de localisation et d'appareil photo contenues dans une photo avant de la publier"],
    },
    deepDive: [
      {
        h: { en: "Which format to choose", fr: "Quel format choisir" },
        p: {
          en: [
            "For photos on a website, WebP is the default choice: at quality 80 it's usually a good deal lighter than the same JPG and every current browser displays it. Keep JPG when the file will leave the web, attached to an email, dropped into an office document or sent to a print shop, because JPG opens everywhere.",
            "PNG is for screenshots, logos, diagrams and anything with sharp edges, text or transparency. It's lossless, so there's no quality setting, and that's also its trap: converting a photo to PNG almost always makes the file bigger, sometimes several times bigger. The tool shows it honestly, with a +% in orange instead of a −% in green.",
            "What the tool can't produce is AVIF. Browsers can read AVIF, so you can drop one in and get a JPG or PNG out, but they don't expose an AVIF encoder to web pages, so it isn't offered as an output.",
          ],
          fr: [
            "Pour les photos d'un site web, le WebP est le choix par défaut : en qualité 80, il est en général nettement plus léger que le même JPG, et tous les navigateurs actuels l'affichent. Gardez le JPG quand le fichier sort du web, joint à un e-mail, glissé dans un document bureautique ou envoyé à un imprimeur, car le JPG s'ouvre partout.",
            "Le PNG sert aux captures d'écran, logos, schémas et à tout ce qui a des bords nets, du texte ou de la transparence. Il est sans perte, donc sans réglage de qualité, et c'est aussi son piège : convertir une photo en PNG donne presque toujours un fichier plus lourd, parfois plusieurs fois plus lourd. L'outil l'affiche franchement, avec un +% en orange au lieu d'un −% en vert.",
            "Ce que l'outil ne sait pas produire, c'est de l'AVIF. Les navigateurs savent lire l'AVIF, donc vous pouvez en déposer un et récupérer un JPG ou un PNG, mais ils ne donnent pas accès à un encodeur AVIF aux pages web : ce format n'est donc pas proposé en sortie.",
          ],
        },
      },
      {
        h: { en: "Width first, quality second", fr: "La largeur d'abord, la qualité ensuite" },
        p: {
          en: [
            "A 4000-pixel photo straight from a phone, displayed 800 pixels wide on a page, carries about 25 times more pixels than the page shows. No quality setting fixes that. Reduce the width first; the quality slider is for fine-tuning afterwards.",
            "The rule of thumb for sharp images on high-density screens is twice the display width. An image shown 640 pixels wide in the layout wants a 1280-pixel file; a full-width hero on a large screen, 1920. The tool only ever scales down: a 700-pixel image stays at 700 even if you pick 1280, because enlarging adds weight without adding detail.",
            "For quality, 80 is the sensible start for photos in WebP or JPG. Go to 90 for images with fine textures or gradients that show banding, and keep 100 for masters you'll edit again, not for publishing.",
          ],
          fr: [
            "Une photo de 4000 pixels sortie d'un téléphone, affichée sur 800 pixels de large dans une page, porte environ 25 fois plus de pixels que ce que la page montre. Aucun réglage de qualité ne corrige ça. Réduisez d'abord la largeur ; la qualité sert ensuite à affiner.",
            "La règle pour des images nettes sur les écrans haute densité : deux fois la largeur d'affichage. Une image affichée sur 640 pixels dans la mise en page demande un fichier de 1280 ; une image pleine largeur sur grand écran, 1920. L'outil ne fait que réduire : une image de 700 pixels reste à 700 même si vous choisissez 1280, car agrandir ajoute du poids sans ajouter de détail.",
            "Côté qualité, 80 est le bon départ pour des photos en WebP ou en JPG. Montez à 90 pour les textures fines ou les dégradés qui font apparaître des bandes, et gardez 100 pour des originaux que vous retoucherez, pas pour publier.",
          ],
        },
      },
      {
        h: { en: "What happens to the file along the way", fr: "Ce qui arrive au fichier en chemin" },
        p: {
          en: [
            "The image is drawn onto a canvas in your browser and re-encoded from its pixels. Everything that isn't pixels stays behind, including the EXIF metadata: GPS position, phone model, date taken. That's a useful side effect before publishing a photo, and a reason to keep your original if you need that data later.",
            "Transparent areas become white when you export to JPG, since JPG has no transparency. An animated GIF comes out as a single still image. Photos taken sideways keep the orientation you see on screen, because the browser applies the rotation stored in the file before drawing it.",
          ],
          fr: [
            "L'image est dessinée sur un canvas dans votre navigateur puis réencodée à partir de ses pixels. Tout ce qui n'est pas pixel reste en route, y compris les métadonnées EXIF : position GPS, modèle de téléphone, date de prise de vue. C'est un effet utile avant de publier une photo, et une raison de garder l'original si vous avez besoin de ces données plus tard.",
            "Les zones transparentes deviennent blanches à l'export en JPG, puisque le JPG n'a pas de transparence. Un GIF animé ressort en une seule image fixe. Les photos prises de côté gardent l'orientation que vous voyez à l'écran, car le navigateur applique la rotation enregistrée dans le fichier avant de la dessiner.",
          ],
        },
      },
      {
        h: { en: "Files from clients: the HEIC case", fr: "Les fichiers de clients : le cas du HEIC" },
        p: {
          en: [
            "Client folders are where the odd formats turn up: 12 MB PNG screenshots of photos, WebP images saved from a website, and iPhone photos in HEIC. All three convert here. HEIC needs one extra step behind the scenes: apart from Safari, browsers can't read it, so the first time you drop a HEIC file the tool downloads a decoder, libheif compiled to WebAssembly (about 3 MB), and decodes the photo inside the tab. The file still never leaves your computer.",
            "For a steady flow of photos, fixing it upstream still saves time. Ask the client to send the photos from the iPhone as JPG, or to switch the camera to Most Compatible in the iPhone's Camera settings, under Formats. For a one-off batch, the HEIC to JPG and HEIC to PDF pages do the job directly.",
          ],
          fr: [
            "C'est dans les dossiers des clients que surgissent les formats inattendus : captures PNG de 12 Mo qui sont en fait des photos, images WebP enregistrées depuis un site, et photos d'iPhone en HEIC. Les trois se convertissent ici. Le HEIC demande une étape de plus en coulisse : à part Safari, les navigateurs ne savent pas le lire, donc au premier fichier HEIC déposé, l'outil télécharge un décodeur, libheif compilé en WebAssembly (environ 3 Mo), et décode la photo dans l'onglet. Le fichier ne quitte toujours pas votre ordinateur.",
            "Pour un flux régulier de photos, régler le problème en amont reste plus rapide. Demandez au client d'envoyer les photos de l'iPhone en JPG, ou de passer l'appareil photo en « Le plus compatible » dans les réglages Appareil photo de l'iPhone, rubrique Formats. Pour un lot ponctuel, les pages HEIC vers JPG et HEIC vers PDF font le travail directement.",
          ],
        },
      },
    ],
  },
  "pdf-converter": {
    desc: {
      en: "Two modes, both running entirely in your browser. PDF to images turns each page of a PDF into a PNG or JPEG file at 1×, 2× or 3× scale. Images to PDF does the reverse: it puts JPG, PNG or other images your browser can open into a single PDF, one image per page. Pages are rendered with PDF.js, the engine behind Firefox's built-in PDF viewer, and PDFs are assembled with pdf-lib. This tool makes page images and PDFs, not editable Word or Excel files.",
      fr: "Deux modes, tous deux exécutés entièrement dans votre navigateur. PDF vers images transforme chaque page d'un PDF en fichier PNG ou JPEG, à l'échelle 1×, 2× ou 3×. Images vers PDF fait l'inverse : il place des JPG, des PNG ou d'autres images que votre navigateur sait ouvrir dans un seul PDF, une image par page. Les pages sont rendues avec PDF.js, le moteur de la visionneuse PDF intégrée à Firefox, et les PDF sont assemblés avec pdf-lib. L'outil produit des images de pages et des PDF, pas des fichiers Word ou Excel modifiables.",
    },
    useCases: {
      en: ["Turning phone photos of a signed form, a receipt or an ID into one PDF to send", "Extracting a page of a PDF as an image for a presentation, a website or a social post", "Making a high-resolution image of a plan or a brochure page for printing", "Assembling several scanned pages saved as JPG into a single document"],
      fr: ["Transformer des photos prises au téléphone d'un formulaire signé, d'un ticket ou d'une pièce d'identité en un seul PDF à envoyer", "Extraire une page d'un PDF en image pour une présentation, un site ou une publication sur les réseaux", "Obtenir une image haute résolution d'un plan ou d'une page de brochure pour l'impression", "Assembler plusieurs pages scannées enregistrées en JPG en un seul document"],
    },
    deepDive: [
      {
        h: { en: "PDF to images: choosing the scale", fr: "PDF vers images : choisir l'échelle" },
        p: {
          en: [
            "PDF pages are measured in points, 72 to the inch, so the scale sets the resolution. At 1× a page is rendered at 72 dots per inch, at 2× at 144 and at 3× at 216. An A4 page comes out at about 595 pixels wide at 1×, 1190 at 2× and 1786 at 3×.",
            "2× suits screens, slides and web pages: sharp on high-density displays without huge files. 3× is the choice for printing or zooming into a plan. It stays below the 300 dots per inch of professional print, so for a large print run, ask for the original PDF rather than an image of it.",
            "PNG keeps text and line drawings perfectly crisp and is the right format for documents. JPEG makes much lighter files for pages that are mostly photos, at the cost of slight blur around letters. The tool converts every page of the file; for a single page, download only that one from the list.",
          ],
          fr: [
            "Les pages PDF se mesurent en points, 72 par pouce : l'échelle fixe donc la résolution. En 1×, une page est rendue à 72 points par pouce, en 2× à 144 et en 3× à 216. Une page A4 ressort à environ 595 pixels de large en 1×, 1190 en 2× et 1786 en 3×.",
            "2× convient aux écrans, aux diapositives et aux pages web : net sur les écrans haute densité sans fichiers énormes. 3× est le choix pour imprimer ou zoomer dans un plan. Il reste sous les 300 points par pouce de l'impression professionnelle : pour un vrai tirage, demandez le PDF d'origine plutôt qu'une image.",
            "Le PNG garde le texte et les traits parfaitement nets et convient aux documents. Le JPEG donne des fichiers bien plus légers pour les pages surtout composées de photos, au prix d'un léger flou autour des lettres. L'outil convertit toutes les pages du fichier ; pour une seule page, téléchargez seulement celle-ci dans la liste.",
          ],
        },
      },
      {
        h: { en: "Images to PDF: photos of documents", fr: "Images vers PDF : les photos de documents" },
        p: {
          en: [
            "Each image becomes one page, in the order you added the files, and the page takes the size of the image: one pixel becomes one point. A 4032-pixel-wide phone photo therefore makes a page about 142 cm wide. It prints correctly with fit to page, but it looks enormous in a viewer and weighs as much as the photo.",
            "For documents photographed with a phone, crop and straighten the photos first, then reduce them to about 1600 pixels wide with the image converter: the text stays readable and the PDF becomes several times lighter, which matters when an administration's upload form caps files at a few megabytes.",
            "JPG images are embedded as they are, without recompression. PNG images are embedded losslessly. Other formats your browser can open, such as WebP or AVIF, are converted to PNG before being added.",
          ],
          fr: [
            "Chaque image devient une page, dans l'ordre où vous avez ajouté les fichiers, et la page prend la taille de l'image : un pixel devient un point. Une photo de téléphone de 4032 pixels de large donne donc une page d'environ 142 cm. Elle s'imprime correctement en ajustant à la page, mais paraît énorme dans une visionneuse et pèse autant que la photo.",
            "Pour des documents photographiés au téléphone, recadrez et redressez d'abord les photos, puis réduisez-les à environ 1600 pixels de large avec le convertisseur d'images : le texte reste lisible et le PDF devient plusieurs fois plus léger, ce qui compte quand le formulaire d'envoi d'une administration limite les fichiers à quelques mégaoctets.",
            "Les images JPG sont intégrées telles quelles, sans recompression. Les PNG sont intégrés sans perte. Les autres formats que votre navigateur sait ouvrir, comme le WebP ou l'AVIF, sont convertis en PNG avant d'être ajoutés.",
          ],
        },
      },
      {
        h: { en: "What this tool doesn't do", fr: "Ce que cet outil ne fait pas" },
        p: {
          en: [
            "It doesn't turn a PDF into an editable Word or Excel file. That requires extracting the text and rebuilding the layout, or recognizing it from the image with OCR for scans, which is a different kind of tool. The images produced here are pictures of the pages: you can't select or edit their text.",
            "It can't open a PDF protected by a password. You'll get a clear message; if you're allowed to, open the file in your PDF reader with the password, save a copy without protection, and use that copy. To combine several existing PDFs, use the PDF merge tool, which copies pages without turning them into images.",
          ],
          fr: [
            "Il ne transforme pas un PDF en fichier Word ou Excel modifiable. Cela demande d'extraire le texte et de reconstruire la mise en page, ou de le reconnaître sur l'image par OCR pour un scan : c'est un autre type d'outil. Les images produites ici sont des photos des pages : on ne peut ni sélectionner ni modifier leur texte.",
            "Il ne peut pas ouvrir un PDF protégé par un mot de passe. Vous obtiendrez un message clair ; si vous en avez le droit, ouvrez le fichier dans votre lecteur PDF avec le mot de passe, enregistrez une copie sans protection et utilisez cette copie. Pour réunir plusieurs PDF existants, utilisez l'outil de fusion de PDF, qui copie les pages sans les transformer en images.",
          ],
        },
      },
      {
        h: { en: "Nothing leaves your computer", fr: "Rien ne quitte votre ordinateur" },
        p: {
          en: [
            "The PDF is read and rendered by code running in your tab, and the images or the PDF you download are created there too. The rendering engine is served by this site itself, so a conversion makes no request to any third party. That makes it suitable for payslips, tax notices or identity documents.",
            "Download all saves one file per page. With a long document, your browser may ask once for permission to download several files: accept it, or download the pages you need one by one.",
          ],
          fr: [
            "Le PDF est lu et rendu par du code qui tourne dans votre onglet, et les images ou le PDF téléchargés y sont créés aussi. Le moteur de rendu est servi par ce site lui-même : une conversion n'envoie aucune requête à un tiers. L'outil convient donc aux fiches de paie, avis d'imposition ou pièces d'identité.",
            "Tout télécharger enregistre un fichier par page. Sur un long document, votre navigateur peut demander une fois l'autorisation de télécharger plusieurs fichiers : acceptez-la, ou téléchargez une à une les pages utiles.",
          ],
        },
      },
    ],
  },
  "audio-converter": {
    desc: {
      en: "Convert between MP3, AAC, OGG, WAV, FLAC and M4A entirely in your browser using FFmpeg compiled to WebAssembly, with a target bitrate from 64 kbps to 320 kbps for the lossy formats. No file size limits beyond your available RAM. The first conversion loads the FFmpeg engine (~20 MB), subsequent conversions in the same session are near-instant.",
      fr: "Convertissez entre MP3, AAC, OGG, WAV, FLAC et M4A entièrement dans votre navigateur grâce à FFmpeg compilé en WebAssembly, avec un débit cible de 64 à 320 kbps pour les formats avec perte. Aucune limite de taille au-delà de votre RAM disponible. La première conversion charge le moteur FFmpeg (~20 Mo), les suivantes dans la même session sont quasi instantanées.",
    },
    useCases: {
      en: ["Converting WAV recordings to MP3 for sharing or streaming", "Converting FLAC albums to AAC for Apple device compatibility", "Converting OGG audio from games or apps to a more portable format", "Preparing audio files for podcast upload platforms that require specific formats"],
      fr: ["Convertir des enregistrements WAV en MP3 pour le partage ou le streaming", "Convertir des albums FLAC en AAC pour la compatibilité avec les appareils Apple", "Convertir de l'audio OGG en format plus portable", "Préparer des fichiers audio pour des plateformes de podcast nécessitant un format spécifique"],
    },
    deepDive: [
      {
        h: { en: "Why the first conversion is slow and the rest are not", fr: "Pourquoi la première conversion est lente et les suivantes non" },
        p: {
          en: [
          "The conversion runs FFmpeg compiled to WebAssembly, which means the entire engine, around twenty megabytes, has to be downloaded and instantiated before the first file can be processed. Once it is in memory it stays there for the session, so subsequent conversions start immediately.",
          "The upside of that cost is that nothing is uploaded. Your file never leaves the machine, there is no queue, no size limit imposed by a server, and no copy sitting in someone else's storage afterwards. The ceiling is your available memory rather than an upload quota.",
          ],
          fr: [
          "La conversion fait tourner FFmpeg compilé en WebAssembly : le moteur entier, une vingtaine de mégaoctets, doit donc être téléchargé et instancié avant que le premier fichier puisse être traité. Une fois en mémoire, il y reste pour la session, et les conversions suivantes démarrent immédiatement.",
          "La contrepartie de ce coût, c'est qu'aucun envoi n'a lieu. Votre fichier ne quitte jamais la machine, il n'y a ni file d'attente, ni limite de taille imposée par un serveur, ni copie qui subsiste ensuite dans le stockage d'un tiers. Le plafond est votre mémoire disponible plutôt qu'un quota d'envoi.",
          ],
        },
      },
      {
        h: { en: "Every lossy re-encode costs quality", fr: "Chaque ré-encodage avec perte coûte de la qualité" },
        p: {
          en: [
          "MP3, AAC and OGG are lossy: they discard detail judged inaudible and cannot get it back. Converting from one to another decodes the first approximation and throws away more on top of it, so quality degrades even when you raise the bitrate, a 320 kbps file made from a 128 kbps source is a larger file, not a better one.",
          "WAV and FLAC are the exception. WAV stores the samples uncompressed and FLAC compresses them without loss, so converting between those two, or from either into a lossy format, loses nothing beyond what the target format inherently discards. Whenever you have the lossless original, convert from it rather than from an intermediate.",
          ],
          fr: [
          "Le MP3, l'AAC et l'OGG sont des formats avec perte : ils écartent des détails jugés inaudibles et ne peuvent pas les restituer. Convertir de l'un vers l'autre décode la première approximation puis en écarte davantage : la qualité se dégrade même en augmentant le débit, un fichier à 320 kbps issu d'une source à 128 kbps est un fichier plus lourd, pas meilleur.",
          "Le WAV et le FLAC font exception. Le WAV stocke les échantillons sans compression et le FLAC les compresse sans perte : convertir entre ces deux-là, ou de l'un vers un format avec perte, ne coûte rien au-delà de ce que le format cible écarte par nature. Chaque fois que vous disposez de l'original sans perte, partez de lui plutôt que d'un intermédiaire.",
          ],
        },
      },
      {
        h: { en: "Choosing a bitrate", fr: "Choisir un débit" },
        p: {
          en: [
          "For music, 192 kbps is where most listeners stop hearing a difference from the source on ordinary equipment, and 256 or 320 kbps buys headroom for archiving or for material you may re-encode later. Below 128 kbps, artefacts become audible on cymbals and applause first.",
          "Speech is far more forgiving: a podcast or a voice memo remains perfectly clear at 64 to 96 kbps, and the smaller file is worth more than the inaudible difference. The bitrate setting applies to the lossy formats only, WAV ignores it entirely, and FLAC determines its own size from the content.",
          ],
          fr: [
          "Pour de la musique, 192 kbps est le point où la plupart des auditeurs cessent d'entendre une différence avec la source sur un équipement ordinaire, et 256 ou 320 kbps offrent une marge pour l'archivage ou pour un matériau que vous pourriez ré-encoder plus tard. En dessous de 128 kbps, les artefacts s'entendent d'abord sur les cymbales et les applaudissements.",
          "La parole est bien plus tolérante : un podcast ou un mémo vocal reste parfaitement clair entre 64 et 96 kbps, et le fichier plus léger vaut mieux que la différence inaudible. Le réglage de débit ne concerne que les formats avec perte, le WAV l'ignore entièrement, et le FLAC détermine sa taille d'après le contenu.",
          ],
        },
      },
    ],
  },
  "video-converter": {
    desc: {
      en: "The Video Converter re-encodes video between MP4, WebM, MOV, AVI and MKV, and turns short clips into animated GIFs, powered by FFmpeg compiled to WebAssembly and running entirely in your browser. Output resolution can be scaled down to 1080p, 720p, 480p or 360p, or left at the source size. Processing stays on your device, with no file size cap beyond your available RAM.",
      fr: "Le convertisseur vidéo ré-encode des vidéos entre MP4, WebM, MOV, AVI et MKV, et transforme de courts clips en GIF animés, propulsé par FFmpeg compilé en WebAssembly et s'exécutant entièrement dans votre navigateur. La résolution de sortie peut être réduite à 1080p, 720p, 480p ou 360p, ou conservée telle quelle. Le traitement reste sur votre appareil, sans limite de taille au-delà de votre RAM disponible.",
    },
    useCases: {
      en: ["Converting MP4 to WebM for HTML5 <video> elements", "Creating GIFs from short video clips for documentation or social media", "Shrinking a screen recording to 720p before attaching it to a ticket", "Converting MOV files from iPhone to MP4 for broader compatibility"],
      fr: ["Convertir MP4 en WebM pour les éléments <video> HTML5", "Créer des GIF depuis de courts clips vidéo pour de la documentation ou les réseaux sociaux", "Réduire une capture d'écran vidéo en 720p avant de la joindre à un ticket", "Convertir des fichiers MOV depuis iPhone en MP4 pour une meilleure compatibilité"],
    },
    deepDive: [
      {
        h: { en: "Container and codec are not the same thing", fr: "Le conteneur et le codec ne sont pas la même chose" },
        p: {
          en: [
          "MP4, WebM, MOV, AVI and MKV are containers: envelopes holding a video stream, one or more audio streams and metadata. The codec is what actually compresses the picture inside. That distinction explains why a file plays on one device and not another even though the extension is familiar, the container opened, the codec was unsupported.",
          "It also explains why changing container is sometimes nearly free and sometimes expensive. Moving the same streams into a different envelope is quick; re-encoding the picture for a codec the target container supports is where the time goes.",
          ],
          fr: [
          "MP4, WebM, MOV, AVI et MKV sont des conteneurs : des enveloppes contenant un flux vidéo, un ou plusieurs flux audio et des métadonnées. Le codec, lui, est ce qui compresse effectivement l'image à l'intérieur. Cette distinction explique qu'un fichier se lise sur un appareil et pas sur un autre malgré une extension familière, le conteneur s'est ouvert, le codec n'était pas supporté.",
          "Elle explique aussi qu'un changement de conteneur soit tantôt quasi gratuit, tantôt coûteux. Déplacer les mêmes flux dans une autre enveloppe est rapide ; ré-encoder l'image pour un codec que le conteneur cible accepte est ce qui prend du temps.",
          ],
        },
      },
      {
        h: { en: "GIF is a terrible video format, and sometimes the right one", fr: "Le GIF est un mauvais format vidéo, et parfois le bon" },
        p: {
          en: [
          "A GIF has no audio, is limited to 256 colours per frame, and compresses far worse than any video codec, a three-second clip that weighs 200 kB as MP4 routinely exceeds several megabytes as GIF. On gradients and film footage the colour limit shows as visible banding.",
          "It survives because it plays everywhere without a player, loops on its own, and can be pasted into contexts that reject video outright: issue trackers, chat clients, email. For a short interface demonstration those properties usually outweigh the file size. For anything longer than a few seconds, a muted looping video is the better answer.",
          ],
          fr: [
          "Un GIF n'a pas de son, se limite à 256 couleurs par image, et compresse bien plus mal que n'importe quel codec vidéo, un clip de trois secondes pesant 200 ko en MP4 dépasse couramment plusieurs mégaoctets en GIF. Sur des dégradés ou des prises de vue réelles, la limite de couleurs se voit sous forme de bandes.",
          "Il survit parce qu'il se lit partout sans lecteur, boucle tout seul, et se colle dans des contextes qui refusent la vidéo : gestionnaires de tickets, messageries, e-mails. Pour une courte démonstration d'interface, ces propriétés l'emportent généralement sur le poids. Au-delà de quelques secondes, une vidéo muette en boucle reste la meilleure réponse.",
          ],
        },
      },
      {
        h: { en: "What running in the browser costs", fr: "Ce que coûte l'exécution dans le navigateur" },
        p: {
          en: [
          "Video encoding is the heaviest thing this site does. FFmpeg runs here as WebAssembly on the CPU, without the hardware acceleration a desktop application would use, so expect a long clip to take minutes rather than seconds, and expect a laptop fan to notice.",
          "Memory is the real limit: the file is held in RAM rather than streamed from disk, so a large source can exhaust the tab on a modest machine. Reducing the output resolution before converting helps on both counts, and a file of more than a few hundred megabytes is better handled by a desktop tool.",
          ],
          fr: [
          "L'encodage vidéo est l'opération la plus lourde de ce site. FFmpeg s'exécute ici en WebAssembly sur le processeur, sans l'accélération matérielle qu'utiliserait une application de bureau : attendez-vous à des minutes plutôt qu'à des secondes sur un long clip, et à ce que le ventilateur d'un portable s'en aperçoive.",
          "La mémoire est la vraie limite : le fichier est gardé en RAM plutôt que lu en flux depuis le disque, si bien qu'une source volumineuse peut épuiser l'onglet sur une machine modeste. Réduire la résolution de sortie avant de convertir aide sur les deux plans, et un fichier de plusieurs centaines de mégaoctets se traite mieux avec un outil de bureau.",
          ],
        },
      },
    ],
  },
  "pdf-merge": {
    desc: {
      en: "Drop two or more PDF files, set their order with the up and down arrows, and download a single merged PDF. The list shows each file's page count and size before you merge. Everything runs in your browser with the pdf-lib library, so invoices, contracts and ID documents never leave your computer.",
      fr: "Déposez deux PDF ou plus, réglez leur ordre avec les flèches haut et bas, et téléchargez un seul PDF fusionné. La liste affiche le nombre de pages et le poids de chaque fichier avant la fusion. Tout se passe dans votre navigateur avec la bibliothèque pdf-lib : factures, contrats et pièces d'identité ne quittent jamais votre ordinateur.",
    },
    useCases: {
      en: ["Putting together an application file (ID, payslips, proof of address) as one PDF, in the order the recipient asks for", "Grouping a month of invoices or receipts into a single file for your accountant", "Adding annexes and a cover page to a quote or a contract before sending it", "Combining scanned pages, once converted to PDF, into one document"],
      fr: ["Constituer un dossier (pièce d'identité, fiches de paie, justificatif de domicile) en un seul PDF, dans l'ordre demandé par le destinataire", "Regrouper un mois de factures ou de justificatifs en un seul fichier pour le comptable", "Ajouter les annexes et une page de garde à un devis ou un contrat avant de l'envoyer", "Réunir des pages scannées, une fois converties en PDF, en un seul document"],
    },
    deepDive: [
      {
        h: { en: "What merging keeps", fr: "Ce que la fusion conserve" },
        p: {
          en: [
            "The pages are copied as they are, not redrawn. Text stays selectable and searchable, vector drawings stay sharp at any zoom, and images aren't compressed again, so there's no quality loss. The merged file weighs roughly the sum of the files you put in; merging doesn't make anything smaller.",
            "The order is the order of the list. Files are added in the order you drop or select them, then the arrows move a file up or down. A habit that saves time on long files: name the documents 01-, 02-, 03- before adding them, so they arrive already sorted.",
          ],
          fr: [
            "Les pages sont copiées telles quelles, pas redessinées. Le texte reste sélectionnable et consultable par recherche, les dessins vectoriels restent nets à tous les zooms, et les images ne sont pas recompressées : aucune perte de qualité. Le fichier fusionné pèse à peu près la somme des fichiers ajoutés ; la fusion ne réduit rien.",
            "L'ordre est celui de la liste. Les fichiers s'ajoutent dans l'ordre où vous les déposez ou les sélectionnez, puis les flèches déplacent un fichier vers le haut ou le bas. Une habitude qui fait gagner du temps sur un gros dossier : nommez les documents 01-, 02-, 03- avant de les ajouter, pour qu'ils arrivent déjà triés.",
          ],
        },
      },
      {
        h: { en: "What doesn't survive a merge", fr: "Ce qui ne survit pas à la fusion" },
        p: {
          en: [
            "A digital signature. An electronically signed contract carries a signature tied to the exact bytes of that file. Once its pages are copied into a new document, the signature is no longer valid, even though the page still shows the signature image. If a signed document has to stay verifiable, send it as a separate attachment instead of merging it.",
            "Bookmarks and fillable forms. The side-panel outline of each source file isn't carried over, and form fields may stop being editable in the merged file. Fill in and flatten forms before merging, or keep them apart. Document properties such as title and author aren't kept either.",
          ],
          fr: [
            "La signature électronique. Un contrat signé électroniquement porte une signature liée aux octets exacts de ce fichier. Dès que ses pages sont copiées dans un nouveau document, la signature n'est plus valide, même si la page affiche toujours l'image de la signature. Si un document signé doit rester vérifiable, envoyez-le en pièce jointe séparée plutôt que de le fusionner.",
            "Les signets et les formulaires à remplir. Le sommaire du panneau latéral de chaque fichier n'est pas repris, et les champs de formulaire peuvent ne plus être modifiables dans le fichier fusionné. Remplissez et aplatissez les formulaires avant la fusion, ou gardez-les à part. Les propriétés du document, comme le titre et l'auteur, ne sont pas conservées non plus.",
          ],
        },
      },
      {
        h: { en: "Scans, photos and file size", fr: "Scans, photos et poids du fichier" },
        p: {
          en: [
            "The tool merges PDFs only. For a photo of a document taken with a phone, or a scan saved as JPG or PNG, convert it to PDF first with the JPG to PDF or PNG to PDF converter, then add the result here.",
            "Scans are where file size gets out of hand. A page scanned at high resolution in color can weigh several megabytes, and a twenty-page file quickly passes the 25 MB attachment limit of services like Gmail. Reduce the images before turning them into PDF (a width of about 1600 pixels keeps a printed A4 page readable), rather than trying to shrink the merged PDF afterwards.",
          ],
          fr: [
            "L'outil fusionne uniquement des PDF. Pour la photo d'un document prise au téléphone, ou un scan enregistré en JPG ou en PNG, convertissez-le d'abord en PDF avec le convertisseur JPG vers PDF ou PNG vers PDF, puis ajoutez le résultat ici.",
            "C'est avec les scans que le poids s'envole. Une page scannée en couleur à haute résolution peut peser plusieurs mégaoctets, et un dossier de vingt pages dépasse vite la limite de 25 Mo des pièces jointes de services comme Gmail. Réduisez les images avant d'en faire un PDF (une largeur d'environ 1600 pixels garde une page A4 imprimée lisible), plutôt que d'essayer d'alléger le PDF fusionné après coup.",
          ],
        },
      },
      {
        h: { en: "Protected or damaged files", fr: "Fichiers protégés ou endommagés" },
        p: {
          en: [
            "A PDF protected by a password can't be opened by the tool, and neither can a damaged file. It shows up in the list with a dash instead of a page count, and if you try to merge, the error names the file at fault so you can remove it and merge the rest.",
            "If you're allowed to remove the protection, open the file with its password in your PDF reader and save or print it to a new PDF without a password, then add that copy. Bank and tax statements are often protected this way.",
          ],
          fr: [
            "Un PDF protégé par mot de passe ne peut pas être ouvert par l'outil, pas plus qu'un fichier endommagé. Il apparaît dans la liste avec un tiret à la place du nombre de pages, et si vous lancez la fusion, le message d'erreur nomme le fichier en cause pour que vous puissiez le retirer et fusionner les autres.",
            "Si vous avez le droit de retirer la protection, ouvrez le fichier avec son mot de passe dans votre lecteur PDF, puis enregistrez-le ou imprimez-le vers un nouveau PDF sans mot de passe, et ajoutez cette copie. Les relevés bancaires et les avis d'impôt sont souvent protégés de cette façon.",
          ],
        },
      },
    ],
  },
  "qr-generator": {
    desc: {
      en: "Type a link or some text, or switch to Wi-Fi mode and enter a network name and password, and the QR code appears as you type. Download it as SVG for print or PNG for screens, at 128, 256 or 512 pixels, with one of the four error-correction levels. The code is generated in your browser, contains exactly what you typed, and has no tracking or expiry date.",
      fr: "Tapez un lien ou un texte, ou passez en mode Wi-Fi et saisissez le nom du réseau et le mot de passe : le QR code apparaît à mesure que vous tapez. Téléchargez-le en SVG pour l'impression ou en PNG pour l'écran, en 128, 256 ou 512 pixels, avec l'un des quatre niveaux de correction d'erreur. Le code est généré dans votre navigateur, contient exactement ce que vous avez tapé, et n'a ni suivi ni date d'expiration.",
    },
    useCases: {
      en: ["Printing a QR code on a business card, flyer, poster or restaurant menu that points to a website or a booking page", "Letting guests join the Wi-Fi by scanning a code on the wall instead of typing a long password", "Showing a link on a presentation slide or a screen so people can open it on their phone", "Putting a link to a manual or warranty page on product packaging"],
      fr: ["Imprimer un QR code sur une carte de visite, un flyer, une affiche ou un menu de restaurant qui mène à un site ou à une page de réservation", "Permettre aux invités de se connecter au Wi-Fi en scannant un code au mur plutôt qu'en tapant un long mot de passe", "Afficher un lien sur une diapositive ou un écran pour que chacun l'ouvre sur son téléphone", "Placer sur un emballage un lien vers la notice ou la page de garantie"],
    },
    deepDive: [
      {
        h: { en: "Printing a QR code that scans at first try", fr: "Imprimer un QR code qui se scanne du premier coup" },
        p: {
          en: [
            "Use the SVG file for anything printed. It's a vector drawing, so the printer or your layout software can scale it to 2 cm or to a poster without blur. PNG is for screens, slides and documents, where 256 or 512 pixels is plenty.",
            "Size depends on distance. A common rule of thumb is a code about one tenth of the scanning distance: 2 to 3 cm on a business card read at arm's length, 10 cm or more on a poster read from a metre away. Below about 2 cm, most phones start to struggle.",
            "Keep the white border. The standard asks for a clear margin of four modules (the small squares) around the code, and the files here include it. When you place the code on a photo or a colored background, don't crop that margin away: it's how the phone finds where the code starts. And keep dark modules on a light background; inverted codes aren't read by every scanner.",
            "Before sending anything to print, scan the final file with two different phones, from the real distance. It takes a minute and saves a print run.",
          ],
          fr: [
            "Utilisez le fichier SVG pour tout ce qui est imprimé. C'est un dessin vectoriel : l'imprimeur ou votre logiciel de mise en page peut le passer à 2 cm ou à la taille d'une affiche sans flou. Le PNG est fait pour les écrans, les diapositives et les documents, où 256 ou 512 pixels suffisent largement.",
            "La taille dépend de la distance. Une règle courante : un code d'environ un dixième de la distance de lecture. 2 à 3 cm sur une carte de visite lue à bout de bras, 10 cm ou plus sur une affiche lue à un mètre. En dessous d'environ 2 cm, la plupart des téléphones commencent à peiner.",
            "Gardez la bordure blanche. La norme demande une marge libre de quatre modules (les petits carrés) autour du code, et les fichiers d'ici l'incluent. Quand vous posez le code sur une photo ou un fond coloré, ne rognez pas cette marge : c'est elle qui permet au téléphone de repérer où commence le code. Et gardez des modules foncés sur fond clair ; les codes inversés ne sont pas lus par tous les lecteurs.",
            "Avant d'envoyer quoi que ce soit à l'impression, scannez le fichier final avec deux téléphones différents, à la vraie distance. Ça prend une minute et évite de refaire un tirage.",
          ],
        },
      },
      {
        h: { en: "Short content, simpler code", fr: "Contenu court, code plus simple" },
        p: {
          en: [
            "Every character you add makes the code denser: more, smaller modules for the same printed size, which are harder to read from a distance or on a crumpled flyer. A long URL full of tracking parameters can easily double the density of a short one. Where you can, point the code to a short, clean address.",
            "Error correction works the other way. The four levels let a code survive damage: L recovers about 7% of the modules, M about 15%, Q about 25% and H about 30%. Higher levels add redundancy, so the code gets denser for the same content. M is a good default; use Q or H for codes printed on surfaces that get scratched or folded, and L when the content is long and the code must stay small. If the content is too long for any QR code, the tool tells you instead of producing an unreadable one.",
          ],
          fr: [
            "Chaque caractère ajouté rend le code plus dense : plus de modules, plus petits, pour la même taille imprimée, donc plus difficiles à lire de loin ou sur un flyer froissé. Une longue URL pleine de paramètres de suivi peut facilement doubler la densité d'une adresse courte. Quand c'est possible, faites pointer le code vers une adresse courte et propre.",
            "La correction d'erreur joue dans l'autre sens. Les quatre niveaux permettent à un code de survivre aux dégâts : L récupère environ 7 % des modules, M environ 15 %, Q environ 25 % et H environ 30 %. Les niveaux élevés ajoutent de la redondance, donc le code devient plus dense pour le même contenu. M est un bon choix par défaut ; prenez Q ou H pour un code imprimé sur une surface qui se raye ou se plie, et L quand le contenu est long et que le code doit rester petit. Si le contenu est trop long pour tout QR code, l'outil vous le dit au lieu de produire un code illisible.",
          ],
        },
      },
      {
        h: { en: "Wi-Fi QR codes", fr: "Les QR codes Wi-Fi" },
        p: {
          en: [
            "In Wi-Fi mode, the tool writes the text that phone cameras recognize as a network: WIFI:T:WPA;S:network name;P:password;;. The camera app on current iPhones and Android phones offers to join the network when it sees it, with no typing.",
            "The detail that breaks homemade Wi-Fi codes is escaping. Semicolons, commas, colons, quotes and backslashes have a meaning in that format, so a password containing one of them must have it preceded by a backslash. Without it, the phone reads a truncated password and the connection fails for no visible reason. The tool adds those backslashes for you. Tick hidden network if your router doesn't broadcast the name.",
            "Keep in mind that the password is written in plain text inside the code: anyone who scans it with a QR reader app can read it. For a waiting room or a rental, point the code at a guest network rather than your main one.",
          ],
          fr: [
            "En mode Wi-Fi, l'outil écrit le texte que les appareils photo des téléphones reconnaissent comme un réseau : WIFI:T:WPA;S:nom du réseau;P:mot de passe;;. L'appareil photo des iPhone et des téléphones Android récents propose de rejoindre le réseau dès qu'il le voit, sans rien taper.",
            "Le détail qui casse les codes Wi-Fi faits maison, c'est l'échappement. Points-virgules, virgules, deux-points, guillemets et antislashs ont un sens dans ce format : un mot de passe qui en contient doit les faire précéder d'un antislash. Sans ça, le téléphone lit un mot de passe tronqué et la connexion échoue sans raison visible. L'outil ajoute ces antislashs pour vous. Cochez réseau masqué si votre box ne diffuse pas le nom.",
            "Gardez à l'esprit que le mot de passe est écrit en clair dans le code : n'importe qui peut le lire en le scannant avec une application de lecture de QR code. Pour une salle d'attente ou une location, faites pointer le code vers un réseau invité plutôt que vers votre réseau principal.",
          ],
        },
      },
      {
        h: { en: "Static codes: what you print is what you get", fr: "Codes statiques : ce que vous imprimez est ce que vous obtenez" },
        p: {
          en: [
            "The codes made here are static: the link or text is written inside the code itself. They don't pass through any server, can't be switched off, don't collect scan statistics and never expire. A code printed today will open the same address in ten years, as long as that address still exists.",
            "Many QR services sell dynamic codes instead: the code contains a short link on their domain that redirects to yours. That lets you change the destination and count scans, but every scan depends on that company, and some deactivate the codes when a subscription ends. If you print thousands of flyers, know which kind you're printing. The flip side of a static code is that a typo in the URL is printed for good, so check the link before you export.",
          ],
          fr: [
            "Les codes créés ici sont statiques : le lien ou le texte est écrit dans le code lui-même. Ils ne passent par aucun serveur, ne peuvent pas être désactivés, ne collectent aucune statistique de scan et n'expirent jamais. Un code imprimé aujourd'hui ouvrira la même adresse dans dix ans, tant que cette adresse existera.",
            "Beaucoup de services de QR codes vendent plutôt des codes dynamiques : le code contient un lien court sur leur domaine, qui redirige vers le vôtre. Cela permet de changer la destination et de compter les scans, mais chaque scan dépend de cette société, et certaines désactivent les codes à la fin d'un abonnement. Si vous imprimez des milliers de flyers, sachez lequel des deux vous imprimez. Le revers d'un code statique : une faute dans l'URL est imprimée pour de bon, alors vérifiez le lien avant d'exporter.",
          ],
        },
      },
    ],
  },
  "base64": {
    desc: {
      en: "Encode text or binary files to Base64, or decode any Base64 string back to its original form. It handles standard Base64 (the alphabet ending in + and /) which is what data URIs, HTTP Basic auth headers and most API payloads use. Text in, text out: paste a string to encode it, or paste a Base64 string to read what it contains.",
      fr: "Encodez du texte ou des fichiers binaires en Base64, ou décodez n'importe quelle chaîne Base64 vers sa forme d'origine. Il gère le Base64 standard (l'alphabet se terminant par + et /) celui qu'utilisent les data URI, les en-têtes d'authentification HTTP Basic et la plupart des charges utiles d'API. Du texte en entrée, du texte en sortie : collez une chaîne pour l'encoder, ou une chaîne Base64 pour lire ce qu'elle contient.",
    },
    useCases: {
      en: ["Decoding a JWT token payload to inspect its claims and expiry", "Embedding a small image as a data URI in HTML, CSS or JSON", "Encoding binary file attachments for email or REST API transmission", "Debugging Base64-encoded values in API responses or config files"],
      fr: ["Décoder un payload JWT pour inspecter ses claims et sa date d'expiration", "Intégrer une petite image en data URI dans du HTML, CSS ou JSON", "Encoder des pièces jointes binaires pour une transmission par e-mail ou API REST", "Déboguer des valeurs Base64 dans des réponses d'API ou des fichiers de config"],
    },
    deepDive: [
      {
        h: { en: "Three bytes in, four characters out", fr: "Trois octets en entrée, quatre caractères en sortie" },
        p: {
          en: [
          "Base64 rewrites arbitrary bytes using only 64 printable characters, so binary data can travel through channels that expect text. It reads the input three bytes at a time, 24 bits, and re-splits those bits into four groups of six, each group naming one character in the alphabet A–Z, a–z, 0–9, plus and slash.",
          "Because four characters carry three bytes, the output is always about 33% larger than the input. When the length is not a multiple of three, the last group is padded with one or two equals signs, which is why so many Base64 strings end that way.",
          ],
          fr: [
          "Le Base64 réécrit des octets quelconques avec seulement 64 caractères imprimables, pour que des données binaires puissent traverser des canaux qui attendent du texte. Il lit l'entrée par groupes de trois octets, 24 bits, et redécoupe ces bits en quatre groupes de six, chaque groupe désignant un caractère de l'alphabet A–Z, a–z, 0–9, plus et barre oblique.",
          "Puisque quatre caractères transportent trois octets, la sortie est toujours environ 33 % plus volumineuse que l'entrée. Quand la longueur n'est pas un multiple de trois, le dernier groupe est complété par un ou deux signes égal, d'où la terminaison si fréquente des chaînes Base64.",
          ],
        },
      },
      {
        h: { en: "Encoding is not encryption", fr: "Encoder n'est pas chiffrer" },
        p: {
          en: [
          "Base64 hides nothing. It is a reversible transformation with no key, and anyone can decode it in a second, including with this page. Treating it as a security measure is a recurring and costly mistake: a password or an API key placed in a Base64 string is exactly as exposed as if it were written in plain text.",
          "Its legitimate purpose is transport. Embedding a small image in a data URI, carrying an attachment through an email protocol designed for text, or fitting a binary payload into a JSON field are all good reasons. Protecting a secret is not one of them.",
          ],
          fr: [
          "Le Base64 ne cache rien. C'est une transformation réversible sans clé, que n'importe qui peut défaire en une seconde, y compris avec cette page. Le prendre pour une mesure de sécurité est une erreur récurrente et coûteuse : un mot de passe ou une clé d'API placés dans une chaîne Base64 sont exactement aussi exposés que s'ils étaient écrits en clair.",
          "Sa vraie raison d'être est le transport. Intégrer une petite image dans un data URI, faire passer une pièce jointe par un protocole de messagerie conçu pour du texte, ou loger une charge binaire dans un champ JSON sont de bons motifs. Protéger un secret n'en est pas un.",
          ],
        },
      },
      {
        h: { en: "The URL-safe variant, and why decoding sometimes fails", fr: "La variante URL-safe, et pourquoi le décodage échoue parfois" },
        p: {
          en: [
          "Standard Base64 uses plus and slash, both of which have a meaning inside a URL. A separate variant replaces them with minus and underscore, and usually drops the padding. JSON Web Tokens use that variant, which is why the three segments of a JWT are not standard Base64.",
          "This tool reads and writes the standard alphabet only. If decoding a token or a URL fragment fails here, that is normally the reason: swap minus back to plus and underscore back to slash first, and the string will decode.",
          ],
          fr: [
          "Le Base64 standard utilise le plus et la barre oblique, deux caractères qui ont un sens dans une URL. Une variante distincte les remplace par le moins et le tiret bas, et supprime généralement le remplissage. Les JSON Web Tokens emploient cette variante : c'est pourquoi les trois segments d'un JWT ne sont pas du Base64 standard.",
          "Cet outil lit et écrit uniquement l'alphabet standard. Si le décodage d'un token ou d'un fragment d'URL échoue ici, c'est normalement la raison : remplacez d'abord les moins par des plus et les tirets bas par des barres obliques, et la chaîne se décodera.",
          ],
        },
      },
    ],
  },
  "markdown-html": {
    desc: {
      en: "Write Markdown on the left, get clean semantic HTML on the right, rendered in real time. Supports CommonMark and GitHub Flavored Markdown including tables, strikethrough, task lists and fenced code blocks. Copy the output or download it as a file to paste into your CMS, email template or static site generator.",
      fr: "Rédigez du Markdown à gauche, obtenez du HTML propre et sémantique à droite, rendu en temps réel. Supporte CommonMark et GitHub Flavored Markdown (GFM), tableaux, texte barré, listes de tâches et blocs de code. Copiez le HTML ou téléchargez-le pour l'utiliser dans votre CMS, modèle d'e-mail ou générateur de site statique.",
    },
    useCases: {
      en: ["Converting README files to HTML for embedding in documentation sites", "Previewing Markdown content before publishing to a CMS or blog platform", "Writing email newsletters in Markdown and exporting to HTML", "Generating HTML snippets from notes written in Markdown editors"],
      fr: ["Convertir des fichiers README en HTML pour des sites de documentation", "Prévisualiser du contenu Markdown avant publication sur un CMS ou blog", "Rédiger des newsletters en Markdown et les exporter en HTML", "Générer des fragments HTML depuis des notes rédigées en Markdown"],
    },
    deepDive: [
      {
        h: { en: "Which flavour of Markdown this is", fr: "De quelle variante de Markdown il s'agit" },
        p: {
          en: [
          "Conversion runs through marked, which implements CommonMark plus the GitHub extensions: tables, task lists, strikethrough and automatic links. That combination is what most people mean by Markdown today, and it matches what GitHub, GitLab and most documentation generators render.",
          "It is worth knowing that the original 2004 Markdown had no specification, which is why renderers disagreed for a decade on edge cases like nested lists and emphasis inside words. CommonMark exists to settle exactly those, so a document that renders here renders the same way in any CommonMark-compliant tool.",
          ],
          fr: [
          "La conversion passe par marked, qui implémente CommonMark plus les extensions GitHub : tableaux, listes de tâches, texte barré et liens automatiques. Cette combinaison correspond à ce que la plupart des gens appellent aujourd'hui Markdown, et à ce que rendent GitHub, GitLab et la plupart des générateurs de documentation.",
          "Il est utile de savoir que le Markdown d'origine, en 2004, n'avait aucune spécification : c'est pourquoi les moteurs de rendu ont divergé pendant une décennie sur des cas limites comme les listes imbriquées ou l'emphase à l'intérieur d'un mot. CommonMark existe précisément pour trancher ceux-là, si bien qu'un document rendu ici se rendra à l'identique dans tout outil conforme.",
          ],
        },
      },
      {
        h: { en: "Raw HTML passes straight through", fr: "Le HTML brut passe tel quel" },
        p: {
          en: [
          "Markdown deliberately allows HTML inline, and it is not filtered on the way out. That is what lets you drop a break tag inside a table cell or wrap a section in a div that Markdown syntax cannot express, but it also means the output is only as safe as the input.",
          "So never render Markdown written by someone else without sanitizing the resulting HTML first. Converting your own README carries no risk; converting a user-submitted comment and injecting the result into a page is a straightforward way to ship a cross-site scripting hole.",
          ],
          fr: [
          "Markdown autorise délibérément le HTML en ligne, et celui-ci n'est pas filtré en sortie. C'est ce qui permet de glisser une balise de saut dans une cellule de tableau ou d'entourer une section d'un div que la syntaxe Markdown ne sait pas exprimer, mais cela signifie aussi que la sortie n'est sûre que dans la mesure où l'entrée l'est.",
          "N'affichez donc jamais du Markdown écrit par un tiers sans assainir au préalable le HTML produit. Convertir votre propre README ne présente aucun risque ; convertir un commentaire soumis par un utilisateur et injecter le résultat dans une page est un moyen direct de livrer une faille de cross-site scripting.",
          ],
        },
      },
      {
        h: { en: "The line-break rule that surprises everyone", fr: "La règle de saut de ligne qui surprend tout le monde" },
        p: {
          en: [
          "A single newline inside a paragraph does not produce a line break in the output. Markdown joins those lines into one paragraph, which is deliberate: it lets you wrap your source at a comfortable width without affecting the rendering. A blank line starts a new paragraph.",
          "To force a break without starting a paragraph, end the line with two spaces, or use a backslash. The two-space convention is invisible in most editors and gets stripped by trailing-whitespace tooling, which is why so many line breaks disappear between writing and publishing.",
          ],
          fr: [
          "Un simple retour à la ligne dans un paragraphe ne produit pas de saut de ligne en sortie. Markdown fusionne ces lignes en un seul paragraphe, et c'est délibéré : cela permet de replier son source à une largeur confortable sans influer sur le rendu. Une ligne vide, elle, démarre un nouveau paragraphe.",
          "Pour forcer un saut sans ouvrir de paragraphe, terminez la ligne par deux espaces, ou utilisez un antislash. La convention des deux espaces est invisible dans la plupart des éditeurs et se fait supprimer par les outils de nettoyage d'espaces en fin de ligne, d'où tant de sauts de ligne qui disparaissent entre l'écriture et la publication.",
          ],
        },
      },
    ],
  },
  "hash-generator": {
    desc: {
      en: "Compute MD5, SHA-1, SHA-256 and SHA-512 fingerprints for any text or file, instantly, using the Web Crypto API in your browser. Use it to verify file integrity after a download, compare files without opening them, or generate content hashes for caching strategies.",
      fr: "Calculez les empreintes MD5, SHA-1, SHA-256 et SHA-512 pour n'importe quel texte ou fichier, instantanément, via la Web Crypto API dans votre navigateur. Vérifiez l'intégrité d'un fichier téléchargé, comparez des fichiers sans les ouvrir, ou générez des hashes de contenu pour la mise en cache.",
    },
    useCases: {
      en: ["Verifying a downloaded file against its published SHA-256 checksum", "Generating a content hash for cache-busting asset URLs", "Drop two versions of a file and compare their hashes, if they match, the files are byte-for-byte identical", "Computing MD5 checksums for legacy systems or upload verification"],
      fr: ["Vérifier un fichier téléchargé face à son checksum SHA-256 publié", "Générer un hash de contenu pour les URL d'assets avec cache-busting", "Déposez deux versions d'un fichier et comparez leurs hashes, s'ils correspondent, les fichiers sont identiques octet par octet", "Calculer des checksums MD5 pour des systèmes legacy ou la vérification d'upload"],
    },
    deepDive: [
      {
        h: { en: "What a hash actually proves", fr: "Ce qu'une empreinte prouve réellement" },
        p: {
          en: [
          "A hash is a one-way fingerprint: the same input always yields the same digest, and changing a single bit changes that digest completely. It proves two pieces of data are identical, which is why checksums sit next to published downloads.",
          "What it does not prove is where the data came from. An attacker able to replace a file can usually replace the checksum published beside it. A hash detects accidental corruption reliably; against deliberate substitution you need a signature, not a digest.",
          ],
          fr: [
          "Une empreinte est une signature à sens unique : la même entrée produit toujours le même condensat, et changer un seul bit le change entièrement. Elle prouve que deux données sont identiques, d'où les checksums publiés à côté des téléchargements.",
          "Ce qu'elle ne prouve pas, c'est l'origine des données. Un attaquant capable de remplacer un fichier peut généralement remplacer aussi le checksum publié à côté. Une empreinte détecte de façon fiable une corruption accidentelle ; contre une substitution délibérée, il faut une signature, pas un condensat.",
          ],
        },
      },
      {
        h: { en: "Choosing between the four algorithms", fr: "Choisir parmi les quatre algorithmes" },
        p: {
          en: [
          "MD5 and SHA-1 are both cryptographically broken: constructing two different files that share a digest is practical, not theoretical. They remain available because you still meet them, verifying a legacy vendor checksum, matching an existing database column, deduplicating files where nobody is trying to fool you.",
          "Wherever an adversary might be involved, use SHA-256, or SHA-512 for a wider margin. None of the four is suitable for storing passwords: they are built to be fast, which is exactly the wrong property there. Password storage needs a deliberately slow function such as bcrypt, scrypt or Argon2.",
          ],
          fr: [
          "MD5 et SHA-1 sont tous deux cryptographiquement cassés : construire deux fichiers différents partageant un même condensat est réaliste, pas théorique. Ils restent proposés parce qu'on les rencontre encore, vérifier le checksum d'un éditeur ancien, correspondre à une colonne existante en base, dédupliquer des fichiers là où personne ne cherche à vous tromper.",
          "Dès qu'un adversaire peut être impliqué, utilisez SHA-256, ou SHA-512 pour une marge plus large. Aucun des quatre ne convient au stockage de mots de passe : ils sont conçus pour être rapides, ce qui est précisément la mauvaise propriété dans ce cas. Un mot de passe demande une fonction volontairement lente comme bcrypt, scrypt ou Argon2.",
          ],
        },
      },
      {
        h: { en: "Why your digest does not match theirs", fr: "Pourquoi votre empreinte ne correspond pas à la leur" },
        p: {
          en: [
          "When a file hashes correctly but a piece of text does not, the cause is almost always invisible. Text mode hashes the exact bytes of what you paste, encoded as UTF-8, so a trailing newline, a Windows CRLF line ending instead of a bare LF, or a byte-order mark at the start each produce a completely different digest.",
          "The other frequent culprit is a paste that silently altered characters: an editor turning straight quotes into typographic ones, or a non-breaking space swapped for a regular one. When a text comparison disagrees, hash the file itself rather than its contents pasted into a field.",
          ],
          fr: [
          "Quand un fichier donne la bonne empreinte mais qu'un texte non, la cause est presque toujours invisible. Le mode texte calcule l'empreinte des octets exacts de ce que vous collez, encodés en UTF-8, un saut de ligne final, une fin de ligne CRLF Windows au lieu d'un simple LF, ou une marque d'ordre des octets en tête suffisent chacun à produire un condensat entièrement différent.",
          "L'autre coupable fréquent est un collage qui a modifié des caractères en silence : un éditeur transformant les guillemets droits en guillemets typographiques, ou une espace insécable échangée contre une espace ordinaire. Quand une comparaison de texte échoue, calculez l'empreinte du fichier lui-même plutôt que de son contenu collé dans un champ.",
          ],
        },
      },
    ],
  },
  "regex-tester": {
    desc: {
      en: "Pattern matches highlight in real time as you type. Supports all JavaScript regex flags (g, i, m, s, u) and displays named and unnamed capture groups separately. Useful for prototyping validation patterns before adding them to your codebase, testing parsing logic, or learning regular expressions interactively.",
      fr: "Les correspondances sont surlignées en temps réel à la saisie. Supporte tous les flags JavaScript (g, i, m, s, u) et affiche les groupes de capture nommés et non nommés séparément. Utile pour prototyper des patterns de validation, tester de la logique de parsing, ou apprendre les expressions régulières.",
    },
    useCases: {
      en: ["Prototyping an email, phone or postal code validation regex", "Extracting structured data from log lines using capture groups", "Testing regex patterns on real sample data before deploying to production", "Learning how quantifiers, anchors and lookaheads interact with text"],
      fr: ["Prototyper un regex de validation d'e-mail, téléphone ou code postal", "Extraire des données structurées de lignes de log via des groupes de capture", "Tester des patterns sur des données réelles avant déploiement en production", "Apprendre comment les quantificateurs, ancres et lookaheads interagissent avec le texte"],
    },
    deepDive: [
      {
        h: { en: "Why the global flag is always on", fr: "Pourquoi le flag global est toujours actif" },
        p: {
          en: [
          "A regular expression carrying the g flag keeps an internal position between calls, so testing the same pattern twice can return different answers. That statefulness is a classic source of bugs in application code, but a tester needs it: without g you would only ever see the first match.",
          "The flag is therefore forced on here, and the three you can toggle are the ones that genuinely change matching. Remember the difference when you copy a pattern into your own code, a global regex reused across iterations must have its lastIndex reset, or use matchAll, which handles it for you.",
          ],
          fr: [
          "Une expression régulière portant le flag g conserve une position interne entre les appels : tester deux fois le même motif peut donc donner deux réponses différentes. Cet état est une source classique de bugs dans du code applicatif, mais un testeur en a besoin, sans g, vous ne verriez jamais que la première correspondance.",
          "Le flag est donc forcé ici, et les trois que vous pouvez activer sont ceux qui modifient réellement la correspondance. Gardez la différence en tête au moment de recopier un motif dans votre code : une regex globale réutilisée dans une boucle doit voir son lastIndex réinitialisé, ou passer par matchAll, qui s'en charge.",
          ],
        },
      },
      {
        h: { en: "What the three toggles actually change", fr: "Ce que changent réellement les trois interrupteurs" },
        p: {
          en: [
          "The i flag makes matching case-insensitive. The m flag changes the meaning of the anchors: with it, the start and end markers match at every line break rather than only at the boundaries of the whole string, which is what you want when testing against a multi-line block.",
          "The s flag, often called dotAll, lets the dot match a newline. Without it the dot stops at the end of a line, which is why a pattern meant to capture a block spanning several lines silently returns nothing. Those two are the usual explanation for a regex that works in a one-line test and fails on real input.",
          ],
          fr: [
          "Le flag i rend la correspondance insensible à la casse. Le flag m change le sens des ancres : avec lui, les marqueurs de début et de fin correspondent à chaque saut de ligne plutôt qu'aux seules bornes de la chaîne entière, ce qu'on veut quand on teste sur un bloc multiligne.",
          "Le flag s, souvent appelé dotAll, autorise le point à correspondre à un saut de ligne. Sans lui, le point s'arrête en fin de ligne : c'est pourquoi un motif censé capturer un bloc réparti sur plusieurs lignes ne renvoie silencieusement rien. Ces deux-là expliquent la plupart des regex qui fonctionnent sur un test d'une ligne et échouent sur des données réelles.",
          ],
        },
      },
      {
        h: { en: "Catastrophic backtracking, and how to spot it", fr: "Le retour arrière catastrophique, et comment le repérer" },
        p: {
          en: [
          "Some patterns take exponential time on inputs that do not match. Nested quantifiers are the usual shape, a group that can repeat, itself inside something that repeats. On a short test string the cost is invisible; on a longer one the same pattern can hang the page outright.",
          "If the highlighting stalls after you paste a larger sample, that is what you are seeing, and the pattern is not safe to deploy against user input. Rewriting the inner quantifier to be more specific, or anchoring the expression, usually removes the ambiguity that causes the engine to explore so many paths.",
          ],
          fr: [
          "Certains motifs demandent un temps exponentiel sur des entrées qui ne correspondent pas. Les quantificateurs imbriqués en sont la forme habituelle, un groupe répétable, lui-même à l'intérieur de quelque chose de répétable. Sur une courte chaîne de test, le coût est invisible ; sur une plus longue, le même motif peut figer la page.",
          "Si la coloration se bloque après avoir collé un échantillon plus volumineux, c'est de cela qu'il s'agit, et le motif n'est pas déployable sur des saisies utilisateur. Rendre le quantificateur interne plus spécifique, ou ancrer l'expression, lève généralement l'ambiguïté qui pousse le moteur à explorer autant de chemins.",
          ],
        },
      },
    ],
  },
  "ip-lookup": {
    desc: {
      en: "Enter any IPv4 or IPv6 address to get its country, region, city, ISP, ASN and timezone. Leave the field blank to look up your own public IP. Useful for diagnosing network routing issues, verifying VPN exit nodes, and auditing the geographic origin of traffic in your server logs.",
      fr: "Saisissez n'importe quelle adresse IPv4 ou IPv6 pour obtenir son pays, sa région, sa ville, son FAI, son ASN et son fuseau horaire. Laissez le champ vide pour consulter votre propre IP publique. Utile pour diagnostiquer des problèmes de routage, vérifier les nœuds de sortie VPN, ou auditer l'origine géographique du trafic dans vos logs serveur.",
    },
    useCases: {
      en: ["Finding the country and ISP behind an unfamiliar IP in your access logs", "Verifying that your VPN is correctly routing traffic through the expected country", "Checking your own public IP address from behind a NAT or corporate proxy", "Auditing the geographic distribution of bot traffic hitting your API"],
      fr: ["Identifier le pays et le FAI d'une IP inconnue dans vos logs d'accès", "Vérifier que votre VPN route correctement le trafic via le pays attendu", "Consulter votre IP publique depuis derrière un NAT ou proxy d'entreprise", "Auditer la distribution géographique des bots qui frappent votre API"],
    },
  },
  "uuid-generator": {
    desc: {
      en: "Generate version 4 UUIDs, the fully random variant, and the one you want in almost every situation. Produce 1, 5, 10 or 25 at a time, copy them one by one or the whole batch in a single click. Generation uses crypto.randomUUID() from the Web Crypto API, so the values come from your operating system's cryptographic random source and never touch a network.",
      fr: "Générez des UUID version 4, la variante entièrement aléatoire, celle qui convient dans la quasi-totalité des cas. Produisez-en 1, 5, 10 ou 25 d'un coup, copiez-les un par un ou le lot entier en un clic. La génération utilise crypto.randomUUID() de la Web Crypto API : les valeurs proviennent de la source aléatoire cryptographique de votre système d'exploitation et ne transitent par aucun réseau.",
    },
    useCases: {
      en: ["Generating primary keys for database inserts in development or testing", "Seeding a local database with a batch of 25 UUIDs in one copy, no script needed", "Producing throwaway identifiers for fixtures, mock payloads and API test data", "Producing correlation IDs for distributed tracing across microservices"],
      fr: ["Générer des clés primaires pour des insertions en base de données en développement ou test", "Remplir une base de données locale avec un lot de 25 UUID en un seul copier-coller, sans script", "Générer des UUID v7 pour des enregistrements triables dans le temps en systèmes distribués", "Produire des correlation ID pour le tracing distribué entre microservices"],
    },
    deepDive: [
      {
        h: { en: "What version 4 actually contains", fr: "Ce que contient réellement la version 4" },
        p: {
          en: [
          "A UUID is 128 bits shown as 32 hexadecimal digits in five dash-separated groups. In version 4, four of those bits identify the version and two more mark the variant, which leaves 122 bits drawn at random. That is what the fixed 4 at the start of the third group tells you.",
          "The randomness here comes from crypto.randomUUID(), which draws on the operating system's cryptographic generator rather than Math.random(). The distinction matters: Math.random() is fast but predictable enough that sequences can be reconstructed, which would make identifiers guessable.",
          ],
          fr: [
          "Un UUID fait 128 bits, présentés en 32 chiffres hexadécimaux répartis en cinq groupes séparés par des tirets. En version 4, quatre de ces bits identifient la version et deux autres marquent la variante, ce qui laisse 122 bits tirés au hasard. C'est ce qu'indique le 4 fixe en tête du troisième groupe.",
          "L'aléa provient ici de crypto.randomUUID(), qui s'appuie sur le générateur cryptographique du système d'exploitation plutôt que sur Math.random(). La distinction compte : Math.random() est rapide mais suffisamment prévisible pour qu'on puisse reconstituer des séquences, ce qui rendrait les identifiants devinables.",
          ],
        },
      },
      {
        h: { en: "Collisions, in practice", fr: "Les collisions, en pratique" },
        p: {
          en: [
          "With 122 random bits, the number of possible values is around 5.3 undecillion. Generating a billion UUIDs per second for a century would still leave the probability of a single duplicate negligible, far below the odds of the storage silently corrupting a row.",
          "This holds only when the randomness is genuinely random. Documented collisions in the wild almost always trace back to a weak generator, or to virtual machines cloned from a snapshot that resumed with an identical entropy pool, rather than to the format running out of room.",
          ],
          fr: [
          "Avec 122 bits aléatoires, le nombre de valeurs possibles avoisine 5,3 undécillions. Générer un milliard d'UUID par seconde pendant un siècle laisserait encore la probabilité d'un seul doublon négligeable, très en dessous du risque que le stockage corrompe silencieusement une ligne.",
          "Cela ne vaut que si l'aléa est réellement aléatoire. Les collisions documentées en production remontent presque toujours à un générateur faible, ou à des machines virtuelles clonées depuis un instantané et reprises avec un pool d'entropie identique, plutôt qu'à un format à court de place.",
          ],
        },
      },
      {
        h: { en: "The cost of a random primary key", fr: "Le coût d'une clé primaire aléatoire" },
        p: {
          en: [
          "Version 4 has one real drawback as a database key: it is random, so consecutive inserts land at unrelated positions in the index. On a clustered index (the default for InnoDB and SQL Server) that fragments pages and slows down bulk insertion noticeably compared with a sequential integer.",
          "This is what versions 1 and 7 address by putting a timestamp in the high bits, making identifiers roughly sortable by creation time. If insertion throughput is your bottleneck, that is the trade-off to look at; for the vast majority of applications, version 4 is the right default.",
          ],
          fr: [
          "La version 4 a un vrai inconvénient comme clé de base de données : elle est aléatoire, donc des insertions consécutives atterrissent à des positions sans rapport dans l'index. Sur un index clusterisé (le défaut d'InnoDB et de SQL Server) cela fragmente les pages et ralentit sensiblement l'insertion en masse par rapport à un entier séquentiel.",
          "C'est ce que corrigent les versions 1 et 7 en plaçant un horodatage dans les bits de poids fort, rendant les identifiants à peu près triables par date de création. Si le débit d'insertion est votre goulot d'étranglement, c'est l'arbitrage à examiner ; pour l'immense majorité des applications, la version 4 reste le bon défaut.",
          ],
        },
      },
    ],
  },
  "cron-generator": {
    desc: {
      en: "Type any cron expression and get a plain-language explanation, or build one visually, field by field. Supports the standard 5-field format (minute, hour, day-of-month, month, day-of-week) plus shortcuts like @hourly and @weekly.",
      fr: "Tapez n'importe quelle expression cron et obtenez une explication en langage clair, ou construisez-en une visuellement, champ par champ. Supporte le format standard à 5 champs et les raccourcis comme @hourly et @weekly.",
    },
    useCases: {
      en: ["Building a cron expression for a daily database backup job", "Scheduling a weekly report to run every Monday at 8:00 AM", "Already have a cron string but not sure when it actually fires? Paste it in and read the plain-English explanation", "Learning cron syntax through the interactive field builder"],
      fr: ["Construire une expression cron pour une tâche de sauvegarde de base de données quotidienne", "Planifier un rapport hebdomadaire tous les lundis à 8h00", "Vous avez une expression cron mais vous ne savez pas exactement quand elle se déclenche ? Collez-la et lisez l'explication en langage clair", "Apprendre la syntaxe cron via le constructeur de champs interactif"],
    },
    deepDive: [
      {
        h: { en: "The five fields, in order", fr: "Les cinq champs, dans l'ordre" },
        p: {
          en: [
          "A cron expression is five space-separated fields: minute, hour, day of month, month, and day of week. An asterisk means every value, a comma lists several, a hyphen gives a range, and a slash sets a step, so */15 in the minute field means every fifteen minutes.",
          "Day of week counts from 0 for Sunday. This builder validates that exactly five fields are present and describes the result in plain language as you type, which is the fastest way to catch a field written in the wrong position.",
          ],
          fr: [
          "Une expression cron est faite de cinq champs séparés par des espaces : minute, heure, jour du mois, mois, jour de la semaine. Un astérisque signifie toutes les valeurs, une virgule en énumère plusieurs, un tiret donne un intervalle, et une barre oblique définit un pas, ainsi */15 dans le champ des minutes signifie toutes les quinze minutes.",
          "Le jour de la semaine se compte à partir de 0 pour dimanche. Ce générateur vérifie que cinq champs exactement sont présents et décrit le résultat en langage courant au fil de la saisie, ce qui reste le moyen le plus rapide de repérer un champ écrit à la mauvaise position.",
          ],
        },
      },
      {
        h: { en: "The day-of-month and day-of-week trap", fr: "Le piège du jour du mois et du jour de la semaine" },
        p: {
          en: [
          "These two fields do not combine the way the others do. When both are set to something other than an asterisk, most cron implementations run the job when either matches, not when both do, so a schedule meant for the first of the month when it falls on a Monday will instead run on every first and every Monday.",
          "The safe habit is to constrain one of the two and leave the other as an asterisk. If you genuinely need both conditions, the check belongs at the start of your script rather than in the expression.",
          ],
          fr: [
          "Ces deux champs ne se combinent pas comme les autres. Quand tous deux valent autre chose qu'un astérisque, la plupart des implémentations de cron exécutent la tâche dès que l'un correspond, et non quand les deux correspondent, une planification censée viser le premier du mois lorsqu'il tombe un lundi s'exécutera donc chaque premier du mois et chaque lundi.",
          "La bonne habitude est de contraindre l'un des deux et de laisser l'autre à l'astérisque. Si vous avez réellement besoin des deux conditions, le contrôle a sa place au début de votre script plutôt que dans l'expression.",
          ],
        },
      },
      {
        h: { en: "Time zones and missing hours", fr: "Fuseaux horaires et heures manquantes" },
        p: {
          en: [
          "A cron expression carries no time zone. It is interpreted in whatever zone the running system uses, which is why the same line fires at different moments on a laptop set to local time and on a server left in UTC. Setting the zone explicitly in the scheduler, when it allows it, removes the ambiguity.",
          "Daylight saving makes this concrete twice a year: a job scheduled at 2:30 in a zone that skips that hour in spring simply does not run, and runs twice in autumn when the hour repeats. Scheduling outside the transition window, or working in UTC, avoids both.",
          ],
          fr: [
          "Une expression cron ne porte aucun fuseau horaire. Elle est interprétée dans celui du système qui l'exécute, d'où le fait qu'une même ligne se déclenche à des moments différents sur un portable réglé en heure locale et sur un serveur laissé en UTC. Définir le fuseau explicitement dans le planificateur, quand il le permet, lève l'ambiguïté.",
          "L'heure d'été rend cela concret deux fois par an : une tâche planifiée à 2h30 dans un fuseau qui saute cette heure au printemps ne s'exécute tout simplement pas, et s'exécute deux fois à l'automne quand l'heure se répète. Planifier hors de la fenêtre de transition, ou travailler en UTC, évite les deux.",
          ],
        },
      },
    ],
  },
  "case-converter": {
    desc: {
      en: "Switch text between seven case formats in a single click: UPPER CASE, lower case, Title Case, camelCase, PascalCase, snake_case and kebab-case. Handles Unicode and accented characters correctly, making it reliable for both code identifiers and natural-language content in any language.",
      fr: "Passez d'un format de casse à l'autre en un seul clic : MAJUSCULE, minuscule, Titre, camelCase, PascalCase, snake_case et kebab-case. Gère correctement l'Unicode et les caractères accentués, fiable pour les identifiants de code comme pour le contenu en langage naturel.",
    },
    useCases: {
      en: ["Converting a list of column headers to snake_case for database field names", "Reformatting API response keys from camelCase to kebab-case for CSS custom properties", "Converting titles to Title Case for blog headlines or document headings", "Batch-converting variable names when migrating between coding conventions"],
      fr: ["Convertir une liste d'en-têtes de colonnes en snake_case pour des noms de champs de base de données", "Reformater des clés de réponse API de camelCase en kebab-case pour des propriétés CSS", "Convertir des titres en Titre pour des articles de blog ou des en-têtes de documents", "Convertir en lot des noms de variables lors d'une migration entre conventions de codage"],
    },
    deepDive: [
      {
        h: { en: "How the text is cut into words", fr: "Comment le texte est découpé en mots" },
        p: {
          en: [
          "Every format except UPPER CASE and lower case needs to know where the words are. The splitting works on three signals: a lowercase letter immediately followed by an uppercase one, any run of underscores or hyphens, and whitespace. That is what lets the same input arrive as camelCase, snake_case or a plain sentence and still convert correctly.",
          "UPPER CASE and lower case skip that step entirely and transform the string as it stands, which is why they are the only two formats that preserve your punctuation and spacing untouched.",
          ],
          fr: [
          "Tous les formats sauf MAJUSCULE et minuscule ont besoin de savoir où sont les mots. Le découpage s'appuie sur trois signaux : une minuscule immédiatement suivie d'une majuscule, toute suite de tirets bas ou de traits d'union, et les espaces. C'est ce qui permet à une même entrée d'arriver en camelCase, en snake_case ou en phrase ordinaire et d'être malgré tout convertie correctement.",
          "MAJUSCULE et minuscule sautent cette étape et transforment la chaîne telle quelle, d'où le fait que ce soient les deux seuls formats à préserver intacts votre ponctuation et vos espaces.",
          ],
        },
      },
      {
        h: { en: "Acronyms are the known weak spot", fr: "Les acronymes sont le point faible connu" },
        p: {
          en: [
          "Consecutive capitals carry no boundary signal, so an acronym is read as a single word. HTTPResponse splits after the P, where a lowercase letter meets an uppercase one, giving httpResponse in camelCase, which is usually what you want. But APIKey behaves the same way and yields apikey rather than apiKey.",
          "Once words are identified, each is lowercased before being recapitalised, so an acronym never survives in capitals: converting an identifier containing URL to Title Case produces Url. When acronym casing matters, check the result rather than assuming it.",
          ],
          fr: [
          "Des majuscules consécutives ne portent aucun signal de frontière : un acronyme est donc lu comme un seul mot. HTTPResponse se découpe après le P, là où une minuscule rencontre une majuscule, ce qui donne httpResponse en camelCase, généralement le résultat voulu. Mais APIKey se comporte pareil et produit apikey plutôt que apiKey.",
          "Une fois les mots identifiés, chacun est mis en minuscules avant d'être recapitalisé : un acronyme ne survit donc jamais en capitales, et convertir un identifiant contenant URL en Titre produit Url. Quand la casse des acronymes compte, vérifiez le résultat plutôt que de le supposer.",
          ],
        },
      },
      {
        h: { en: "Which conversions are reversible", fr: "Quelles conversions sont réversibles" },
        p: {
          en: [
          "Going from snake_case to camelCase and back returns the original, because both formats mark their boundaries unambiguously. The same is true between kebab-case, snake_case and PascalCase: the separators differ, the word boundaries survive.",
          "Anything passing through Title Case or a plain sentence loses information, since spaces cannot be told apart from separators that were originally underscores. Accented letters are handled correctly throughout (lowercase and uppercase mappings apply to them as they do to plain ASCII) but a script without letter case, such as Chinese or Arabic, comes back unchanged.",
          ],
          fr: [
          "Passer de snake_case à camelCase puis revenir restitue l'original, parce que les deux formats marquent leurs frontières sans ambiguïté. Il en va de même entre kebab-case, snake_case et PascalCase : les séparateurs diffèrent, les frontières de mots survivent.",
          "Tout ce qui transite par le format Titre ou par une phrase ordinaire perd de l'information, puisqu'on ne peut plus distinguer les espaces des séparateurs qui étaient à l'origine des tirets bas. Les lettres accentuées sont correctement traitées de bout en bout, les correspondances minuscule/majuscule s'y appliquent comme à l'ASCII, mais une écriture sans casse, comme le chinois ou l'arabe, ressort inchangée.",
          ],
        },
      },
    ],
  },
  "word-counter": {
    desc: {
      en: "Paste or type any text to get a real-time breakdown of words, characters, sentences and paragraphs, plus an estimated reading time at 238 words per minute. Useful for blog posts, press releases, academic submissions and any content with length requirements.",
      fr: "Collez ou tapez n'importe quel texte pour obtenir une analyse en temps réel des mots, caractères, phrases et paragraphes, avec une estimation du temps de lecture à 238 mots par minute. Utile pour les articles de blog, communiqués de presse, soumissions académiques et tout contenu avec des contraintes de longueur.",
    },
    useCases: {
      en: ["Checking article length before submitting to a publication with strict word limits", "Estimating how long a speech or presentation script will take to deliver", "Counting characters for social media posts (Twitter, LinkedIn, meta descriptions)", "Verifying minimum word count targets for SEO content strategies"],
      fr: ["Vérifier la longueur d'un article avant soumission à une publication avec limite de mots", "Estimer la durée d'un discours ou d'un script de présentation", "Compter les caractères pour des publications sur les réseaux sociaux ou des meta descriptions", "Vérifier les cibles de nombre de mots minimum pour des stratégies de contenu SEO"],
    },
    deepDive: [
      {
        h: { en: "What counts as a word", fr: "Ce qui compte comme un mot" },
        p: {
          en: [
          "Splitting on spaces is the obvious approach and the wrong one for anything but English prose. It miscounts hyphenated compounds, breaks on apostrophes inconsistently, and fails completely for Chinese, Japanese and Thai, which do not separate words with spaces at all.",
          "This counter uses the browser's own Unicode segmentation instead, the same machinery that decides what a double-click selects. It applies the locale-aware word boundary rules of the Unicode standard, so a Japanese sentence yields a meaningful count rather than one.",
          ],
          fr: [
          "Découper sur les espaces est l'approche évidente, et la mauvaise pour autre chose que de la prose anglaise. Elle compte mal les composés à trait d'union, se comporte de façon incohérente sur les apostrophes, et échoue complètement pour le chinois, le japonais et le thaï, qui ne séparent pas les mots par des espaces.",
          "Ce compteur s'appuie plutôt sur la segmentation Unicode du navigateur, la même mécanique qui décide de ce qu'un double-clic sélectionne. Elle applique les règles de frontière de mot du standard Unicode selon la locale : une phrase japonaise donne donc un compte pertinent, et non un seul mot.",
          ],
        },
      },
      {
        h: { en: "Where the reading time comes from", fr: "D'où vient le temps de lecture" },
        p: {
          en: [
          "The estimate uses 238 words per minute, a figure from a 2019 meta-analysis by Brysbaert covering more than a hundred studies of silent reading in adults. Round numbers like 200 or 250 circulate widely but are conventions rather than measurements.",
          "Treat it as an order of magnitude. Reading speed varies enormously with the material: dense technical documentation is read far more slowly than a news article, reading aloud runs closer to 150 words per minute, and a text skimmed for a single fact is not read at all in the sense the figure assumes.",
          ],
          fr: [
          "L'estimation retient 238 mots par minute, un chiffre issu d'une méta-analyse de Brysbaert publiée en 2019 et couvrant plus d'une centaine d'études sur la lecture silencieuse chez l'adulte. Les nombres ronds comme 200 ou 250 circulent largement mais relèvent de la convention plutôt que de la mesure.",
          "Prenez-le comme un ordre de grandeur. La vitesse de lecture varie énormément selon le matériau : une documentation technique dense se lit bien plus lentement qu'un article de presse, la lecture à voix haute tourne plutôt autour de 150 mots par minute, et un texte parcouru pour y trouver un fait précis n'est pas lu au sens que suppose le chiffre.",
          ],
        },
      },
      {
        h: { en: "Sentences and paragraphs are approximations", fr: "Phrases et paragraphes sont des approximations" },
        p: {
          en: [
          "Sentences are counted by looking for runs of full stops, exclamation marks and question marks. That heuristic is right most of the time and wrong in predictable places: abbreviations, decimal numbers, ellipses and domain names each add a sentence that is not there.",
          "Character counts are exact by comparison, and both variants are shown because platforms disagree on which they enforce. If you are checking a meta description or a social post against a limit, use the character count rather than the word count, since that is what the limit is actually expressed in.",
          ],
          fr: [
          "Les phrases sont comptées en repérant les suites de points, points d'exclamation et points d'interrogation. Cette heuristique est juste la plupart du temps et fausse à des endroits prévisibles : abréviations, nombres décimaux, points de suspension et noms de domaine ajoutent chacun une phrase qui n'existe pas.",
          "Le compte de caractères est exact en comparaison, et les deux variantes sont affichées parce que les plateformes ne s'accordent pas sur celle qu'elles appliquent. Pour vérifier une meta description ou un post face à une limite, fiez-vous au compte de caractères plutôt qu'à celui des mots : c'est dans cette unité que la limite est réellement exprimée.",
          ],
        },
      },
    ],
  },
  "remove-linebreaks": {
    desc: {
      en: "Clean up text copied from PDFs, emails or word processors where artificial line breaks were inserted at the column edge. Paste your text and get back a clean, flowing paragraph. You can preserve intentional paragraph breaks (double line breaks) while removing the unwanted single ones.",
      fr: "Nettoyez le texte copié depuis des PDF, e-mails ou traitements de texte où des sauts de ligne artificiels ont été insérés en fin de colonne. Collez votre texte et récupérez un paragraphe propre et fluide. Conservez les sauts de paragraphe intentionnels tout en supprimant les simples indésirables.",
    },
    useCases: {
      en: ["Cleaning up text copied from a PDF with hard-wrapped line breaks", "Removing formatting artifacts from copy-pasted email chains", "Preparing scraped or exported text for pasting into a rich-text CMS", "Normalizing text from OCR output before further processing"],
      fr: ["Nettoyer du texte copié depuis un PDF avec des sauts de ligne durs", "Supprimer les artefacts de formatage de chaînes d'e-mails copiées-collées", "Préparer du texte extrait ou exporté pour le coller dans un CMS rich-text", "Normaliser du texte issu d'OCR avant traitement ultérieur"],
    },
    deepDive: [
      {
        h: { en: "Three modes for three different messes", fr: "Trois modes pour trois désordres différents" },
        p: {
          en: [
          "Join replaces every run of line breaks with a single space and collapses repeated spaces, giving one continuous block. Strip removes the breaks without putting anything in their place, which is what you want when the break falls inside a word, the usual result of a hyphenated line wrap in a PDF.",
          "Normalize is the one to reach for on real documents: it treats a blank line as a paragraph separator, unwraps the lines inside each paragraph, and keeps the paragraphs apart. You get readable prose instead of a single undifferentiated wall of text.",
          ],
          fr: [
          "Le mode espace remplace chaque suite de sauts de ligne par une seule espace et fusionne les espaces répétées, donnant un bloc continu. Le mode suppression retire les sauts sans rien mettre à la place, ce qu'on veut quand le saut tombe au milieu d'un mot, le résultat habituel d'une césure de fin de ligne dans un PDF.",
          "Le mode normalisation est celui à privilégier sur de vrais documents : il traite une ligne vide comme un séparateur de paragraphe, déplie les lignes à l'intérieur de chaque paragraphe, et conserve les paragraphes distincts. On obtient une prose lisible plutôt qu'un mur de texte indifférencié.",
          ],
        },
      },
      {
        h: { en: "Where the stray breaks come from", fr: "D'où viennent les sauts parasites" },
        p: {
          en: [
          "Text copied from a PDF arrives broken at every visual line because a PDF stores positioned glyphs, not paragraphs, the line ends are an artefact of the page layout, not of the writing. Email clients produce the same effect by hard-wrapping at 72 or 78 columns, a convention inherited from terminals.",
          "In both cases the breaks carry no meaning and removing them restores the original text. That is not true of code, verse, or anything where the line is significant, so those need the paragraph-preserving mode at most.",
          ],
          fr: [
          "Un texte copié depuis un PDF arrive coupé à chaque ligne visuelle, parce qu'un PDF stocke des glyphes positionnés et non des paragraphes, les fins de ligne sont un artefact de la mise en page, pas de l'écriture. Les clients de messagerie produisent le même effet en repliant durement à 72 ou 78 colonnes, une convention héritée des terminaux.",
          "Dans les deux cas les sauts ne portent aucun sens et les retirer restitue le texte d'origine. Ce n'est pas vrai du code, de la poésie, ni de tout ce où la ligne est signifiante : ceux-là demandent au mieux le mode qui préserve les paragraphes.",
          ],
        },
      },
      {
        h: { en: "What it does not repair", fr: "Ce qu'il ne répare pas" },
        p: {
          en: [
          "Only line breaks are touched. A word split by a hyphen at the end of a PDF line keeps its hyphen once the break is removed, so a manual pass is still needed for those. Tabs, non-breaking spaces and other invisible characters are left as they are.",
          "Carriage returns are handled alongside newlines, so text pasted from Windows behaves the same as text from macOS or Linux, a detail that otherwise leaves stray characters behind when only the newline is matched.",
          ],
          fr: [
          "Seuls les sauts de ligne sont touchés. Un mot coupé par un trait d'union en fin de ligne de PDF conserve son trait d'union une fois le saut retiré : une passe manuelle reste nécessaire pour ceux-là. Tabulations, espaces insécables et autres caractères invisibles sont laissés tels quels.",
          "Les retours chariot sont traités en même temps que les sauts de ligne, si bien qu'un texte collé depuis Windows se comporte comme un texte venu de macOS ou de Linux, un détail qui laisse sinon des caractères parasites quand on ne cherche que le saut de ligne.",
          ],
        },
      },
    ],
  },
  "text-reverser": {
    desc: {
      en: "The Text Reverser flips your text in three modes: character-by-character, word-by-word, or line-by-line. It correctly handles Unicode characters, emojis and combining characters, so you get accurate results regardless of the language or special characters in your text. Output updates as you type, with a one-click copy button.",
      fr: "L'inverseur de texte retourne votre texte selon trois modes : caractère par caractère, mot par mot ou ligne par ligne. Il gère correctement les caractères Unicode, les emojis et les caractères combinants, pour des résultats précis quelle que soit la langue ou les caractères spéciaux. Le résultat se met à jour à la saisie, avec un bouton de copie en un clic.",
    },
    useCases: {
      en: ["Creating mirror text for design, watermarks or social media posts", "Reversing word order to analyze or demonstrate sentence structure", "Generating reversed strings for simple text puzzles or games", "Testing string reversal logic in an application with real Unicode edge cases"],
      fr: ["Créer du texte miroir pour du design, des filigranes ou des publications sur les réseaux sociaux", "Inverser l'ordre des mots pour analyser ou illustrer la structure d'une phrase", "Générer des chaînes inversées pour des puzzles ou jeux de texte", "Tester la logique d'inversion de chaînes avec de vrais cas limites Unicode"],
    },
    deepDive: [
      {
        h: { en: "Code points are not characters", fr: "Les points de code ne sont pas des caractères" },
        p: {
          en: [
          "Reversing text looks trivial until Unicode is involved. Splitting a string the naive way cuts it into code points, and several code points often combine into what a reader sees as one character: a letter plus a combining accent, a family emoji joined by zero-width joiners, a regional-indicator pair forming a flag.",
          "Reverse by code point and those units come apart, the accent lands on the neighbouring letter, the family becomes three separate people, the flag turns into two unrelated letters. This tool segments by grapheme cluster instead, so what you see as one character moves as one character.",
          ],
          fr: [
          "Inverser du texte paraît trivial jusqu'à ce qu'Unicode s'en mêle. Découper une chaîne naïvement la coupe en points de code, et plusieurs points de code forment souvent ce qu'un lecteur perçoit comme un seul caractère : une lettre plus un accent combinant, un emoji famille assemblé par liaisons de largeur nulle, une paire d'indicateurs régionaux formant un drapeau.",
          "Inversez par point de code et ces unités se disloquent, l'accent atterrit sur la lettre voisine, la famille devient trois personnages distincts, le drapeau se transforme en deux lettres sans rapport. Cet outil segmente par groupe de graphèmes : ce que vous voyez comme un caractère se déplace comme un caractère.",
          ],
        },
      },
      {
        h: { en: "Right-to-left scripts will still look wrong", fr: "Les écritures de droite à gauche paraîtront tout de même fausses" },
        p: {
          en: [
          "Arabic and Hebrew are stored in logical order, the order in which the letters are read, and reordered for display by the browser's bidirectional algorithm. Reversing the stored string therefore produces something that renders unpredictably, because the display algorithm runs again over your reversed sequence.",
          "There is no correct way to reverse bidirectional text in the abstract: the answer depends on whether you mean the reading order or the visual order. If you need mirrored display for a design, use a CSS transform rather than reversing the underlying string.",
          ],
          fr: [
          "L'arabe et l'hébreu sont stockés en ordre logique, celui dans lequel les lettres se lisent, puis réordonnés à l'affichage par l'algorithme bidirectionnel du navigateur. Inverser la chaîne stockée produit donc un rendu imprévisible, puisque l'algorithme d'affichage repasse ensuite sur votre séquence inversée.",
          "Il n'existe pas de façon correcte d'inverser du texte bidirectionnel dans l'absolu : la réponse dépend de si vous parlez de l'ordre de lecture ou de l'ordre visuel. Si vous cherchez un affichage en miroir pour du design, utilisez une transformation CSS plutôt que d'inverser la chaîne sous-jacente.",
          ],
        },
      },
      {
        h: { en: "Three modes, three different operations", fr: "Trois modes, trois opérations différentes" },
        p: {
          en: [
          "Character mode reverses the whole text end to end, lines included, so the last line becomes the first. Word mode reverses the order of words within each line and leaves the lines where they are. Line mode reverses the order of the lines and leaves each line's contents intact.",
          "Word mode splits on single spaces, which keeps punctuation attached to its word: reversing a sentence moves the full stop with the word it follows rather than to the end. Applying any mode twice returns the original text exactly.",
          ],
          fr: [
          "Le mode caractère inverse l'ensemble du texte de bout en bout, sauts de ligne compris : la dernière ligne devient donc la première. Le mode mot inverse l'ordre des mots à l'intérieur de chaque ligne et laisse les lignes en place. Le mode ligne inverse l'ordre des lignes et laisse le contenu de chacune intact.",
          "Le mode mot découpe sur les espaces simples, ce qui garde la ponctuation attachée à son mot : inverser une phrase déplace le point avec le mot qu'il suit plutôt que de l'envoyer à la fin. Appliquer deux fois n'importe quel mode restitue exactement le texte d'origine.",
          ],
        },
      },
    ],
  },
  "url-encoder": {
    desc: {
      en: "Convert special characters to percent-encoded form for safe use in URLs, or decode them back to readable text. It applies component encoding: every reserved character is escaped, slashes included. That is what you want for a query-string value, a path segment or a form field, and precisely what you must not run a whole URL through, since it would escape the separators that give the URL its structure. Non-ASCII input is encoded as UTF-8 bytes.",
      fr: "Convertissez les caractères spéciaux en forme percent-encodée pour une utilisation sûre dans les URL, ou décodez-les en texte lisible. Il applique un encodage de composant : tout caractère réservé est échappé, barres obliques comprises. C'est ce qu'il faut pour une valeur de query string, un segment de chemin ou un champ de formulaire, et précisément ce qu'il ne faut pas appliquer à une URL entière, puisque cela échapperait les séparateurs qui lui donnent sa structure. Les caractères non ASCII sont encodés en octets UTF-8.",
    },
    useCases: {
      en: ["Encoding a query string containing spaces, accents or special characters", "Decoding a percent-encoded URL to make it human-readable", "Escaping a value that itself contains a slash, so it survives inside a path segment", "Debugging URL encoding mismatches in API requests or redirects"],
      fr: ["Encoder une chaîne de requête contenant des espaces, accents ou caractères spéciaux", "Décoder une URL percent-encodée pour la rendre lisible", "Encoder un segment de chemin contenant des caractères Unicode ou des barres obliques", "Déboguer des décalages d'encodage URL dans des requêtes API ou des redirections"],
    },
    deepDive: [
      {
        h: { en: "Percent-encoding, byte by byte", fr: "Le percent-encoding, octet par octet" },
        p: {
          en: [
          "Percent-encoding replaces a character with a percent sign followed by the hexadecimal value of each of its bytes. A space becomes %20. Non-ASCII characters are first encoded as UTF-8, which is why an accented letter produces two groups and an emoji four: é is %C3%A9, and a rocket is %F0%9F%9A%80.",
          "A small set of characters is deliberately left alone, letters, digits, and the marks minus, underscore, dot, exclamation, tilde, asterisk, apostrophe and parentheses. They are safe everywhere in a URL, so encoding them would only add noise.",
          ],
          fr: [
          "Le percent-encoding remplace un caractère par un signe pourcent suivi de la valeur hexadécimale de chacun de ses octets. Une espace devient %20. Les caractères non ASCII sont d'abord encodés en UTF-8, ce qui explique qu'une lettre accentuée produise deux groupes et un emoji quatre : é donne %C3%A9, et une fusée %F0%9F%9A%80.",
          "Un petit ensemble de caractères est volontairement laissé intact, lettres, chiffres, et les signes moins, tiret bas, point, point d'exclamation, tilde, astérisque, apostrophe et parenthèses. Ils sont sûrs partout dans une URL : les encoder n'ajouterait que du bruit.",
          ],
        },
      },
      {
        h: { en: "Never run a whole URL through this", fr: "N'y passez jamais une URL entière" },
        p: {
          en: [
          "This tool encodes a component, meaning it escapes every reserved character including the slash, the question mark, the ampersand and the colon. Feed it a complete address and the result is a single opaque string in which the scheme, host and path separators have all been escaped, valid as a value, useless as a link.",
          "That behaviour is the correct one for the job it is meant for: taking a value that may itself contain slashes or ampersands and making it survive inside a query parameter or a path segment. Encode the parts, then assemble the URL, not the other way round.",
          ],
          fr: [
          "Cet outil encode un composant : il échappe donc tout caractère réservé, y compris la barre oblique, le point d'interrogation, l'esperluette et les deux-points. Donnez-lui une adresse complète et le résultat est une chaîne opaque unique où le schéma, l'hôte et les séparateurs de chemin ont tous été échappés, valide comme valeur, inutilisable comme lien.",
          "Ce comportement est le bon pour l'usage visé : prendre une valeur pouvant elle-même contenir des barres obliques ou des esperluettes et la faire survivre dans un paramètre de requête ou un segment de chemin. Encodez les morceaux, puis assemblez l'URL, pas l'inverse.",
          ],
        },
      },
      {
        h: { en: "Why a space is sometimes a plus sign", fr: "Pourquoi une espace devient parfois un plus" },
        p: {
          en: [
          "You will meet spaces written both as %20 and as a plus sign. The plus form comes from HTML form submission, whose media type predates the modern URL specification and encodes spaces that way in a query string. It is valid there, and only there.",
          "In a path segment a plus sign is a literal plus, not a space. Decoding a query string with a decoder that does not know the form convention therefore leaves stray plus signs in the text, and encoding a path with a form encoder corrupts any genuine plus it contains.",
          ],
          fr: [
          "On rencontre les espaces écrites tantôt %20, tantôt sous forme de signe plus. La forme plus vient de la soumission de formulaire HTML, dont le type de média est antérieur à la spécification moderne des URL et qui encode ainsi les espaces dans une query string. Elle est valide là, et seulement là.",
          "Dans un segment de chemin, un signe plus est un vrai plus, pas une espace. Décoder une query string avec un décodeur ignorant la convention des formulaires laisse donc des plus parasites dans le texte, et encoder un chemin avec un encodeur de formulaire corrompt tout plus légitime qu'il contient.",
          ],
        },
      },
    ],
  },
  "html-entities": {
    desc: {
      en: "Escape characters like <, >, &, \" and accented letters into their HTML entity equivalents, and decode them back. Essential for safely inserting user-generated content into HTML markup, displaying code examples in a <pre> block, or preparing text for legacy systems that require ASCII-safe HTML.",
      fr: "Échappez les caractères comme <, >, &, \" et les lettres accentuées en leurs équivalents d'entités HTML, et décodez-les. Essentiel pour insérer du contenu généré par l'utilisateur en toute sécurité dans du HTML, afficher des exemples de code dans un bloc <pre>, ou préparer du texte pour des systèmes legacy nécessitant du HTML ASCII-safe.",
    },
    useCases: {
      en: ["Escaping user input before rendering it in an HTML template", "Preparing code snippets for display in a <pre> or <code> block without browser interpretation", "Decoding HTML entities found in scraped or exported web content", "Converting accented characters to named entities for legacy email clients"],
      fr: ["Échapper la saisie utilisateur avant de la rendre dans un template HTML", "Préparer des extraits de code pour affichage dans <pre> ou <code> sans interprétation par le navigateur", "Décoder les entités HTML dans du contenu web extrait ou exporté", "Convertir les caractères accentués en entités nommées pour des clients e-mail legacy"],
    },
    deepDive: [
      {
        h: { en: "Named references or numeric references?", fr: "Références nommées ou numériques ?" },
        p: {
          en: [
          "Every character can be written two ways: by name (&eacute;) or by code point (&#233; in decimal, &#xE9; in hexadecimal). Both produce the same é. Named references stay readable for a human editing the source; numeric references always work, because they depend on no lookup table.",
          "This tool prefers the named form whenever HTML 4 defines one (the Latin-1 range, common punctuation, currency symbols and the Greek alphabet) and falls back to a decimal reference for everything else. That is why an emoji comes out as &#128512;: it simply has no name to use.",
          ],
          fr: [
          "Chaque caractère peut s'écrire de deux façons : par son nom (&eacute;) ou par son point de code (&#233; en décimal, &#xE9; en hexadécimal). Les deux produisent le même é. La forme nommée reste lisible à l'œil nu dans le source ; la forme numérique fonctionne toujours, car elle ne dépend d'aucune table de correspondance.",
          "Cet outil privilégie la forme nommée chaque fois que HTML 4 en définit une (plage Latin-1, ponctuation courante, symboles monétaires et alphabet grec) et bascule sur une référence décimale pour tout le reste. C'est pourquoi un emoji ressort en &#128512; : il n'a tout simplement pas de nom.",
          ],
        },
      },
      {
        h: { en: "Escaping depends on where the text lands", fr: "L'échappement dépend de l'endroit où le texte atterrit" },
        p: {
          en: [
          "HTML escaping is not a universal sanitizer. It is correct for text placed between tags, and for attribute values provided those values are quoted. It is the wrong tool everywhere else: inside a script block you need JavaScript string escaping, inside a URL percent-encoding, inside a CSS rule CSS escaping.",
          "The classic failure is the unquoted attribute. When a value is dropped into markup without surrounding quotes, escaping angle brackets changes nothing, a single space is enough to append an attribute of one's choosing. Escaping protects you only when the surrounding syntax already delimits the value.",
          ],
          fr: [
          "L'échappement HTML n'est pas un désinfectant universel. Il est correct pour du texte placé entre des balises, et pour des valeurs d'attribut à condition que ces valeurs soient entre guillemets. Il est inadapté partout ailleurs : dans un bloc script il faut un échappement de chaîne JavaScript, dans une URL un percent-encoding, dans une règle CSS un échappement CSS.",
          "L'échec classique est l'attribut sans guillemets. Quand une valeur est insérée dans le balisage sans guillemets autour, échapper les chevrons ne change rien, une simple espace suffit à ajouter l'attribut de son choix. L'échappement ne vous protège que si la syntaxe environnante délimite déjà la valeur.",
          ],
        },
      },
      {
        h: { en: "Where this tool stops", fr: "Où cet outil s'arrête" },
        p: {
          en: [
          "Decoding covers the HTML 4 named references plus every numeric reference, decimal or hexadecimal. HTML 5 added around two thousand further names, many of them aliases; those are left untouched rather than mangled, so an unrecognised reference comes back exactly as you typed it.",
          "A reference pointing outside the Unicode range, or at an unpaired surrogate, is returned as-is for the same reason. Silently emitting a replacement character would hide a real problem in your source data instead of surfacing it.",
          ],
          fr: [
          "Le décodage couvre les références nommées de HTML 4 ainsi que toutes les références numériques, décimales ou hexadécimales. HTML 5 en a ajouté environ deux mille, souvent des alias ; celles-là sont laissées intactes plutôt que déformées, si bien qu'une référence non reconnue ressort exactement telle que saisie.",
          "Une référence pointant hors de la plage Unicode, ou vers un substitut isolé, est restituée telle quelle pour la même raison. Émettre silencieusement un caractère de remplacement masquerait un vrai problème dans vos données source au lieu de le révéler.",
          ],
        },
      },
    ],
  },
  "palette-generator": {
    desc: {
      en: "Pick a base color, with the color picker or a hex code, choose a harmony and the tool builds a palette of three to five colors. Five harmonies are available: analogous, complementary, triadic, split-complementary and tetradic. Each color comes with its HEX, HSL and RGB values, copied with one click, and the whole palette can be exported as CSS custom properties. Everything is calculated in your browser.",
      fr: "Choisissez une couleur de base, au sélecteur ou en code hexadécimal, puis une harmonie, et l'outil construit une palette de trois à cinq couleurs. Cinq harmonies sont proposées : analogue, complémentaire, triadique, complémentaire divisée et tétradique. Chaque couleur est donnée en HEX, HSL et RGB, copiables d'un clic, et la palette entière s'exporte en variables CSS. Tout est calculé dans votre navigateur.",
    },
    useCases: {
      en: ["Building a small set of accent colors around an existing brand color", "Picking distinct colors for chart series, categories or tags that still look related", "Getting ready-to-paste CSS custom properties for a prototype", "Comparing several harmonies from the same base color before settling on one"],
      fr: ["Construire un petit jeu de couleurs d'accent autour d'une couleur de marque existante", "Choisir des couleurs distinctes pour les séries d'un graphique, des catégories ou des étiquettes, qui restent cohérentes entre elles", "Obtenir des variables CSS prêtes à coller pour un prototype", "Comparer plusieurs harmonies à partir de la même couleur avant d'en retenir une"],
    },
    deepDive: [
      {
        h: { en: "How the palettes are calculated", fr: "Comment les palettes sont calculées" },
        p: {
          en: [
            "The tool converts your base color to HSL (hue, saturation, lightness) and turns the hue around the color wheel, keeping saturation and lightness unchanged. Analogous takes the neighbors at 30 and 60 degrees on each side. Complementary adds the opposite hue at 180 degrees. Triadic splits the wheel in three (120 and 240), split-complementary takes the two hues on either side of the opposite (150 and 210), and tetradic splits it in four (90, 180, 270).",
            "Some harmonies have fewer hues than the number of colors you ask for: complementary only has two. In that case the remaining slots are filled with lighter, then darker versions of the same hues, 20 points of lightness apart. Ask for five complementary colors and you get the two hues plus three variants, not two colors and three empty slots.",
            "One case where harmonies can't help: a grey, black or white base. With zero saturation there is no hue to rotate, so every harmony returns the same grey, and only the lighter and darker variants differ. Start from a color that has some saturation.",
          ],
          fr: [
            "L'outil convertit la couleur de base en HSL (teinte, saturation, luminosité) et fait tourner la teinte sur le cercle chromatique, sans toucher à la saturation ni à la luminosité. Analogue prend les voisines à 30 et 60 degrés de chaque côté. Complémentaire ajoute la teinte opposée, à 180 degrés. Triadique partage le cercle en trois (120 et 240), complémentaire divisée prend les deux teintes de part et d'autre de l'opposée (150 et 210), et tétradique le partage en quatre (90, 180, 270).",
            "Certaines harmonies ont moins de teintes que le nombre de couleurs demandé : la complémentaire n'en a que deux. Les emplacements restants sont alors remplis par des versions plus claires, puis plus foncées, des mêmes teintes, à 20 points de luminosité d'écart. Demandez cinq couleurs complémentaires : vous obtenez les deux teintes et trois variantes, pas deux couleurs et trois cases vides.",
            "Un cas où les harmonies ne peuvent rien : une base grise, noire ou blanche. Sans saturation, il n'y a pas de teinte à faire tourner, donc chaque harmonie renvoie le même gris et seules les variantes claires et foncées diffèrent. Partez d'une couleur qui a un peu de saturation.",
          ],
        },
      },
      {
        h: { en: "Same lightness on paper, not to the eye", fr: "Même luminosité sur le papier, pas pour l'œil" },
        p: {
          en: [
            "Take this site's green, #00e08a, and ask for a triadic palette. You get a violet, #8a00e0, and an orange, #e08a00. All three have exactly the same HSL lightness, 44%. Put them side by side and the green looks far brighter than the violet.",
            "That's because HSL lightness is a formula, not a measure of what the eye sees. Using the relative luminance formula from the WCAG accessibility guidelines, the green scores 0.55, the orange 0.34 and the violet 0.11: the green is about five times brighter than the violet. Yellows and greens always come out lighter than blues and violets at the same HSL value.",
            "In practice, the same white text can be readable on one color of the palette and unreadable on another. Before putting text on any of these colors, check the pair with the color contrast checker instead of trusting the matching numbers.",
          ],
          fr: [
            "Prenez le vert de ce site, #00e08a, et demandez une palette triadique. Vous obtenez un violet, #8a00e0, et un orange, #e08a00. Les trois ont exactement la même luminosité HSL, 44 %. Mettez-les côte à côte : le vert paraît bien plus clair que le violet.",
            "C'est que la luminosité HSL est une formule, pas une mesure de ce que voit l'œil. Avec la formule de luminance relative des règles d'accessibilité WCAG, le vert obtient 0,55, l'orange 0,34 et le violet 0,11 : le vert est environ cinq fois plus lumineux que le violet. À valeur HSL égale, les jaunes et les verts sortent toujours plus clairs que les bleus et les violets.",
            "Concrètement, le même texte blanc peut être lisible sur une couleur de la palette et illisible sur une autre. Avant de poser du texte sur l'une d'elles, vérifiez le couple avec le vérificateur de contraste plutôt que de vous fier aux chiffres identiques.",
          ],
        },
      },
      {
        h: { en: "What this site does with its own color", fr: "Ce que ce site fait de sa propre couleur" },
        p: {
          en: [
            "The default base color here, #00e08a, is this site's accent. The interface doesn't use five hues around it. It uses that single green and two transparent versions of it, one at about 13% opacity for soft backgrounds and one at about 33% for borders and hover states, on top of neutral greys. The other accents you can switch to (amber, violet, cyan) replace the green; they're never shown together.",
            "That's a common pattern for interfaces, and a useful way to read this tool. For a UI, one accent plus neutrals and a few functional colors (error, success) usually works better than a full harmony. Harmonies earn their place where you need several colors to be told apart: chart series, categories, tags, illustrations.",
          ],
          fr: [
            "La couleur de base proposée ici, #00e08a, est l'accent de ce site. L'interface n'utilise pas cinq teintes autour d'elle. Elle utilise ce seul vert et deux versions transparentes, l'une à environ 13 % d'opacité pour les fonds doux, l'autre à environ 33 % pour les bordures et les survols, sur des gris neutres. Les autres accents que l'on peut choisir (ambre, violet, cyan) remplacent le vert ; ils ne sont jamais affichés ensemble.",
            "C'est un schéma courant pour une interface, et une bonne façon de lire cet outil. Pour une UI, un accent, des neutres et quelques couleurs fonctionnelles (erreur, succès) fonctionnent en général mieux qu'une harmonie complète. Les harmonies trouvent leur place là où plusieurs couleurs doivent se distinguer : séries d'un graphique, catégories, étiquettes, illustrations.",
          ],
        },
      },
      {
        h: { en: "Copying and exporting the palette", fr: "Copier et exporter la palette" },
        p: {
          en: [
            "Click any HEX, HSL or RGB value under a swatch to copy it. Export CSS copies the whole palette as custom properties in a :root block, named --color-1 to --color-5 in the order shown, the base color first.",
            "Rename them before they reach a real codebase. --color-3 means nothing to the next person reading the stylesheet; --accent, --chart-2 or --tag-warning says what the color is for, and lets you change the value later without hunting for every place it's used.",
          ],
          fr: [
            "Cliquez sur une valeur HEX, HSL ou RGB sous une couleur pour la copier. Export CSS copie toute la palette sous forme de variables CSS dans un bloc :root, nommées de --color-1 à --color-5 dans l'ordre affiché, la couleur de base en premier.",
            "Renommez-les avant qu'elles n'arrivent dans un vrai projet. --color-3 ne dit rien à la personne qui lira la feuille de style ensuite ; --accent, --graphique-2 ou --tag-alerte dit à quoi sert la couleur, et permet d'en changer la valeur plus tard sans chercher chaque endroit où elle est utilisée.",
          ],
        },
      },
    ],
  },
  "password-generator": {
    desc: {
      en: "Pick a length from 8 to 32 characters, choose whether to add uppercase letters, digits and symbols, optionally leave out look-alike characters, and get five random passwords at once. Each one shows its strength in bits, calculated from the characters actually used. Passwords are drawn with the Web Crypto API in your browser after the page loads; they never go through a server and never appear in the page's source.",
      fr: "Choisissez une longueur de 8 à 32 caractères, ajoutez ou non majuscules, chiffres et symboles, écartez si besoin les caractères qui se ressemblent, et obtenez cinq mots de passe aléatoires d'un coup. Chacun affiche sa force en bits, calculée sur les caractères réellement utilisés. Les mots de passe sont tirés avec la Web Crypto API dans votre navigateur, une fois la page chargée : ils ne passent par aucun serveur et n'apparaissent jamais dans le code source de la page.",
    },
    useCases: {
      en: ["Creating a database password, an FTP or hosting-panel account, or an application secret for a new server", "Filling a .env file with secrets that won't break the connection string or the shell", "Getting a strong password for a new online account, to store straight into a password manager", "Producing several passwords at once for a batch of test or staff accounts"],
      fr: ["Créer le mot de passe d'une base de données, d'un compte FTP ou d'un panneau d'hébergement, ou un secret d'application pour un nouveau serveur", "Remplir un fichier .env avec des secrets qui ne cassent ni la chaîne de connexion ni le shell", "Obtenir un mot de passe fort pour un nouveau compte en ligne, à enregistrer directement dans un gestionnaire de mots de passe", "Produire plusieurs mots de passe d'un coup pour un lot de comptes de test ou de collaborateurs"],
    },
    deepDive: [
      {
        h: { en: "Length beats symbols", fr: "La longueur compte plus que les symboles" },
        p: {
          en: [
            "The strength shown next to each password is its entropy: the length multiplied by log2 of the number of possible characters. Lowercase letters alone give 26 possibilities per character. Adding uppercase and digits brings it to 62, and the 26 symbols to 88.",
            "Now compare. Sixteen letters and digits give 95 bits. Twelve characters with symbols give 77. Twenty-four letters and digits give 142, well beyond sixteen characters with every option on (103). Each extra character multiplies the number of possible passwords by 62 or more, while adding symbols only raises the per-character count from 62 to 88. When you can choose, add length before adding symbols.",
            "The labels follow those numbers: under 40 bits is weak, 40 to 59 fair, 60 to 79 strong, and 80 or more very strong. The default here, sixteen letters and digits, lands at 95.",
          ],
          fr: [
            "La force affichée à côté de chaque mot de passe est son entropie : la longueur multipliée par le log2 du nombre de caractères possibles. Les minuscules seules donnent 26 possibilités par caractère. Avec les majuscules et les chiffres, on passe à 62, et à 88 avec les 26 symboles.",
            "Comparez. Seize lettres et chiffres donnent 95 bits. Douze caractères avec symboles en donnent 77. Vingt-quatre lettres et chiffres donnent 142, bien au-delà de seize caractères avec toutes les options (103). Chaque caractère en plus multiplie le nombre de mots de passe possibles par 62 ou davantage, alors qu'ajouter les symboles ne fait passer le nombre de choix par caractère que de 62 à 88. Quand vous avez le choix, allongez avant d'ajouter des symboles.",
            "Les libellés suivent ces chiffres : moins de 40 bits, faible ; de 40 à 59, moyen ; de 60 à 79, fort ; 80 et plus, très fort. Le réglage par défaut, seize lettres et chiffres, arrive à 95.",
          ],
        },
      },
      {
        h: { en: "Passwords for servers and .env files", fr: "Mots de passe pour serveurs et fichiers .env" },
        p: {
          en: [
            "Symbols that are harmless in a website login form cause trouble in server configuration. An @ or a : in a database password breaks a connection string such as mysql://user:password@host/db unless it's percent-encoded. A $ gets expanded as a variable by the shell and by Docker Compose. A # can start a comment in a .env file when the value isn't quoted, silently cutting the password.",
            "For those secrets, the simplest safe choice is 24 or 32 letters and digits, with symbols off: 142 or 190 bits, stronger than anything you'd type, and nothing to escape anywhere. Nobody types a database password by hand, so length costs nothing.",
            "Leave out ambiguous characters when a password will be read or typed by a person: the option removes l, 1, I, O, 0, B and 8, which are easy to confuse on screen or on paper. It shortens the alphabet a little, so add a couple of characters to compensate.",
          ],
          fr: [
            "Des symboles sans danger dans un formulaire de connexion posent problème dans la configuration d'un serveur. Un @ ou un : dans le mot de passe d'une base de données casse une chaîne de connexion comme mysql://utilisateur:motdepasse@hote/base, sauf encodage en pourcentage. Un $ est interprété comme une variable par le shell et par Docker Compose. Un # peut ouvrir un commentaire dans un fichier .env quand la valeur n'est pas entre guillemets, et couper le mot de passe sans prévenir.",
            "Pour ces secrets, le choix sûr le plus simple est 24 ou 32 lettres et chiffres, symboles désactivés : 142 ou 190 bits, plus solide que tout ce qu'on taperait, et rien à échapper nulle part. Personne ne tape un mot de passe de base de données à la main, donc la longueur ne coûte rien.",
            "Écartez les caractères ambigus quand un mot de passe sera lu ou tapé par une personne : l'option retire l, 1, I, O, 0, B et 8, faciles à confondre à l'écran ou sur papier. L'alphabet rétrécit un peu, alors ajoutez un ou deux caractères pour compenser.",
          ],
        },
      },
      {
        h: { en: "How the passwords are drawn", fr: "Comment les mots de passe sont tirés" },
        p: {
          en: [
            "Each character is picked with crypto.getRandomValues, the browser's cryptographic random source, not Math.random. The pick is uniform: values that would favor the first characters of the alphabet are thrown away and drawn again, so every character has exactly the same chance.",
            "When you tick digits or symbols, each password is guaranteed to contain at least one of each ticked family, since many sign-up forms reject a password without a digit. Drafts that miss a family are discarded and redrawn, which keeps the result random among the passwords that satisfy the rule.",
            "The passwords only exist in this browser tab. They're generated after the page has loaded, never on a server or when the site is built, so they can't end up in a cached copy of the page. A new batch replaces the previous one; nothing is kept.",
          ],
          fr: [
            "Chaque caractère est choisi avec crypto.getRandomValues, la source aléatoire cryptographique du navigateur, et non Math.random. Le tirage est uniforme : les valeurs qui favoriseraient les premiers caractères de l'alphabet sont écartées et retirées, pour que chaque caractère ait exactement la même chance.",
            "Quand vous cochez chiffres ou symboles, chaque mot de passe contient à coup sûr au moins un caractère de chaque famille cochée, car beaucoup de formulaires d'inscription refusent un mot de passe sans chiffre. Les brouillons auxquels il manque une famille sont écartés et retirés, ce qui garde le résultat aléatoire parmi les mots de passe conformes à la règle.",
            "Les mots de passe n'existent que dans cet onglet. Ils sont générés une fois la page chargée, jamais sur un serveur ni au moment de la construction du site : ils ne peuvent donc pas se retrouver dans une copie en cache de la page. Un nouveau lot remplace le précédent ; rien n'est conservé.",
          ],
        },
      },
      {
        h: { en: "After you copy it", fr: "Une fois copié" },
        p: {
          en: [
            "Paste the password straight into a password manager or into the server's configuration, then generate a new batch so the one you used disappears from the screen. If clipboard history is turned on (Windows+V on Windows, many clipboard apps on macOS), the password stays there too; clear it for server secrets.",
            "Use one password per service. A strong password reused in two places is only as safe as the weaker of the two sites, and leaked password lists are tried against every other service first.",
          ],
          fr: [
            "Collez le mot de passe directement dans un gestionnaire de mots de passe ou dans la configuration du serveur, puis générez un nouveau lot pour que celui que vous avez utilisé disparaisse de l'écran. Si l'historique du presse-papiers est activé (Windows+V sous Windows, de nombreuses applications sous macOS), le mot de passe y reste aussi ; videz-le pour les secrets de serveur.",
            "Un mot de passe par service. Un mot de passe fort réutilisé à deux endroits n'est pas plus sûr que le moins sûr des deux sites, et les listes de mots de passe dérobés sont d'abord essayées sur tous les autres services.",
          ],
        },
      },
    ],
  },
  "gradient-generator": {
    desc: {
      en: "Design CSS gradients visually and copy the result as ready-to-paste code. Add up to 5 color stops, drag them to reorder, adjust the angle, and switch between linear and radial modes. The live preview updates as you edit. One click copies the complete linear-gradient() or radial-gradient() CSS declaration.",
      fr: "Concevez des dégradés CSS visuellement et copiez le résultat en code prêt à utiliser. Ajoutez jusqu'à 5 arrêts de couleur, faites-les glisser pour les réordonner, ajustez l'angle et basculez entre mode linéaire et radial. L'aperçu se met à jour en temps réel.",
    },
    useCases: {
      en: ["Designing a background gradient for a hero section or landing page", "Building a gradient for a button, badge or card component", "Creating a radial spotlight or glow effect with a precise center", "Experimenting with multi-stop color transitions for a design system"],
      fr: ["Concevoir un dégradé de fond pour une section hero ou une landing page", "Créer un dégradé pour un bouton, badge ou composant carte", "Créer un effet de spot ou de halo radial avec un centre précis", "Expérimenter des transitions de couleurs multi-arrêts pour un design system"],
    },
    deepDive: [
      {
        h: { en: "What the angle actually measures", fr: "Ce que mesure réellement l'angle" },
        p: {
          en: [
          "In CSS a linear gradient angle points in the direction the gradient travels, measured clockwise from straight up. So 0 degrees runs bottom to top, 90 degrees runs left to right, and 180 degrees runs top to bottom. That clockwise-from-north convention trips people up, because most maths starts from the horizontal and turns the other way.",
          "The gradient line is also sized so the corners of the box land exactly on its ends, which means the same angle produces a visibly different result on a wide banner and on a square tile.",
          ],
          fr: [
          "En CSS, l'angle d'un dégradé linéaire pointe dans la direction que suit le dégradé, mesurée dans le sens horaire depuis la verticale vers le haut. Ainsi 0 degré va de bas en haut, 90 degrés de gauche à droite, et 180 degrés de haut en bas. Cette convention horaire depuis le nord déroute, parce que la plupart des repères mathématiques partent de l'horizontale et tournent dans l'autre sens.",
          "La ligne de dégradé est en outre dimensionnée pour que les coins de la boîte tombent exactement sur ses extrémités : un même angle produit donc un résultat visiblement différent sur une bannière large et sur une tuile carrée.",
          ],
        },
      },
      {
        h: { en: "Why gradients between saturated colours look muddy", fr: "Pourquoi un dégradé entre couleurs saturées paraît terne" },
        p: {
          en: [
          "Browsers interpolate in sRGB by default, channel by channel. Between two colours sitting opposite each other on the colour wheel, the midpoint of that arithmetic lands near grey, which is why a blue-to-yellow gradient develops a dull band in the middle rather than passing through a vivid green.",
          "Adding a third stop in the middle, in the hue you actually want, is the fix that works everywhere. Modern CSS also lets you name a different interpolation space, such as Oklab, which keeps the midpoint saturated, though support is more recent than the syntax this tool produces.",
          ],
          fr: [
          "Les navigateurs interpolent par défaut en sRGB, canal par canal. Entre deux couleurs opposées sur la roue chromatique, le milieu de cette moyenne arithmétique tombe près du gris, d'où la bande terne au centre d'un dégradé bleu vers jaune, au lieu d'un passage par un vert franc.",
          "Ajouter un troisième arrêt au milieu, dans la teinte réellement voulue, est le correctif qui fonctionne partout. Le CSS moderne permet aussi de nommer un autre espace d'interpolation, comme Oklab, qui garde le milieu saturé, mais son support est plus récent que la syntaxe produite par cet outil.",
          ],
        },
      },
      {
        h: { en: "Three shapes, three behaviours", fr: "Trois formes, trois comportements" },
        p: {
          en: [
          "A linear gradient runs along a straight line at the angle you set. A radial gradient spreads outward from a centre point, useful for spotlights and soft vignettes. A conic gradient sweeps around a centre like a clock hand, which is what makes pie charts and colour wheels possible in pure CSS.",
          "Up to five colour stops are available, which is more than most designs need: gradients with many stops tend to read as banded rather than smooth. Two or three well-chosen stops almost always look better than five.",
          ],
          fr: [
          "Un dégradé linéaire suit une droite selon l'angle défini. Un dégradé radial se diffuse depuis un point central, utile pour des halos et des vignettages doux. Un dégradé conique balaie autour d'un centre comme une aiguille d'horloge, ce qui rend possibles camemberts et roues chromatiques en CSS pur.",
          "Jusqu'à cinq arrêts de couleur sont disponibles, ce qui dépasse le besoin de la plupart des designs : les dégradés à nombreux arrêts se lisent plutôt comme des bandes que comme une transition douce. Deux ou trois arrêts bien choisis rendent presque toujours mieux que cinq.",
          ],
        },
      },
    ],
  },
  "meta-preview": {
    desc: {
      en: "Paste a URL and see the three previews people will actually meet: the Google result, the Facebook or LinkedIn card and the X card. The tool downloads the page's HTML and reads the title, meta description, Open Graph and Twitter Card tags, canonical and robots, then lists every tag with its value so you can copy it in one click. Missing key tags are marked, and a relative og:image URL is flagged because social networks can't load it.",
      fr: "Collez une URL et voyez les trois aperçus que les gens rencontreront vraiment : le résultat Google, la carte Facebook ou LinkedIn et la carte X. L'outil télécharge le HTML de la page, lit le titre, la meta description, les balises Open Graph et Twitter Card, la canonical et la meta robots, puis liste chaque balise avec sa valeur, copiable d'un clic. Les balises importantes absentes sont signalées, et une URL og:image relative est pointée, car les réseaux sociaux ne peuvent pas la charger.",
    },
    useCases: {
      en: ["Checking the image, title and description before posting a link on LinkedIn, Facebook or X", "Reviewing a site you just delivered: each template (home, article, product) should carry its own og:title and og:image, not the home page's", "Finding out why a shared link shows an old title, a blank card or no image at all", "Copying the exact value of a tag to paste into a CMS field or a bug report"],
      fr: ["Vérifier l'image, le titre et la description avant de publier un lien sur LinkedIn, Facebook ou X", "Relire un site qu'on vient de livrer : chaque gabarit (accueil, article, produit) doit porter son propre og:title et son og:image, pas ceux de l'accueil", "Comprendre pourquoi un lien partagé affiche un ancien titre, une carte vide ou aucune image", "Copier la valeur exacte d'une balise pour la coller dans un champ de CMS ou un ticket"],
    },
    deepDive: [
      {
        h: { en: "Which tag each preview reads", fr: "Quelle balise lit chaque aperçu" },
        p: {
          en: [
            "Google and the social networks don't read the same tags. The Google preview uses the title tag and the meta description, which is why it can show a different headline from the Facebook card on the same page. Google may also rewrite both when it finds a passage that fits the search better.",
            "Facebook and LinkedIn read og:title, og:description and og:image first, and fall back to the title and description when the Open Graph tags are missing. X reads its own twitter: tags, then falls back to the Open Graph ones. The previews here follow those same fallbacks, so an empty og:title shows up as your page title, just as it would once shared.",
            "The one tag without an equivalent is twitter:card. It picks the layout: summary gives a small square thumbnail next to the text, summary_large_image a wide image above it. If your X card looks cramped next to the Facebook one, that's usually the reason.",
          ],
          fr: [
            "Google et les réseaux sociaux ne lisent pas les mêmes balises. L'aperçu Google utilise la balise title et la meta description, ce qui explique qu'il puisse afficher un autre titre que la carte Facebook pour la même page. Google peut aussi réécrire les deux s'il trouve un passage qui répond mieux à la recherche.",
            "Facebook et LinkedIn lisent d'abord og:title, og:description et og:image, et se rabattent sur le titre et la description quand les balises Open Graph manquent. X lit ses propres balises twitter:, puis se rabat sur celles d'Open Graph. Les aperçus suivent ces mêmes replis : un og:title vide s'affiche avec le titre de la page, comme il le ferait une fois partagé.",
            "La seule balise sans équivalent est twitter:card. Elle choisit la mise en page : summary donne une petite vignette carrée à côté du texte, summary_large_image une image large au-dessus. Si votre carte X paraît tassée à côté de la carte Facebook, la raison est presque toujours là.",
          ],
        },
      },
      {
        h: { en: "What it showed on our own pages", fr: "Ce qu'il a montré sur nos propres pages" },
        p: {
          en: [
            "Run on this site's tool pages, the tag list had two gaps. og:site_name and og:type, set once for the whole site, were missing on every tool page. The cause is a Next.js detail worth knowing: when a page defines its own openGraph metadata, it replaces the object set in the layout instead of merging with it, so any field the page doesn't repeat quietly disappears.",
            "The second gap was og:image. With no image tag, a link to one of these pages shared on LinkedIn or Facebook shows as a plain text card. Nothing is broken on the page itself, which is exactly why this kind of omission survives for months: you only notice it when someone shares the link.",
          ],
          fr: [
            "Lancé sur les pages outils de ce site, la liste des balises montrait deux trous. og:site_name et og:type, définis une fois pour tout le site, manquaient sur chaque page outil. La cause est un détail de Next.js bon à connaître : quand une page définit ses propres métadonnées openGraph, elles remplacent l'objet défini dans le layout au lieu de s'y ajouter, et tout champ que la page ne répète pas disparaît sans bruit.",
            "Le second trou, c'était og:image. Sans balise image, un lien vers ces pages partagé sur LinkedIn ou Facebook s'affiche comme une simple carte de texte. Rien n'est cassé sur la page elle-même, et c'est précisément pour ça que ce genre d'oubli survit des mois : on ne le remarque que le jour où quelqu'un partage le lien.",
          ],
        },
      },
      {
        h: { en: "og:image: the problems it catches, and the ones it doesn't", fr: "og:image : les problèmes détectés, et ceux qui échappent" },
        p: {
          en: [
            "The most common fault is a relative path such as /images/cover.jpg. A browser resolves it without a second thought, but Facebook, LinkedIn and Slack expect a full https:// address and simply show no image. The tool flags a relative og:image or twitter:image instead of displaying it, because showing it would suggest it works.",
            "What it doesn't do is download and measure the image. The size to aim for is 1200 × 630 pixels, a 1.91:1 ratio, which fills the wide card on every network; much smaller images get shown as a thumbnail or not at all. Also make sure the image is publicly reachable: an image behind a login, or on a server that blocks requests from other sites, loads for you and fails for the crawler.",
          ],
          fr: [
            "Le défaut le plus courant est un chemin relatif comme /images/couverture.jpg. Un navigateur le résout sans broncher, mais Facebook, LinkedIn et Slack attendent une adresse complète en https:// et n'affichent tout simplement pas d'image. L'outil signale un og:image ou un twitter:image relatif au lieu de l'afficher, car l'afficher laisserait croire qu'il fonctionne.",
            "Ce qu'il ne fait pas, c'est télécharger et mesurer l'image. La taille à viser est 1200 × 630 pixels, soit un ratio de 1,91:1, qui remplit la carte large sur tous les réseaux ; une image bien plus petite s'affiche en vignette ou pas du tout. Vérifiez aussi que l'image est accessible publiquement : une image derrière une connexion, ou sur un serveur qui bloque les requêtes venues d'autres sites, se charge chez vous et échoue pour le robot.",
          ],
        },
      },
      {
        h: { en: "After a fix: the networks keep their own copy", fr: "Après une correction : les réseaux gardent leur propre copie" },
        p: {
          en: [
            "Results here are kept for one minute, so a corrected page shows its new tags almost at once. The social networks are slower. Facebook and LinkedIn store the preview of a URL the first time someone shares it and keep serving that copy, which is why a link can still show last month's image after you've fixed it.",
            "To force a refresh, paste the URL into Facebook's Sharing Debugger and click Scrape Again, or into LinkedIn's Post Inspector. Do it before you share the link again, not after, or the old card goes out one more time.",
          ],
          fr: [
            "Ici, les résultats sont gardés une minute : une page corrigée affiche ses nouvelles balises presque tout de suite. Les réseaux sociaux sont plus lents. Facebook et LinkedIn enregistrent l'aperçu d'une URL la première fois qu'elle est partagée et continuent de servir cette copie, ce qui explique qu'un lien affiche encore l'image du mois dernier après correction.",
            "Pour forcer la mise à jour, collez l'URL dans le Sharing Debugger de Facebook et cliquez sur Scrape Again, ou dans le Post Inspector de LinkedIn. Faites-le avant de repartager le lien, pas après, sinon l'ancienne carte part une fois de plus.",
          ],
        },
      },
      {
        h: { en: "Why it reads the raw HTML", fr: "Pourquoi il lit le HTML brut" },
        p: {
          en: [
            "The tool reads the HTML the server sends, without running JavaScript. That's deliberate: the crawlers that build link previews generally don't run it either. If your tags are added by a script after the page loads, they'll be missing here, and they'll be missing on the shared card too. Render them on the server.",
            "The previews are close approximations, not screenshots. Each network cuts titles and descriptions by width and adjusts its layout from time to time, so the exact point where your text stops may differ by a few characters. What matters is what the check reliably tells you: which tags exist, what they contain and which one each network will pick.",
          ],
          fr: [
            "L'outil lit le HTML envoyé par le serveur, sans exécuter de JavaScript. C'est voulu : les robots qui fabriquent les aperçus de liens ne l'exécutent généralement pas non plus. Si vos balises sont ajoutées par un script après le chargement, elles manqueront ici, et elles manqueront aussi sur la carte partagée. Générez-les côté serveur.",
            "Les aperçus sont des approximations fidèles, pas des captures. Chaque réseau coupe titres et descriptions selon leur largeur et fait évoluer sa mise en page de temps en temps : l'endroit exact où le texte s'arrête peut varier de quelques caractères. Ce qui compte, c'est ce que le contrôle dit de façon fiable : quelles balises existent, ce qu'elles contiennent et laquelle chaque réseau retiendra.",
          ],
        },
      },
    ],
  },
  "seo-analyzer": {
    desc: {
      en: "Paste a public URL and the analyzer downloads the page's HTML, runs eleven on-page checks and turns them into a score out of 100. It looks at the title, meta description, H1, H2 and H3 headings, word count, image alt attributes, canonical, robots meta, Open Graph and Twitter Card tags, and counts internal and external links. Every check shows what it found, so you know exactly which line to fix.",
      fr: "Collez une URL publique : l'analyseur télécharge le HTML de la page, lance onze contrôles on-page et les convertit en un score sur 100. Il examine le titre, la meta description, le H1, les titres H2 et H3, le nombre de mots, les attributs alt des images, la balise canonical, la meta robots, les balises Open Graph et Twitter Card, et compte les liens internes et externes. Chaque contrôle affiche ce qu'il a trouvé : vous savez exactement quelle ligne corriger.",
    },
    useCases: {
      en: ["Checking a page you just wrote or edited before you publish it: title length, meta description, a single H1, no leftover noindex", "Showing a client or prospect, in two minutes, which basics are missing on their pages before proposing a full audit", "Catching a staging robots noindex that went to production with the rest of the release", "Spotting images without an alt attribute on a page before an accessibility or SEO review"],
      fr: ["Contrôler une page qu'on vient d'écrire ou de modifier avant de la publier : longueur du titre, meta description, un seul H1, pas de noindex oublié", "Montrer en deux minutes à un client ou à un prospect ce qui manque sur ses pages, avant de proposer un audit complet", "Repérer un noindex de préproduction parti en production avec le reste de la mise à jour", "Trouver les images sans attribut alt d'une page avant une revue accessibilité ou SEO"],
    },
    deepDive: [
      {
        h: { en: "How the score out of 100 is built", fr: "Comment le score sur 100 est construit" },
        p: {
          en: [
            "Each check earns points, 96 in total, and the score is the share you collect. Title and meta description are worth 12 each: full marks when the title runs 30 to 65 characters and the description 100 to 165, partial when they exist but fall outside that range, zero when missing. A single H1 earns 10, several H1s earn 5.",
            "Content length is worth 10 from 300 words, 4 between 150 and 299, nothing below. Image alt attributes are worth 10, and a canonical tag and a robots meta without noindex are worth 8 each. At least one H2 earns 8. Open Graph (6) and Twitter Card (4) close the list. The links line is informational: it always gives its 8 points and just shows the counts.",
            "So a completely empty HTML page doesn't score 0. It scores 32, thanks to the checks that pass by default: no images means no missing alt, no robots meta means indexable, and so on. example.com, with its 17 words and no description, lands at 50. Keep those two numbers in mind before celebrating a 70.",
          ],
          fr: [
            "Chaque contrôle rapporte des points, 96 au total, et le score est la part obtenue. Le titre et la meta description valent 12 chacun : la note pleine si le titre fait de 30 à 65 caractères et la description de 100 à 165, une partie s'ils existent hors de ces plages, zéro s'ils manquent. Un seul H1 rapporte 10, plusieurs H1 rapportent 5.",
            "La longueur du contenu vaut 10 à partir de 300 mots, 4 entre 150 et 299, rien en dessous. Les attributs alt des images valent 10, la balise canonical et une meta robots sans noindex valent 8 chacune. Au moins un H2 rapporte 8. Open Graph (6) et Twitter Card (4) ferment la liste. La ligne des liens est informative : elle donne toujours ses 8 points et affiche simplement les comptes.",
            "Une page HTML complètement vide n'obtient donc pas 0 mais 32, grâce aux contrôles réussis par défaut : pas d'image, donc pas d'alt manquant ; pas de meta robots, donc page indexable. example.com, avec ses 17 mots et sans description, arrive à 50. Gardez ces deux chiffres en tête avant de fêter un 70.",
          ],
        },
      },
      {
        h: { en: "What it reads, and what it can't see", fr: "Ce qu'il lit, et ce qu'il ne voit pas" },
        p: {
          en: [
            "The analyzer reads the HTML your server returns, without running JavaScript. On a site that builds its content in the browser, the title, headings or text may simply not be in that HTML, and the report will say they're missing even though you see them on screen. Google does render JavaScript, but in a later pass: what's already in the HTML doesn't have to wait for it.",
            "The word count covers the visible text of the whole body, menus and footer included, and ignores scripts and styles. A thin article inside a big navigation can pass the 300-word bar. Treat the number as a floor, not as proof of depth.",
            "Outside its scope entirely: keywords, the quality of the writing, page speed, mobile layout, structured data, backlinks and actual rankings. A 100 here means the basic tags are in place. It says nothing about whether the page deserves to rank.",
          ],
          fr: [
            "L'analyseur lit le HTML renvoyé par le serveur, sans exécuter de JavaScript. Sur un site qui construit son contenu dans le navigateur, le titre, les titres de section ou le texte peuvent tout simplement être absents de ce HTML, et le rapport les dira manquants alors que vous les voyez à l'écran. Google exécute bien le JavaScript, mais lors d'un second passage : ce qui figure déjà dans le HTML n'a pas à l'attendre.",
            "Le nombre de mots couvre le texte visible de tout le body, menus et pied de page compris, en ignorant scripts et styles. Un article maigre entouré d'une grosse navigation peut donc franchir la barre des 300 mots. Prenez ce chiffre comme un plancher, pas comme une preuve de profondeur.",
            "Hors de son champ : les mots-clés, la qualité de la rédaction, la vitesse, l'affichage mobile, les données structurées, les backlinks et le classement réel. Un 100 ici veut dire que les balises de base sont en place. Il ne dit rien sur le fait que la page mérite d'être bien classée.",
          ],
        },
      },
      {
        h: { en: "Titles and descriptions: what we fixed on this site", fr: "Titres et descriptions : ce que nous avons corrigé sur ce site" },
        p: {
          en: [
            "Bing Webmaster Tools flagged this site for two things this analyzer checks page by page: many identical titles and many meta descriptions that were too short. The cause was mundane. Tool pages reused the one-line text written for the catalog cards as their meta description, and a few tools had the same name in English and French, so both language versions carried the same title.",
            "The fix was a dedicated title and description for every page, in each language, with the lengths checked automatically before each release. The descriptions now sit between 125 and 155 characters. That's the kind of problem a single-page check shows on each page, and a site-wide crawl shows across all of them: run this on a few representative pages, not just the home page.",
            "Two things the character counts don't capture. Google trims titles by pixel width, so a title full of wide capitals gets cut sooner than its length suggests. And Google may rewrite a title or description when it thinks another passage matches the search better, so a perfect tag is a strong suggestion, not a guarantee.",
          ],
          fr: [
            "Bing Webmaster Tools a signalé sur ce site deux problèmes que cet analyseur contrôle page par page : beaucoup de titres identiques et beaucoup de meta descriptions trop courtes. La cause était banale. Les pages outils reprenaient comme meta description la phrase d'une ligne écrite pour les cartes du catalogue, et quelques outils portaient le même nom en anglais et en français, donc les deux versions linguistiques avaient le même titre.",
            "La correction : un titre et une description dédiés pour chaque page, dans chaque langue, avec des longueurs vérifiées automatiquement avant chaque mise en ligne. Les descriptions font désormais entre 125 et 155 caractères. C'est le genre de défaut qu'un contrôle page par page montre sur chaque page, et qu'un crawl du site montre sur l'ensemble : lancez l'analyse sur quelques pages représentatives, pas seulement l'accueil.",
            "Deux choses échappent au comptage de caractères. Google coupe les titres selon leur largeur en pixels : un titre plein de majuscules larges est tronqué plus tôt que sa longueur ne le laisse penser. Et Google peut réécrire un titre ou une description s'il juge qu'un autre passage répond mieux à la recherche. Une balise parfaite est une forte suggestion, pas une garantie.",
          ],
        },
      },
      {
        h: { en: "Before publishing, and in front of a prospect", fr: "Avant de publier, et face à un prospect" },
        p: {
          en: [
            "Before you publish, fix the red lines first. A missing title or description, no H1, or a noindex left over from staging cost far more than an Open Graph tag. Then look at the orange ones, starting with titles and descriptions outside their range. The score will follow; chasing it line by line in the other order wastes time.",
            "With a client or prospect, show the checks rather than the number. A 64 invites an argument about what 64 means. \"Your service pages have no meta description and three H1s\" is concrete, verifiable in their own browser, and tells them what the work will be. Results are kept for one minute, so a page you've just corrected shows its new state almost immediately.",
          ],
          fr: [
            "Avant de publier, corrigez d'abord les lignes rouges. Un titre ou une description absents, pas de H1, ou un noindex resté de la préproduction coûtent bien plus qu'une balise Open Graph. Passez ensuite aux lignes orange, en commençant par les titres et descriptions hors de leur plage. Le score suivra ; le poursuivre ligne par ligne dans l'autre ordre fait perdre du temps.",
            "Face à un client ou à un prospect, montrez les contrôles plutôt que le chiffre. Un 64 appelle une discussion sur ce que vaut 64. « Vos pages services n'ont pas de meta description et comptent trois H1 » est concret, vérifiable dans son propre navigateur, et dit ce que sera le travail. Les résultats sont gardés une minute : une page tout juste corrigée affiche son nouvel état presque immédiatement.",
          ],
        },
      },
    ],
  },
  "utm-builder": {
    desc: {
      en: "Build campaign tracking URLs by appending UTM parameters (source, medium, campaign, term, content) to any base URL. Fill in the fields, click to copy, everything is built locally in your browser, no external service involved. Quick presets for Google Ads, Facebook, email newsletters and Twitter/X let you get to a valid tracking URL in seconds.",
      fr: "Construisez des URLs de suivi de campagne en ajoutant des paramètres UTM (source, canal, campagne, terme, contenu) à n'importe quelle URL de base. Remplissez les champs, cliquez pour copier, tout est construit localement dans votre navigateur, aucun service externe. Des préréglages rapides pour Google Ads, Facebook, les newsletters et Twitter/X permettent d'obtenir une URL valide en quelques secondes.",
    },
    useCases: {
      en: ["Tagging newsletter links before sending a campaign to track click-through in Google Analytics", "Creating separate UTM variants for A/B testing ad copy across Google and Facebook", "Building consistent UTM conventions across a marketing team with shared presets", "Tracking traffic sources for a product launch landing page across multiple channels"],
      fr: ["Taguer les liens d'une newsletter avant envoi pour suivre les clics dans Google Analytics", "Créer des variantes UTM distinctes pour un test A/B de visuels publicitaires sur Google et Facebook", "Établir des conventions UTM cohérentes dans une équipe marketing grâce aux préréglages partagés", "Suivre les sources de trafic d'une landing page de lancement produit sur plusieurs canaux"],
    },
    deepDive: [
      {
        h: { en: "The five parameters, and the three that matter", fr: "Les cinq paramètres, et les trois qui comptent" },
        p: {
          en: [
          "Source names where the traffic came from, medium names the kind of channel, and campaign names the initiative. Those three are what analytics tools group by, and omitting any of them leaves the visit sitting in an unhelpful bucket. Term and content are optional refinements, originally for paid keywords and for telling two variants of the same ad apart.",
          "The convention that matters most is consistency of vocabulary: newsletter and email describe the same medium, but analytics will report them as two separate channels forever. Agreeing on the words before the first campaign is worth more than any tooling.",
          ],
          fr: [
          "La source nomme la provenance du trafic, le medium le type de canal, et la campagne l'opération. Ces trois-là sont ce sur quoi les outils d'analyse regroupent, et en omettre un laisse la visite dans une catégorie inexploitable. Le terme et le contenu sont des raffinements facultatifs, prévus à l'origine pour les mots-clés payants et pour distinguer deux variantes d'une même annonce.",
          "La convention la plus importante est la constance du vocabulaire : newsletter et email désignent le même medium, mais l'outil d'analyse les rapportera comme deux canaux distincts pour toujours. S'accorder sur les mots avant la première campagne vaut mieux que n'importe quel outillage.",
          ],
        },
      },
      {
        h: { en: "Case sensitivity is the usual silent failure", fr: "La casse est le piège silencieux habituel" },
        p: {
          en: [
          "UTM values are case-sensitive in most analytics platforms, so Newsletter and newsletter become two separate rows in the report. The same goes for trailing spaces picked up when pasting from a spreadsheet. Neither produces an error; the data simply fragments, and the split is often noticed only weeks later.",
          "Sticking to lowercase throughout, with hyphens instead of spaces, removes the whole class of problem. Avoid characters that need encoding as well: a space becomes %20 in the URL and is easy to mistake for part of the value.",
          ],
          fr: [
          "Les valeurs UTM sont sensibles à la casse dans la plupart des plateformes d'analyse : Newsletter et newsletter deviennent donc deux lignes distinctes du rapport. Il en va de même des espaces finales récupérées en collant depuis un tableur. Ni l'un ni l'autre ne produit d'erreur ; les données se fragmentent simplement, et l'on s'en aperçoit souvent des semaines plus tard.",
          "S'en tenir aux minuscules de bout en bout, avec des traits d'union plutôt que des espaces, élimine toute cette classe de problèmes. Évitez aussi les caractères nécessitant un encodage : une espace devient %20 dans l'URL et se confond aisément avec la valeur.",
          ],
        },
      },
      {
        h: { en: "Where tagged links do not belong", fr: "Où les liens balisés n'ont pas leur place" },
        p: {
          en: [
          "Tag outbound links only, those you place on someone else's property, in an email or in an ad. Putting UTM parameters on internal links restarts the session attribution inside your own analytics, overwriting the real acquisition source with your own page and making the original channel disappear from the report.",
          "Tagged URLs are also public: they show up in address bars, get shared, and end up indexed. Campaign names that are internal shorthand, or that reveal an unannounced launch, are best avoided for that reason alone.",
          ],
          fr: [
          "Ne balisez que les liens sortants, ceux que vous placez sur une propriété qui n'est pas la vôtre, dans un e-mail ou dans une annonce. Poser des paramètres UTM sur des liens internes réamorce l'attribution de session dans votre propre outil d'analyse : la source d'acquisition réelle est écrasée par votre propre page, et le canal d'origine disparaît du rapport.",
          "Les URL balisées sont par ailleurs publiques : elles apparaissent dans les barres d'adresse, se partagent, et finissent indexées. Les noms de campagne relevant du jargon interne, ou révélant un lancement non annoncé, sont à éviter pour cette seule raison.",
          ],
        },
      },
    ],
  },
  "jwt-generator": {
    desc: {
      en: "Sign a JSON payload as an HS256 JWT token directly in your browser using the Web Crypto API. Enter any valid JSON object as the payload, set a secret key, and click sign. The resulting token is rendered with each part color-coded (header, payload, signature) so you can visually confirm the structure. The secret key never leaves your browser, no server involved.",
      fr: "Signez un payload JSON en token JWT HS256 directement dans votre navigateur via l'API Web Crypto. Entrez n'importe quel objet JSON valide en payload, définissez une clé secrète, et cliquez sur signer. Le token résultant est affiché avec chaque partie colorée (header, payload, signature) pour confirmer visuellement la structure. La clé secrète ne quitte jamais votre navigateur.",
    },
    useCases: {
      en: ["Generating test JWTs to validate your backend authentication middleware", "Creating short-lived tokens for local API testing without spinning up an auth server", "Understanding the JWT format by modifying claims and observing the output", "Quickly signing a payload during a demo or code review without installing a library"],
      fr: ["Générer des JWT de test pour valider votre middleware d'authentification backend", "Créer des tokens de courte durée pour des tests d'API locaux sans démarrer un serveur d'auth", "Comprendre le format JWT en modifiant les claims et en observant le résultat", "Signer rapidement un payload lors d'une démo ou d'une revue de code sans installer de bibliothèque"],
    },
    deepDive: [
      {
        h: { en: "Three parts, only one of them secret", fr: "Trois parties, une seule secrète" },
        p: {
          en: [
          "A JWT is three Base64url segments joined by dots. The first is a header naming the algorithm, the second is the payload holding your claims, and the third is a signature over the first two. Header and payload are encoded, not encrypted: anyone holding the token can read them, so a JWT is never a place for confidential data.",
          "The signature is what makes the token trustworthy. It proves the payload has not been altered since it was signed, and that whoever signed it held the key. Change a single character of the payload and the signature no longer matches.",
          ],
          fr: [
          "Un JWT est fait de trois segments Base64url reliés par des points. Le premier est un en-tête nommant l'algorithme, le deuxième la charge utile contenant vos claims, le troisième une signature portant sur les deux premiers. En-tête et charge utile sont encodés, pas chiffrés : quiconque détient le token peut les lire, un JWT n'est donc jamais l'endroit où loger des données confidentielles.",
          "C'est la signature qui rend le token digne de confiance. Elle prouve que la charge utile n'a pas été modifiée depuis sa signature, et que le signataire détenait la clé. Changez un seul caractère de la charge utile et la signature ne correspond plus.",
          ],
        },
      },
      {
        h: { en: "HS256, and when it is the wrong choice", fr: "HS256, et quand c'est le mauvais choix" },
        p: {
          en: [
          "HS256 is symmetric: the same secret both signs and verifies. That is simple and fast, and it fits a system where one service issues tokens and verifies them itself. It stops fitting as soon as a second party needs to verify, because verifying requires the very key that allows forging.",
          "That is where the asymmetric algorithms come in, RS256 and ES256 sign with a private key and verify with a public one, so a token can be checked by services that could never mint it. This tool implements HS256 only, which covers local testing but not a multi-service architecture.",
          ],
          fr: [
          "HS256 est symétrique : le même secret signe et vérifie. C'est simple et rapide, et cela convient à un système où un seul service émet les tokens et les vérifie lui-même. Cela cesse de convenir dès qu'un tiers doit vérifier, puisque vérifier exige la clé même qui permet de forger.",
          "C'est là qu'interviennent les algorithmes asymétriques, RS256 et ES256 signent avec une clé privée et vérifient avec une clé publique, si bien qu'un token peut être contrôlé par des services incapables de l'émettre. Cet outil n'implémente que HS256, ce qui couvre les tests locaux mais pas une architecture multi-services.",
          ],
        },
      },
      {
        h: { en: "The claims that decide whether a token is accepted", fr: "Les claims qui décident de l'acceptation d'un token" },
        p: {
          en: [
          "Several payload fields have a standard meaning that libraries enforce automatically. The most common source of a token rejected as expired is exp: it is a Unix timestamp in seconds, and writing it in milliseconds, the unit JavaScript hands you, yields a date far enough in the future that some validators reject it outright.",
          "Alongside it, iat records when the token was issued, nbf the moment before which it must not be accepted, and sub identifies the subject. A payload with no exp at all produces a token that never expires, which is rarely what you want outside a test.",
          ],
          fr: [
          "Plusieurs champs de la charge utile ont une signification normalisée que les bibliothèques appliquent automatiquement. La cause la plus fréquente d'un token rejeté comme expiré est exp : c'est un timestamp Unix en secondes, et l'écrire en millisecondes, l'unité que JavaScript vous donne, produit une date assez lointaine pour que certains validateurs la refusent d'emblée.",
          "À ses côtés, iat enregistre la date d'émission, nbf le moment avant lequel le token ne doit pas être accepté, et sub identifie le sujet. Une charge utile sans exp du tout produit un token qui n'expire jamais, ce qui est rarement souhaitable en dehors d'un test.",
          ],
        },
      },
    ],
  },
  "readability": {
    desc: {
      en: "Analyze any text and get two standard readability metrics: Flesch-Kincaid Reading Ease (0–100, higher is easier) and Gunning Fog Index (approximate school grade level needed to read the text). Also shows average sentence length, syllables per word and the percentage of complex words (3+ syllables). English and French use slightly different formulas, applied automatically based on your language setting.",
      fr: "Analysez n'importe quel texte et obtenez deux métriques de lisibilité standard : l'indice Flesch-Kincaid (0–100, plus c'est haut, plus c'est lisible) et l'indice Gunning Fog (niveau scolaire approximatif pour lire le texte). Affiche aussi la longueur moyenne des phrases, les syllabes par mot et le pourcentage de mots complexes (3 syllabes ou plus). Le français et l'anglais utilisent des formules légèrement différentes, appliquées automatiquement selon votre langue.",
    },
    useCases: {
      en: ["Simplifying landing page copy to reach a broader audience before publishing", "Checking that user-facing error messages and documentation are easy to understand", "Comparing the readability of two versions of the same article during editing", "Ensuring legal or compliance text meets accessibility readability guidelines"],
      fr: ["Simplifier le texte d'une landing page pour toucher un public plus large avant publication", "Vérifier que les messages d'erreur et la documentation sont compréhensibles par tous les utilisateurs", "Comparer la lisibilité de deux versions d'un même article lors de la révision", "S'assurer que des textes juridiques ou de conformité respectent les recommandations d'accessibilité"],
    },
    deepDive: [
      {
        h: { en: "What the Flesch score measures, and what it ignores", fr: "Ce que mesure le score Flesch, et ce qu'il ignore" },
        p: {
          en: [
          "The formula combines two ratios: average sentence length in words, and average word length in syllables. Shorter sentences and shorter words push the score up. That is the whole model: it has no notion of vocabulary difficulty, logical structure, or whether the text makes sense at all.",
          "So a passage of short nonsense words scores as highly readable, and a clear sentence built from long technical terms scores as difficult even when its audience finds it obvious. Treat the number as a rough measure of surface complexity, useful for comparing two drafts of the same text, not as a verdict on quality.",
          ],
          fr: [
          "La formule combine deux rapports : la longueur moyenne des phrases en mots, et la longueur moyenne des mots en syllabes. Des phrases et des mots plus courts font monter le score. C'est tout le modèle : il n'a aucune notion de difficulté du vocabulaire, de structure logique, ni du fait que le texte ait un sens.",
          "Un passage fait de mots courts et absurdes obtient donc un excellent score, et une phrase claire bâtie sur des termes techniques longs est jugée difficile même si son public la trouve évidente. Prenez le nombre comme une mesure grossière de complexité de surface, utile pour comparer deux versions d'un même texte, pas comme un verdict sur la qualité.",
          ],
        },
      },
      {
        h: { en: "Counting syllables is an approximation", fr: "Compter les syllabes est une approximation" },
        p: {
          en: [
          "No formula counts syllables exactly. The usual approach groups consecutive vowels and applies corrections, the silent e at the end of an English word being the best known. It gets the common cases right and misses on names, borrowed words and irregular spellings.",
          "French needs different rules from English, so the two languages are handled separately here rather than running English heuristics over French text. Running a French passage through an English-only readability tool inflates the syllable count and reports the text as far harder than it is.",
          ],
          fr: [
          "Aucune formule ne compte les syllabes exactement. L'approche habituelle regroupe les voyelles consécutives et applique des corrections, le e muet en fin de mot anglais étant la plus connue. Elle traite correctement les cas courants et échoue sur les noms propres, les emprunts et les orthographes irrégulières.",
          "Le français réclame des règles différentes de l'anglais : les deux langues sont donc traitées séparément ici, plutôt qu'en appliquant des heuristiques anglaises à du texte français. Passer un texte français dans un outil de lisibilité conçu pour l'anglais gonfle le compte de syllabes et rapporte un texte bien plus difficile qu'il ne l'est.",
          ],
        },
      },
      {
        h: { en: "Using the score without letting it write for you", fr: "Se servir du score sans le laisser écrire à votre place" },
        p: {
          en: [
          "Because the formula only rewards brevity, it is trivially gamed: split every sentence in two and the score climbs without the text becoming clearer. Chopping a well-built sentence at its logical joint usually makes it harder to follow, not easier, even as the number improves.",
          "The score earns its keep as a flag rather than a target. A section scoring far worse than the rest of a document is worth rereading: it often turns out to contain one sentence that ran away with three subordinate clauses. Fix that sentence, and ignore the number afterwards.",
          ],
          fr: [
          "Comme la formule ne récompense que la brièveté, elle se contourne trivialement : coupez chaque phrase en deux et le score grimpe sans que le texte gagne en clarté. Sectionner une phrase bien construite à son articulation logique la rend généralement plus difficile à suivre, pas plus facile, alors même que le nombre s'améliore.",
          "Le score vaut comme signal d'alerte, pas comme objectif. Une section notée bien plus mal que le reste d'un document mérite une relecture : il s'y trouve souvent une phrase partie en vrille avec trois subordonnées. Corrigez cette phrase, puis oubliez le nombre.",
          ],
        },
      },
    ],
  },
  "md-table": {
    desc: {
      en: "Build Markdown tables visually, click cells to edit, add or remove rows and columns with toolbar buttons, and toggle column alignment (left, center, right) in one click. The corresponding Markdown syntax updates in real time below the grid. Copy it directly into any Markdown file, README, GitHub issue or documentation site.",
      fr: "Construisez des tableaux Markdown visuellement, cliquez sur les cellules pour éditer, ajoutez ou supprimez des lignes et colonnes avec les boutons de la barre d'outils, et changez l'alignement par colonne (gauche, centré, droite) en un clic. La syntaxe Markdown correspondante se met à jour en temps réel sous la grille. Copiez-la dans n'importe quel fichier Markdown, README, issue GitHub ou site de documentation.",
    },
    useCases: {
      en: ["Building comparison tables for README files without remembering pipe syntax", "Creating feature matrices for a product documentation site", "Generating Markdown tables from manually typed data to paste into GitHub issues or PRs", "Formatting data tables for blog posts or technical articles written in Markdown"],
      fr: ["Créer des tableaux comparatifs pour des README sans mémoriser la syntaxe pipe", "Générer des matrices de fonctionnalités pour un site de documentation produit", "Créer des tableaux Markdown depuis des données saisies manuellement pour les coller dans des issues ou PR GitHub", "Formater des tableaux de données pour des articles de blog ou des articles techniques en Markdown"],
    },
    deepDive: [
      {
        h: { en: "Only the separator row is load-bearing", fr: "Seule la ligne de séparation porte le sens" },
        p: {
          en: [
          "A Markdown table needs a header row, a separator row of dashes, and any number of body rows. Only the separator row carries structure: the number of segments it contains fixes the number of columns, and the colons placed inside it set each column's alignment.",
          "Everything else is cosmetic. Pipes do not need to line up, cells do not need equal widths, and leading or trailing pipes are optional. Aligned source is pleasant to read in a diff, and this tool produces it, but a table with ragged pipes renders identically.",
          ],
          fr: [
          "Un tableau Markdown demande une ligne d'en-tête, une ligne de séparation faite de tirets, et un nombre quelconque de lignes de corps. Seule la ligne de séparation porte la structure : le nombre de segments qu'elle contient fixe le nombre de colonnes, et les deux-points qu'on y place définissent l'alignement de chaque colonne.",
          "Tout le reste est cosmétique. Les barres verticales n'ont pas besoin d'être alignées, les cellules pas besoin d'être de largeur égale, et les barres en début et fin de ligne sont facultatives. Un source aligné se lit agréablement dans un diff, et cet outil en produit un, mais un tableau aux barres irrégulières s'affiche à l'identique.",
          ],
        },
      },
      {
        h: { en: "What a cell cannot contain", fr: "Ce qu'une cellule ne peut pas contenir" },
        p: {
          en: [
          "A cell holds a single line. There is no syntax for a real line break inside one, and pressing return breaks the table apart, the usual workaround is an inline HTML break tag, which most renderers accept. Lists and code blocks are unavailable for the same reason; inline code spans work fine.",
          "A pipe character inside a cell must be escaped with a backslash, otherwise it is read as a column separator and shifts every following cell by one. That single unescaped pipe is the most common cause of a table that renders with the wrong number of columns.",
          ],
          fr: [
          "Une cellule tient sur une seule ligne. Il n'existe pas de syntaxe pour un vrai saut de ligne à l'intérieur, et appuyer sur entrée casse le tableau, le contournement habituel est une balise de saut HTML en ligne, que la plupart des moteurs de rendu acceptent. Listes et blocs de code sont indisponibles pour la même raison ; le code en ligne, lui, fonctionne.",
          "Une barre verticale dans une cellule doit être échappée par un antislash, faute de quoi elle est lue comme un séparateur de colonne et décale d'un cran toutes les cellules suivantes. Cette unique barre non échappée est la cause la plus fréquente d'un tableau affiché avec le mauvais nombre de colonnes.",
          ],
        },
      },
      {
        h: { en: "Tables are an extension, not core Markdown", fr: "Les tableaux sont une extension, pas du Markdown de base" },
        p: {
          en: [
          "Tables are absent from the original Markdown specification and from CommonMark. They come from GitHub Flavored Markdown, which is why they work on GitHub, GitLab, Obsidian, Notion and most static site generators, but not in every renderer.",
          "If a table shows up as raw pipes and dashes, the renderer is running plain CommonMark without the extension enabled. Most libraries offer it as a flag rather than a default, so the fix is usually configuration rather than a change to the table itself.",
          ],
          fr: [
          "Les tableaux sont absents de la spécification Markdown d'origine comme de CommonMark. Ils viennent du GitHub Flavored Markdown, d'où leur fonctionnement sur GitHub, GitLab, Obsidian, Notion et la plupart des générateurs de sites statiques, mais pas dans tous les moteurs de rendu.",
          "Si un tableau apparaît sous forme de barres et de tirets bruts, le moteur applique du CommonMark simple sans l'extension activée. La plupart des bibliothèques la proposent en option plutôt que par défaut : le correctif relève donc de la configuration, pas d'une modification du tableau.",
          ],
        },
      },
    ],
  },
  "toml-json": {
    desc: {
      en: "Paste a TOML file and get the equivalent JSON, or switch direction and turn a JSON object into TOML. The conversion uses smol-toml, a parser that follows the TOML 1.0 specification, and runs in your browser as you type. When a value can't make the trip unchanged, such as a JSON null or a TOML inf, the tool says so above the result instead of dropping it silently.",
      fr: "Collez un fichier TOML et obtenez le JSON équivalent, ou inversez le sens pour transformer un objet JSON en TOML. La conversion s'appuie sur smol-toml, un parseur conforme à la spécification TOML 1.0, et se fait dans votre navigateur à mesure que vous tapez. Quand une valeur ne peut pas passer telle quelle, comme un null JSON ou un inf TOML, l'outil le signale au-dessus du résultat au lieu de la perdre sans rien dire.",
    },
    useCases: {
      en: ["Reading a Cargo.toml, pyproject.toml or Hugo config as JSON, to feed it to a script or a jq command", "Turning a JSON settings object from an API or a CMS into a TOML config file", "Finding the exact line where a TOML file breaks, with the error pointing at the column", "Checking what a TOML file really contains once inline tables and arrays of tables are expanded"],
      fr: ["Lire un Cargo.toml, un pyproject.toml ou une config Hugo sous forme de JSON, pour l'envoyer à un script ou à une commande jq", "Transformer un objet de réglages JSON venu d'une API ou d'un CMS en fichier de configuration TOML", "Trouver la ligne exacte où un fichier TOML casse, avec une erreur qui pointe la colonne", "Vérifier ce que contient vraiment un fichier TOML une fois les tables en ligne et les tableaux de tables développés"],
    },
    deepDive: [
      {
        h: { en: "What changes from TOML to JSON", fr: "Ce qui change du TOML au JSON" },
        p: {
          en: [
            "Tables become nested objects and arrays stay arrays, so most config files convert without surprises. The differences come from types JSON doesn't have. TOML has real dates and times; JSON doesn't, so 1979-05-27T07:32:00Z comes out as the string \"1979-05-27T07:32:00.000Z\", with milliseconds added. A local date such as 1979-05-27 stays as written.",
            "TOML separates integers from floats; JSON has a single number type. A value written 3.0 in TOML comes out as 3. And TOML's inf and nan have no JSON spelling at all: they become null, and the tool shows a warning naming the key.",
            "Integers that JavaScript can't hold exactly, anything beyond 9,007,199,254,740,991, are refused with an error instead of being rounded. Better a clear stop than an ID that quietly changes its last digit.",
          ],
          fr: [
            "Les tables deviennent des objets imbriqués et les tableaux restent des tableaux : la plupart des fichiers de config passent sans surprise. Les écarts viennent des types que le JSON n'a pas. Le TOML a de vraies dates et heures, pas le JSON : 1979-05-27T07:32:00Z ressort sous forme de chaîne \"1979-05-27T07:32:00.000Z\", millisecondes ajoutées. Une date locale comme 1979-05-27 reste telle qu'écrite.",
            "Le TOML distingue entiers et décimaux ; le JSON n'a qu'un type de nombre. Une valeur écrite 3.0 en TOML ressort en 3. Quant à inf et nan, le JSON n'a aucune façon de les écrire : ils deviennent null, et l'outil affiche un avertissement qui nomme la clé.",
            "Les entiers que JavaScript ne peut pas représenter exactement, au-delà de 9 007 199 254 740 991, sont refusés avec une erreur au lieu d'être arrondis. Mieux vaut un arrêt net qu'un identifiant dont le dernier chiffre change en silence.",
          ],
        },
      },
      {
        h: { en: "From JSON to TOML: the three traps", fr: "Du JSON au TOML : les trois pièges" },
        p: {
          en: [
            "TOML has no null. A key set to null in your JSON has no TOML equivalent, so it's left out of the result, and the tool lists every key concerned. A null inside an array can't be left out without shifting the other items, so that case stops with an error.",
            "The JSON must be an object at the top. A TOML file is a set of keys, so a JSON array or a single value at the root has nothing to map to.",
            "Two problems happen before the conversion even starts, inside the browser's JSON reader. A key that appears twice keeps only its last value, without warning. And a number with more than 15 or 16 significant digits, typically a database ID, is rounded as it's read: 9007199254740993 becomes 9007199254740992. If your JSON carries long IDs, they should be strings.",
          ],
          fr: [
            "Le TOML n'a pas de null. Une clé qui vaut null dans votre JSON n'a pas d'équivalent TOML : elle est omise du résultat, et l'outil liste chaque clé concernée. Un null à l'intérieur d'un tableau ne peut pas être omis sans décaler les autres éléments : ce cas-là s'arrête sur une erreur.",
            "Le JSON doit être un objet à la racine. Un fichier TOML est un ensemble de clés : un tableau JSON ou une valeur seule en racine n'a rien à quoi correspondre.",
            "Deux problèmes surviennent avant même la conversion, dans le lecteur JSON du navigateur. Une clé présente deux fois ne garde que sa dernière valeur, sans avertissement. Et un nombre de plus de 15 ou 16 chiffres significatifs, typiquement un identifiant de base de données, est arrondi à la lecture : 9007199254740993 devient 9007199254740992. Si votre JSON contient de longs identifiants, ils doivent être des chaînes.",
          ],
        },
      },
      {
        h: { en: "The round trip isn't neutral", fr: "L'aller-retour n'est pas neutre" },
        p: {
          en: [
            "Convert a TOML file to JSON and back, and you get a valid file that no longer looks like the original. Comments are gone, since neither direction has anywhere to keep them. Dates come back as quoted strings rather than TOML dates, and 3.0 comes back as the integer 3, which a strictly typed program may reject.",
            "The layout changes too. An inline table such as serde = { version = \"1.0\", features = [\"derive\"] } comes back as its own [dependencies.serde] section. It means the same thing, but the diff in your repository will be large. Use the conversion to read or generate a file, not to edit a TOML file you want to keep as it is.",
          ],
          fr: [
            "Convertissez un fichier TOML en JSON puis revenez en TOML : vous obtenez un fichier valide qui ne ressemble plus à l'original. Les commentaires ont disparu, aucun des deux sens n'ayant où les garder. Les dates reviennent en chaînes entre guillemets et non en dates TOML, et 3.0 revient en entier 3, ce qu'un programme strictement typé peut refuser.",
            "La mise en forme change aussi. Une table en ligne comme serde = { version = \"1.0\", features = [\"derive\"] } revient sous forme d'une section [dependencies.serde] à part. Le sens est le même, mais le diff dans votre dépôt sera gros. Servez-vous de la conversion pour lire ou générer un fichier, pas pour retoucher un fichier TOML que vous voulez garder tel quel.",
          ],
        },
      },
      {
        h: { en: "When the file won't parse", fr: "Quand le fichier refuse de passer" },
        p: {
          en: [
            "TOML errors come with the line and column, and a caret under the problem. The usual causes are a string without quotes (name = hello instead of name = \"hello\"), a key or table defined twice, which TOML forbids, and a table header repeated further down the file.",
            "On the JSON side, the most frequent failure with config files isn't in your data: tsconfig.json and VS Code settings accept comments and trailing commas, which strict JSON doesn't. Remove them before pasting, or the conversion stops at the first // it meets.",
          ],
          fr: [
            "Les erreurs TOML indiquent la ligne et la colonne, avec un accent circonflexe sous le problème. Les causes habituelles : une chaîne sans guillemets (name = hello au lieu de name = \"hello\"), une clé ou une table définie deux fois, ce que le TOML interdit, et un en-tête de table répété plus bas dans le fichier.",
            "Côté JSON, l'échec le plus fréquent avec des fichiers de config ne vient pas de vos données : tsconfig.json et les réglages de VS Code acceptent les commentaires et les virgules finales, ce que le JSON strict refuse. Retirez-les avant de coller, sinon la conversion s'arrête au premier // rencontré.",
          ],
        },
      },
    ],
  },
  "headers-checker": {
    desc: {
      en: "Enter a public URL and the checker reads the HTTP response headers the server sends back, then reports on six security headers with a grade from A to F. Only four of them move the grade: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options and X-Frame-Options. Each one missing costs a letter. Referrer-Policy and Permissions-Policy are still listed, with the line to add if they're absent, but they never change the letter.",
      fr: "Saisissez une URL publique : l'outil lit les en-têtes HTTP renvoyés par le serveur et fait le point sur six en-têtes de sécurité, avec une note de A à F. Seuls quatre d'entre eux comptent dans la note : Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options et X-Frame-Options. Chaque absence coûte une lettre. Referrer-Policy et Permissions-Policy restent affichés, avec la ligne à ajouter s'ils manquent, mais ne changent jamais la note.",
    },
    useCases: {
      en: ["Checking a site right after a deploy, before announcing it, to make sure the reverse proxy didn't silently drop a header", "Validating an Nginx or Plesk change: add the directive, reload the server, retest a minute later", "Running a quick first pass on a client's or prospect's site before a proper security audit", "Confirming that an http:// address redirects to HTTPS and that the final response actually carries HSTS"],
      fr: ["Contrôler un site juste après une mise en production, avant de l'annoncer, pour vérifier que le reverse proxy n'a pas perdu un en-tête en route", "Valider une modification Nginx ou Plesk : ajouter la directive, recharger le serveur, retester une minute plus tard", "Faire un premier passage rapide sur le site d'un client ou d'un prospect avant un vrai audit de sécurité", "Vérifier qu'une adresse en http:// redirige bien vers HTTPS et que la réponse finale porte réellement HSTS"],
    },
    deepDive: [
      {
        h: { en: "How the A to F grade is calculated", fr: "Comment la note de A à F est calculée" },
        p: {
          en: [
            "The grade counts missing headers among four: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options and X-Frame-Options. All four present gives A. One missing gives B, two give C, three give D, and a site with none of them gets F. That's the whole formula.",
            "A header that is there but set wrong is flagged in orange rather than counted as missing. The typical case is X-Content-Type-Options with any value other than exactly nosniff. X-Frame-Options also counts as present when the Content-Security-Policy contains a frame-ancestors directive, since that directive does the same job in current browsers.",
            "Other checkers grade differently. Some go up to A+ and also look at Cross-Origin-Opener-Policy or Cross-Origin-Resource-Policy, so the same site can get a B here and a C elsewhere. Don't compare letters between tools. Compare the list of headers each one found.",
          ],
          fr: [
            "La note compte les absences parmi quatre en-têtes : Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options et X-Frame-Options. Les quatre présents, c'est A. Un manquant donne B, deux donnent C, trois donnent D, et un site qui n'en a aucun obtient F. C'est toute la formule.",
            "Un en-tête présent mais mal réglé apparaît en orange au lieu d'être compté comme absent. Le cas le plus courant : X-Content-Type-Options avec une autre valeur que nosniff, écrit exactement ainsi. X-Frame-Options compte aussi comme présent quand la Content-Security-Policy contient une directive frame-ancestors, qui joue le même rôle dans les navigateurs actuels.",
            "Les autres outils ne notent pas pareil. Certains montent jusqu'à A+ et regardent aussi Cross-Origin-Opener-Policy ou Cross-Origin-Resource-Policy : le même site peut avoir B ici et C ailleurs. Ne comparez pas les lettres d'un outil à l'autre, comparez la liste des en-têtes trouvés.",
          ],
        },
      },
      {
        h: { en: "A real example: utilisio.com gets a B", fr: "Un exemple réel : utilisio.com obtient B" },
        p: {
          en: [
            "This site's own headers grade B. HSTS is there (max-age=15768000, six months, with includeSubDomains), X-Frame-Options is DENY, X-Content-Type-Options is nosniff and Referrer-Policy is strict-origin-when-cross-origin. The missing one is Content-Security-Policy.",
            "The reason is practical. These pages load Google's ad script, a consent platform and, once you accept, analytics, each pulling code from domains Google can change without notice. A strict policy would block some of them. A loose one full of wildcards and 'unsafe-inline' would earn the A while protecting very little. Until a policy that is both strict and working is written, the honest result is B.",
            "Notice what the grade doesn't say. Our HSTS max-age is half the one-year value the tool suggests, and it still counts as present, because the check is about presence. The letter is where you start reading, not the conclusion.",
          ],
          fr: [
            "Les en-têtes de ce site obtiennent B. HSTS est là (max-age=15768000, soit six mois, avec includeSubDomains), X-Frame-Options vaut DENY, X-Content-Type-Options vaut nosniff et Referrer-Policy vaut strict-origin-when-cross-origin. Celui qui manque, c'est Content-Security-Policy.",
            "La raison est concrète. Ces pages chargent le script publicitaire de Google, une plateforme de consentement et, une fois votre accord donné, la mesure d'audience, chacun tirant du code de domaines que Google peut changer sans prévenir. Une politique stricte en bloquerait une partie. Une politique permissive, pleine de jokers et de 'unsafe-inline', décrocherait le A sans protéger grand-chose. Tant qu'une politique à la fois stricte et fonctionnelle n'est pas écrite, le résultat honnête est B.",
            "Regardez aussi ce que la note ne dit pas. Notre max-age HSTS fait la moitié de l'année conseillée par l'outil, et il compte quand même comme présent, parce que le contrôle porte sur la présence. La lettre est un point de départ, pas une conclusion.",
          ],
        },
      },
      {
        h: { en: "What the checker doesn't see", fr: "Ce que l'outil ne voit pas" },
        p: {
          en: [
            "It checks that a header exists, not that it's strong. A Content-Security-Policy made of default-src * 'unsafe-inline' gets the same credit as a tight one. An HSTS header set to max-age=0, which actually tells browsers to forget HSTS, still counts as present. Read the values in the list, not just the colors.",
            "It sends a single HEAD request to the address you enter, follows redirects and reads the headers of the final response, whatever its status code. Some servers answer HEAD differently from GET, and many set headers per path: your HTML pages may carry a CSP that your /api routes or static files don't. Test the pages that matter, not only the home page.",
            "Private addresses are refused: localhost, internal IP ranges and private TLDs. That protects the server doing the fetch, but it means a staging site on your LAN has to be checked from your own machine, with curl.",
          ],
          fr: [
            "Il vérifie qu'un en-tête existe, pas qu'il est solide. Une Content-Security-Policy réduite à default-src * 'unsafe-inline' reçoit le même crédit qu'une politique serrée. Un HSTS réglé à max-age=0, qui demande en réalité aux navigateurs d'oublier HSTS, compte quand même comme présent. Lisez les valeurs affichées, pas seulement les couleurs.",
            "Il envoie une seule requête HEAD à l'adresse saisie, suit les redirections et lit les en-têtes de la réponse finale, quel que soit son code HTTP. Certains serveurs répondent différemment à HEAD et à GET, et beaucoup règlent les en-têtes par chemin : vos pages HTML peuvent porter une CSP que vos routes /api ou vos fichiers statiques n'ont pas. Testez les pages qui comptent, pas seulement l'accueil.",
            "Les adresses privées sont refusées : localhost, plages d'IP internes et TLD privés. Cela protège le serveur qui fait la requête, mais un site de préproduction sur votre réseau local se vérifie depuis votre propre machine, avec curl.",
          ],
        },
      },
      {
        h: { en: "Adding the missing headers on Nginx or Plesk", fr: "Ajouter les en-têtes manquants sous Nginx ou Plesk" },
        p: {
          en: [
            "On Nginx, each header is one add_header line in the server block, for example add_header X-Content-Type-Options \"nosniff\" always; Keep the always keyword. Without it, Nginx only sends the header on successful and redirect responses, so your 404 and 500 pages go out unprotected.",
            "The trap that catches almost everyone: add_header is inherited from the server block only if the location block defines no add_header of its own. Add a single Cache-Control header inside a location and every security header set higher up disappears for that path. After any change, reload Nginx and retest one of the affected URLs, not just the home page.",
            "On Plesk, open the domain, go to Apache & nginx Settings and paste the same add_header lines into Additional nginx directives. If the site sits behind a CDN, the CDN may cache the old response headers: purge it before you retest, or you'll be checking yesterday's configuration.",
            "On this site, three headers come from the application itself (Next.js headers() in next.config.ts), while HSTS is added by the server in front of it. Splitting headers between the app and the proxy works, as long as you remember which layer sets which one.",
          ],
          fr: [
            "Sous Nginx, chaque en-tête tient en une ligne add_header dans le bloc server, par exemple add_header X-Content-Type-Options \"nosniff\" always; Gardez le mot-clé always. Sans lui, Nginx n'envoie l'en-tête que sur les réponses réussies et les redirections : vos pages 404 et 500 partent sans protection.",
            "Le piège qui attrape presque tout le monde : add_header n'est hérité du bloc server que si le bloc location n'en définit aucun lui-même. Ajoutez un simple Cache-Control dans une location, et tous les en-têtes de sécurité définis plus haut disparaissent pour ce chemin. Après chaque modification, rechargez Nginx et retestez une des URL concernées, pas seulement l'accueil.",
            "Sous Plesk, ouvrez le domaine, allez dans Paramètres d'Apache et de nginx, et collez les mêmes lignes add_header dans Directives nginx supplémentaires. Si le site passe par un CDN, celui-ci peut garder en cache les anciens en-têtes : purgez-le avant de retester, sinon vous vérifiez la configuration d'hier.",
            "Sur ce site, trois en-têtes viennent de l'application elle-même (headers() de Next.js dans next.config.ts), tandis que HSTS est ajouté par le serveur placé devant. Répartir les en-têtes entre l'application et le proxy fonctionne très bien, à condition de savoir quelle couche pose lequel.",
          ],
        },
      },
      {
        h: { en: "Doing the same check with curl", fr: "Faire le même contrôle avec curl" },
        p: {
          en: [
            "curl -sIL https://example.com sends the same kind of HEAD request, follows redirects with -L and prints every header of each response in the chain. Pipe it through grep -i to keep only the security ones. It's the right tool for a staging server this page can't reach, or for a script that checks headers after every deploy.",
            "What this page adds is the reading: which headers count, which value is wrong, and the exact line to add. Results are kept for one minute, so if a retest right after a change still shows the old values, wait a moment and run it again.",
          ],
          fr: [
            "curl -sIL https://example.com envoie le même type de requête HEAD, suit les redirections grâce à -L et affiche tous les en-têtes de chaque réponse de la chaîne. Filtrez avec grep -i pour ne garder que ceux de sécurité. C'est le bon outil pour un serveur de préproduction que cette page ne peut pas joindre, ou pour un script qui vérifie les en-têtes après chaque déploiement.",
            "Ce que cette page ajoute, c'est la lecture : quels en-têtes comptent, quelle valeur est fausse, et la ligne exacte à ajouter. Les résultats sont gardés une minute : si un nouveau test juste après une modification montre encore les anciennes valeurs, patientez un instant et relancez.",
          ],
        },
      },
    ],
  },
  "border-radius": {
    desc: {
      en: "This generator exposes all four corners of border-radius independently (top-left, top-right, bottom-right, bottom-left, in that exact CSS shorthand order) with a link toggle to move them together or a slider per corner to break the symmetry. Switch the unit between px (0–200) and % before you start: percentage values are calculated separately against the element's width and height, so on a non-square box a 50% radius produces elliptical corners, not circles, a detail that trips people up when they copy a percentage value from a square swatch onto a wide button. For a true circle, radius must be 50% on an element where width equals height; for a pill-shaped button, set the radius to at least half the element's height rather than an arbitrary large px number. The CSS is generated live below the preview and copies as a single value when all four corners match, or the four-value shorthand when they don't.",
      fr: "Ce générateur expose les quatre coins de border-radius indépendamment (haut-gauche, haut-droite, bas-droite, bas-gauche, dans l'ordre exact du raccourci CSS) avec un bouton de liaison pour les faire varier ensemble, ou un curseur par coin pour casser la symétrie. Choisissez l'unité avant de commencer, px (0 à 200) ou % : les valeurs en pourcentage se calculent séparément par rapport à la largeur et à la hauteur de l'élément, donc sur un bloc non carré, un rayon à 50% produit des coins elliptiques, pas des cercles, un détail qui piège souvent quand on recopie une valeur testée sur un carré vers un bouton large. Pour un cercle parfait, il faut 50% sur un élément dont la largeur égale la hauteur ; pour un bouton en pilule, réglez le rayon à au moins la moitié de la hauteur de l'élément plutôt qu'une valeur en px choisie au hasard. Le CSS se génère en temps réel sous l'aperçu et se copie en une seule valeur quand les quatre coins sont identiques, ou en raccourci à quatre valeurs sinon.",
    },
    useCases: {
      en: ["Pill-shaped buttons and tags, set the radius to half the button's height, not a fixed px guess", "Chat bubbles or notification badges with one flattened corner (e.g. bottom-left at 4px, others at 16px) to point toward the sender", "Card UI where only the top two corners are rounded (modals, bottom sheets, image headers)", "Approximating an iOS-style app icon, note this is a visual approximation, not a true squircle superellipse curve"],
      fr: ["Boutons et tags en forme de pilule, réglez le rayon à la moitié de la hauteur du bouton, pas une valeur en px au hasard", "Bulles de discussion ou badges de notification avec un coin aplati (ex. bas-gauche à 4px, les autres à 16px) pour pointer vers l'expéditeur", "Cartes UI dont seuls les deux coins du haut sont arrondis (modales, bottom sheets, en-têtes d'image)", "Approximer une icône d'app style iOS, attention, c'est une approximation visuelle, pas une vraie courbe superellipse (squircle)"],
    },
  },
  "timestamp": {
    desc: {
      en: "Paste a Unix timestamp in seconds and get six representations at once: seconds, milliseconds, ISO 8601, the UTC string, your browser's local time, and a plain YYYY-MM-DD date. The most common error with this kind of tool isn't a bug, it's the input: a 13-digit millisecond timestamp (the kind Date.now() or many JSON APIs return) pasted into a field expecting 10-digit seconds lands somewhere around the year 5138, not next Tuesday, multiply or divide by 1000 depending on which direction you're converting. The 'Local' row reflects the timezone of whoever's browser is open, not a fixed server timezone, so the same timestamp will show a different local time to a colleague in another country, only the UTC and ISO rows are timezone-independent and safe to paste into a bug report. Converting the other direction, from a date picker back to Unix seconds, is also timezone-sensitive: midnight in your local time is not midnight UTC.",
      fr: "Collez un timestamp Unix en secondes et obtenez six représentations en même temps : secondes, millisecondes, ISO 8601, la chaîne UTC, l'heure locale de votre navigateur, et une date simple au format YYYY-MM-DD. L'erreur la plus fréquente avec ce genre d'outil n'est pas un bug, c'est la saisie : un timestamp en millisecondes à 13 chiffres (celui que renvoie Date.now() ou beaucoup d'API JSON) collé dans un champ qui attend des secondes à 10 chiffres atterrit vers l'an 5138, pas mardi prochain : il faut multiplier ou diviser par 1000 selon le sens de la conversion. La ligne « Local » reflète le fuseau horaire du navigateur ouvert, pas un fuseau serveur fixe : le même timestamp affichera une heure locale différente à un collègue dans un autre pays, seules les lignes UTC et ISO sont indépendantes du fuseau et sûres à coller dans un rapport de bug. La conversion dans l'autre sens, d'un sélecteur de date vers un timestamp Unix, est aussi sensible au fuseau : minuit en heure locale n'est pas minuit UTC.",
    },
    useCases: {
      en: ["Debugging why a JWT 'exp' claim or database timestamp column looks wrong, check whether it's seconds or milliseconds first", "Converting an API response timestamp into a readable date for a support ticket or bug report", "Checking if a scheduled job's Unix time actually falls where you expect once timezone is accounted for", "Quickly generating 'now' as a Unix timestamp to paste into a test fixture or cURL request"],
      fr: ["Déboguer pourquoi un claim 'exp' de JWT ou une colonne timestamp en base semble faux, vérifier d'abord si c'est en secondes ou en millisecondes", "Convertir le timestamp d'une réponse API en date lisible pour un ticket support ou un rapport de bug", "Vérifier que l'heure Unix d'une tâche planifiée tombe bien où on l'attend une fois le fuseau pris en compte", "Générer rapidement 'maintenant' en timestamp Unix à coller dans un fixture de test ou une requête cURL"],
    },
  },
  "favicon-generator": {
    desc: {
      en: "Type one or two characters, pick a background and text color (or one of six presets), and the canvas renders a live preview at 16, 32, 48 and 64px simultaneously, useful for checking legibility at browser-tab size before committing to a design. One honest limitation: the '.ico' download in this tool is a PNG image saved with an .ico file extension, not a true multi-resolution ICO container. Every current browser (Chrome, Firefox, Edge, Safari) accepts this without complaint when referenced via a standard <link rel=\"icon\"> tag, but software that inspects the actual file signature (some older build tools or strict validators) will flag it as a mismatched format. This tool also tops out at 64px, which covers browser tabs and bookmarks but not the larger icons modern platforms expect: a 180×180 apple-touch-icon for iOS home screens or a 512×512 icon for a PWA manifest need to be generated separately at full size, ideally from a vector source rather than upscaled from a 64px canvas.",
      fr: "Tapez un ou deux caractères, choisissez une couleur de fond et de texte (ou l'un des six presets), et le canvas affiche un aperçu en direct à 16, 32, 48 et 64px simultanément, utile pour vérifier la lisibilité à la taille d'un onglet de navigateur avant de valider un design. Une limite honnête : le téléchargement « .ico » de cet outil est en réalité une image PNG enregistrée avec l'extension .ico, pas un vrai conteneur ICO multi-résolution. Tous les navigateurs actuels (Chrome, Firefox, Edge, Safari) l'acceptent sans problème via une balise standard <link rel=\"icon\">, mais un logiciel qui inspecte la signature réelle du fichier (certains outils de build anciens ou validateurs stricts) le signalera comme un format incohérent. L'outil plafonne aussi à 64px, ce qui couvre les onglets et favoris de navigateur mais pas les icônes plus grandes attendues par les plateformes modernes : un apple-touch-icon 180×180 pour l'écran d'accueil iOS ou une icône 512×512 pour un manifest PWA doivent être générés séparément en pleine taille, idéalement depuis une source vectorielle plutôt qu'agrandis depuis un canvas de 64px.",
    },
    useCases: {
      en: ["Quick placeholder favicon for a side project or local dev environment before a real logo exists", "Testing whether a two-letter monogram stays legible at 16px before finalizing brand colors", "Generating a favicon that matches an exact brand hex color without opening a design tool", "Producing the small browser-tab sizes only, pair with a separate 512px export for app icons and PWA manifests"],
      fr: ["Favicon provisoire rapide pour un projet perso ou un environnement de dev local avant qu'un vrai logo existe", "Tester si un monogramme à deux lettres reste lisible à 16px avant de figer les couleurs de marque", "Générer un favicon qui correspond exactement à une couleur hexadécimale de marque sans ouvrir d'outil de design", "Produire uniquement les petites tailles d'onglet, à compléter par un export 512px séparé pour les icônes d'app et manifests PWA"],
    },
  },
  "jwt-decoder": {
    desc: {
      en: "Paste a JWT and the tool splits it on the two dots into header, payload and signature, base64url-decodes the first two parts, and pretty-prints the JSON, no library, no server round-trip, decoding happens with a few lines of atob() in your browser. It automatically converts the exp, iat and nbf claims from raw Unix seconds into a readable ISO date next to the number, and marks the token as expired or valid by comparing exp against your current system clock. The one thing this tool deliberately does not do is verify the signature: decoding a JWT only tells you what the token claims, not whether whoever issued it actually holds the matching secret or private key. A token can decode perfectly and still be forged, expired-but-accepted by a buggy server, or signed with an algorithm the server never checks, the historical 'alg: none' vulnerability class exploited exactly that gap between decoding and verifying. Treat this as a debugging aid, never as proof that a token is authentic.",
      fr: "Collez un JWT et l'outil le découpe sur les deux points en header, payload et signature, décode les deux premières parties en base64url, et affiche le JSON formaté, aucune bibliothèque, aucun aller-retour serveur, le décodage tient en quelques lignes d'atob() dans votre navigateur. Il convertit automatiquement les claims exp, iat et nbf, exprimés en secondes Unix brutes, en date ISO lisible juste à côté du nombre, et marque le token comme expiré ou valide en comparant exp à l'horloge système actuelle. La seule chose que cet outil ne fait volontairement pas, c'est vérifier la signature : décoder un JWT indique seulement ce que le token prétend, pas si celui qui l'a émis détient réellement le secret ou la clé privée correspondante. Un token peut se décoder parfaitement et être quand même forgé, expiré-mais-accepté par un serveur bugué, ou signé avec un algorithme que le serveur ne vérifie jamais, la vulnérabilité historique « alg: none » exploitait exactement cet écart entre décoder et vérifier. Considérez cet outil comme une aide au débogage, jamais comme une preuve d'authenticité.",
    },
    useCases: {
      en: ["Inspecting what claims are actually inside a JWT your app just received, without adding a console.log to backend code", "Checking whether an access token has actually expired when a user reports being logged out unexpectedly", "Verifying the payload shape matches what your auth provider's docs describe before writing integration code", "Confirming which signing algorithm (HS256, RS256…) a third-party token uses before configuring your verifier"],
      fr: ["Inspecter les claims réellement présents dans un JWT que votre app vient de recevoir, sans ajouter de console.log côté backend", "Vérifier si un access token est réellement expiré quand un utilisateur signale une déconnexion inattendue", "Vérifier que la forme du payload correspond à ce que décrit la doc de votre fournisseur d'auth avant d'écrire le code d'intégration", "Confirmer quel algorithme de signature (HS256, RS256…) utilise un token tiers avant de configurer votre vérificateur"],
    },
  },
  "robots-txt": {
    desc: {
      en: "Build a robots.txt file from as many User-agent blocks as you need (each with its own Disallow and Allow paths) plus a Sitemap line, then copy the result or download it as a plain .txt file. Separate blocks matter more than they used to: you can now write one rule set for Googlebot and a stricter one for AI training crawlers like GPTBot or CCBot, since more sites are opting specific bots out while leaving search indexing untouched. The mistake this tool won't stop you from making: robots.txt is a public file and a request, not a lock. Every crawler that respects it (and plenty don't) can still read the exact paths you listed under Disallow before deciding not to index them, so putting /admin/ or /internal-api/ in a Disallow rule announces that path to anyone who fetches /robots.txt, it doesn't hide it. Sensitive paths need actual authentication, not a crawling directive. The Sitemap field also accepts one absolute URL at a time; a site with multiple sitemap files (a sitemap index setup) needs one Sitemap: line per file, added by hand after generating the base rules here.",
      fr: "Construisez un fichier robots.txt à partir d'autant de blocs User-agent que nécessaire (chacun avec ses propres chemins Disallow et Allow) plus une ligne Sitemap, puis copiez le résultat ou téléchargez-le en fichier .txt brut. Séparer les blocs compte plus qu'avant : vous pouvez désormais écrire une règle pour Googlebot et une règle plus stricte pour les crawlers d'entraînement IA comme GPTBot ou CCBot, de plus en plus de sites excluant des bots spécifiques tout en laissant l'indexation de recherche intacte. L'erreur que cet outil ne vous empêchera pas de commettre : robots.txt est un fichier public et une demande, pas un verrou. Tout crawler qui le respecte (et beaucoup ne le font pas) peut quand même lire les chemins exacts listés sous Disallow avant de décider de ne pas les indexer, donc mettre /admin/ ou /internal-api/ dans une règle Disallow annonce ce chemin à quiconque récupère /robots.txt, ça ne le cache pas. Les chemins sensibles ont besoin d'une vraie authentification, pas d'une directive de crawl. Le champ Sitemap n'accepte qu'une seule URL absolue à la fois ; un site avec plusieurs fichiers sitemap (configuration en index de sitemaps) nécessite une ligne Sitemap: par fichier, à ajouter à la main après avoir généré les règles de base ici.",
    },
    useCases: {
      en: ["Blocking a staging or admin subdirectory from search engines while keeping the rest of the site crawlable", "Writing a separate rule to opt specific AI crawlers (GPTBot, CCBot, Google-Extended) out of training-data scraping", "Generating a clean robots.txt for a new site launch, including the sitemap reference in the same file", "Quickly checking what a proposed robots.txt would look like before pasting it into production and breaking indexing"],
      fr: ["Bloquer un sous-répertoire de staging ou d'admin aux moteurs de recherche tout en gardant le reste du site indexable", "Écrire une règle séparée pour exclure des crawlers IA spécifiques (GPTBot, CCBot, Google-Extended) du scraping pour l'entraînement", "Générer un robots.txt propre pour le lancement d'un nouveau site, en incluant la référence au sitemap dans le même fichier", "Vérifier rapidement à quoi ressemblerait un robots.txt proposé avant de le coller en production et de casser l'indexation"],
    },
  },
  "base-converter": {
    desc: {
      en: "Type a number in one base (decimal, hexadecimal, octal or binary) and this converts it to all four simultaneously, using JavaScript's native parseInt/toString rather than a hand-rolled parser, so results match exactly what a script using the same functions would produce. Hex is the one you'll reach for most: colors (#00e08a), memory addresses, and MAC/UUID fragments are conventionally written in hex because two hex digits map cleanly onto one byte (00–FF). Binary matters when you're reading bitwise flags or subnet masks, where each digit corresponds to one bit rather than needing mental math from decimal. One limitation to know: the input is treated as an unsigned integer: there's no support for negative numbers or fractional values, so a two's-complement negative binary value won't convert the way it would in a language-specific integer type.",
      fr: "Tapez un nombre dans une base (décimal, hexadécimal, octal ou binaire) et il se convertit simultanément dans les quatre, en utilisant parseInt/toString natifs de JavaScript plutôt qu'un parseur maison, donc les résultats correspondent exactement à ce que produirait un script utilisant les mêmes fonctions. Le hexadécimal est celui que vous utiliserez le plus souvent : couleurs (#00e08a), adresses mémoire, fragments de MAC/UUID s'écrivent conventionnellement en hexadécimal car deux chiffres hexadécimaux correspondent exactement à un octet (00 à FF). Le binaire compte quand vous lisez des flags bit à bit ou des masques de sous-réseau, où chaque chiffre correspond à un bit plutôt que de demander un calcul mental depuis le décimal. Une limite à connaître : la saisie est traitée comme un entier non signé, pas de support pour les nombres négatifs ou les valeurs à virgule, donc une valeur binaire négative en complément à deux ne se convertira pas comme elle le ferait dans un type entier spécifique à un langage.",
    },
    useCases: {
      en: ["Converting a hex color code to its decimal RGB components for a config file that doesn't accept hex", "Reading bitwise permission flags or feature flags written in binary", "Translating old Unix file permission octal notation (like 755) to understand what it actually grants", "Checking a memory address or byte value across bases while debugging low-level code"],
      fr: ["Convertir un code couleur hexadécimal en ses composantes RGB décimales pour un fichier de config qui n'accepte pas le hexadécimal", "Lire des flags de permission ou des feature flags écrits en binaire", "Traduire l'ancienne notation octale des permissions Unix (comme 755) pour comprendre ce qu'elle accorde réellement", "Vérifier une adresse mémoire ou une valeur d'octet dans différentes bases en déboguant du code bas niveau"],
    },
  },
  "box-shadow": {
    desc: {
      en: "Five independent sliders (offset X, offset Y, blur, spread, and alpha) plus an inset toggle build a box-shadow value and preview it live against the panel background. Spread is the one people misunderstand: a positive value grows the shadow's box in every direction before blur softens the edges, while a negative spread shrinks it, useful for a tight shadow that hugs the element instead of ballooning past its edges. This generator produces one shadow at a time; layering multiple shadows (a common technique for a soft ambient shadow plus a sharp contact shadow underneath it) means generating each one separately here and combining them by hand with commas in your CSS. The alpha slider is what actually makes a shadow look natural, a shadow at 100% opacity black reads as a hard silhouette, while real-world shadows this tool defaults toward 25% alpha, closer to how light actually falls.",
      fr: "Cinq curseurs indépendants (décalage X, décalage Y, flou, extension (spread), et alpha) plus un bouton inset construisent une valeur box-shadow et l'aperçoivent en direct sur le fond du panneau. Le spread est celui qu'on comprend souvent mal : une valeur positive agrandit la boîte de l'ombre dans toutes les directions avant que le flou n'adoucisse les bords, tandis qu'un spread négatif la réduit, utile pour une ombre resserrée qui colle à l'élément au lieu de déborder largement de ses bords. Ce générateur produit une seule ombre à la fois ; superposer plusieurs ombres (une technique courante pour une ombre ambiante douce plus une ombre de contact nette en dessous) demande de générer chacune séparément ici et de les combiner à la main avec des virgules dans votre CSS. Le curseur alpha est ce qui rend vraiment une ombre naturelle, une ombre noire à 100% d'opacité se lit comme une silhouette dure, alors que cet outil part par défaut sur 25% d'alpha, plus proche de la façon dont la lumière tombe réellement.",
    },
    useCases: {
      en: ["Building a soft elevated-card shadow for a design system without guessing blur/spread values by hand", "Creating a tight 'contact shadow' with negative spread that hugs a button instead of ballooning outward", "Prototyping an inset shadow for a pressed-button or input-field state", "Fine-tuning shadow alpha to match a specific dark or light theme instead of reusing a default black"],
      fr: ["Construire une ombre douce de carte surélevée pour un design system sans deviner les valeurs de flou/spread à la main", "Créer une « ombre de contact » resserrée avec un spread négatif qui colle à un bouton au lieu de déborder", "Prototyper une ombre inset pour un état de bouton pressé ou de champ de saisie", "Affiner l'alpha de l'ombre pour correspondre à un thème sombre ou clair spécifique plutôt que de réutiliser un noir par défaut"],
    },
  },
  "color-picker": {
    desc: {
      en: "Pick a color with the native browser picker or type a hex value directly, and every common format appears at once: HEX, RGB, HSL, HSV, plus the individual R/G/B channel values, click any row to copy just that one. HSL and HSV look similar but solve different problems: HSL's lightness runs from black through the pure hue to white, which is what CSS animations and design tokens usually want, while HSV's value/brightness axis (closer to how paint mixing or Photoshop's picker behaves) makes it easier to darken a color without washing it toward gray. One real constraint: the native <input type=\"color\"> this tool wraps doesn't support alpha/transparency, if you need a semi-transparent color, get the HEX or RGB here and add the alpha channel by hand (an 8-digit hex like #00e08a80, or rgba()).",
      fr: "Choisissez une couleur avec le sélecteur natif du navigateur ou tapez directement une valeur hexadécimale, et tous les formats courants apparaissent en même temps : HEX, RGB, HSL, HSV, plus les valeurs individuelles des canaux R/G/B, cliquez sur une ligne pour ne copier que celle-ci. HSL et HSV se ressemblent mais résolvent des problèmes différents : la luminosité (lightness) de HSL va du noir à la teinte pure jusqu'au blanc, ce que les animations CSS et les tokens de design veulent généralement, tandis que l'axe valeur/luminosité de HSV (plus proche du mélange de peinture ou du sélecteur de Photoshop) facilite l'assombrissement d'une couleur sans la délaver vers le gris. Une vraie contrainte : le <input type=\"color\"> natif que cet outil encapsule ne supporte pas l'alpha/la transparence, si vous avez besoin d'une couleur semi-transparente, récupérez le HEX ou le RGB ici et ajoutez le canal alpha à la main (un hexadécimal à 8 chiffres comme #00e08a80, ou rgba()).",
    },
    useCases: {
      en: ["Converting a design tool's HEX swatch into the RGB or HSL syntax a specific CSS property expects", "Grabbing the individual R, G, B channel values needed for a canvas or shader calculation", "Understanding why an HSL lightness tweak looks duller than expected, compare it against the HSV value axis", "Quickly reading off a brand color's exact values to hand to a developer or design tool"],
      fr: ["Convertir une teinte HEX d'un outil de design vers la syntaxe RGB ou HSL attendue par une propriété CSS spécifique", "Récupérer les valeurs individuelles des canaux R, G, B nécessaires pour un calcul canvas ou shader", "Comprendre pourquoi un ajustement de luminosité HSL paraît plus terne que prévu, comparer avec l'axe valeur de HSV", "Relever rapidement les valeurs exactes d'une couleur de marque à transmettre à un développeur ou un outil de design"],
    },
  },
  "contrast-checker": {
    desc: {
      en: "Pick a text color and a background color and this computes the WCAG 2.1 contrast ratio using the actual spec formula, sRGB channels linearized with the standard gamma curve, relative luminance weighted 0.2126/0.7152/0.0722 for red/green/blue, then (L1+0.05)/(L2+0.05) between the lighter and darker color. The ratio is graded against all four WCAG thresholds at once: AA requires 4.5:1 for normal text and only 3:1 for large text, AAA requires 7:1 and 4.5:1 respectively. 'Large text' has a precise legal definition that trips people up, 18pt (24px) regular weight, or 14pt (roughly 18.66px) bold, not a vague 'looks big' judgment, so a 20px bold heading qualifies for the relaxed threshold but a 20px regular-weight one does not. A ratio can pass AA and still be genuinely hard to read for someone with low vision in bright sunlight; treat these thresholds as a legal minimum, not a design target to hit exactly.",
      fr: "Choisissez une couleur de texte et une couleur de fond, et l'outil calcule le ratio de contraste WCAG 2.1 avec la formule exacte de la spec, canaux sRGB linéarisés selon la courbe gamma standard, luminance relative pondérée à 0,2126/0,7152/0,0722 pour rouge/vert/bleu, puis (L1+0,05)/(L2+0,05) entre la couleur claire et la couleur foncée. Le ratio est noté sur les quatre seuils WCAG à la fois : AA exige 4,5:1 pour le texte normal et seulement 3:1 pour le grand texte, AAA exige respectivement 7:1 et 4,5:1. Le « grand texte » a une définition légale précise qui piège souvent : 18pt (24px) en graisse normale, ou 14pt (environ 18,66px) en gras, pas un jugement vague de « ça paraît grand », donc un titre en 20px gras est éligible au seuil allégé, mais le même en 20px normal ne l'est pas. Un ratio peut passer AA et rester réellement difficile à lire pour une personne malvoyante en plein soleil ; considérez ces seuils comme un minimum légal, pas un objectif de design à viser exactement.",
    },
    useCases: {
      en: ["Verifying a brand color pairing meets WCAG AA before it becomes the default text/background combo in a design system", "Checking whether a heading can drop to the relaxed 'large text' threshold because of its exact font size and weight", "Auditing an existing site's color pairs for an accessibility compliance review", "Testing a color choice against both AA and AAA at once instead of looking up thresholds separately"],
      fr: ["Vérifier qu'une association de couleurs de marque respecte le WCAG AA avant qu'elle ne devienne la combinaison texte/fond par défaut d'un design system", "Vérifier si un titre peut bénéficier du seuil allégé « grand texte » grâce à sa taille et sa graisse exactes", "Auditer les paires de couleurs d'un site existant dans le cadre d'une revue de conformité accessibilité", "Tester un choix de couleur contre AA et AAA en même temps plutôt que de chercher les seuils séparément"],
    },
  },
  "css-grid": {
    desc: {
      en: "Set column count, row count and gap with sliders (up to 12 columns, 8 rows), pick a column sizing unit (fr, px or %) and watch the grid preview update live while the CSS generates below using repeat() shorthand for both axes. Fr units are the one worth understanding if you're new to Grid: 1fr means 'one share of whatever space is left after fixed-size tracks are subtracted,' not a fixed size, which is why a 3-column grid at 1fr each stays perfectly equal no matter how wide the container gets, px columns won't. This tool always generates uniform tracks through repeat(count, size), so every column shares the same size and every row shares the same size; a real-world layout with a fixed sidebar next to a flexible content area (grid-template-columns: 240px 1fr) needs mixed track sizes that you'll have to write by hand after copying the base output here.",
      fr: "Réglez le nombre de colonnes, de lignes et l'espacement (gap) avec des curseurs (jusqu'à 12 colonnes, 8 lignes), choisissez une unité de dimensionnement des colonnes (fr, px ou %) et observez l'aperçu de la grille se mettre à jour en direct pendant que le CSS se génère en dessous, en utilisant le raccourci repeat() sur les deux axes. L'unité fr est celle qu'il faut vraiment comprendre si vous débutez avec Grid : 1fr signifie « une part de l'espace restant une fois les pistes de taille fixe soustraites », pas une taille fixe : c'est pourquoi une grille à 3 colonnes en 1fr chacune reste parfaitement égale quelle que soit la largeur du conteneur, contrairement à des colonnes en px. Cet outil génère toujours des pistes uniformes via repeat(count, size), donc chaque colonne partage la même taille et chaque ligne partage la même taille ; une mise en page réelle avec une barre latérale fixe à côté d'une zone de contenu flexible (grid-template-columns: 240px 1fr) demande des tailles de piste mixtes que vous devrez écrire à la main après avoir copié le résultat de base ici.",
    },
    useCases: {
      en: ["Prototyping a uniform photo gallery or card grid before writing the final CSS by hand", "Understanding visually why fr units behave differently from px when the container resizes", "Generating the base grid-template-columns/rows syntax to then customize with mixed track sizes", "Testing how gap size changes the visual density of a grid layout before committing to a value"],
      fr: ["Prototyper une galerie photo ou une grille de cartes uniforme avant d'écrire le CSS final à la main", "Comprendre visuellement pourquoi les unités fr se comportent différemment des px quand le conteneur change de taille", "Générer la syntaxe de base grid-template-columns/rows pour ensuite la personnaliser avec des tailles de piste mixtes", "Tester comment la taille du gap change la densité visuelle d'une grille avant de valider une valeur"],
    },
  },
  "css-minifier": {
    desc: {
      en: "Strips comments, collapses whitespace, tightens the spacing around braces/colons/semicolons and removes the final semicolon before each closing brace, the same category of transform tools like cssnano perform, but done here with a fixed set of regular expressions rather than a full CSS parser. That distinction matters in one specific edge case: because the minifier works on text patterns, not a parsed syntax tree, a literal semicolon or brace character sitting inside a quoted string value (content: \";\"; for instance) can be mangled the same as real CSS syntax would be. For everyday stylesheets (layout rules, typography, media queries) this doesn't come up, and the character-count savings shown below the output (usually 20–40% depending on how much whitespace and how many comments the source had) are a reasonably accurate preview of what a build-tool minifier would achieve.",
      fr: "Supprime les commentaires, réduit les espaces, resserre l'espacement autour des accolades/deux-points/points-virgules et retire le point-virgule final avant chaque accolade fermante, le même type de transformation qu'un outil comme cssnano, mais réalisé ici avec un jeu fixe d'expressions régulières plutôt qu'un parseur CSS complet. Cette distinction compte dans un cas précis : comme le minificateur travaille sur des motifs de texte, pas sur un arbre syntaxique analysé, un point-virgule ou une accolade littéral présent dans une valeur de chaîne entre guillemets (content: \";\"; par exemple) peut être altéré comme le serait une vraie syntaxe CSS. Pour les feuilles de style courantes (règles de mise en page, typographie, media queries) ce cas ne se présente pas, et le gain en nombre de caractères affiché sous le résultat (généralement 20 à 40% selon la quantité d'espaces et de commentaires de la source) donne un aperçu raisonnablement fiable de ce qu'obtiendrait un minificateur intégré à un build.",
    },
    useCases: {
      en: ["Shrinking a stylesheet before pasting it into a CodePen, email template, or anywhere a build step isn't available", "Quickly checking how much dead weight comments and formatting add to a CSS file", "Preparing CSS for inline use in an HTML <style> tag where every byte counts", "Cleaning up CSS copied from a design tool or browser inspector before reusing it"],
      fr: ["Réduire une feuille de style avant de la coller dans un CodePen, un email template, ou partout où une étape de build n'est pas disponible", "Vérifier rapidement combien de poids mort les commentaires et le formatage ajoutent à un fichier CSS", "Préparer du CSS pour un usage inline dans une balise <style> HTML où chaque octet compte", "Nettoyer du CSS copié depuis un outil de design ou l'inspecteur du navigateur avant de le réutiliser"],
    },
  },
  "csv-json": {
    desc: {
      en: "Switch direction with one toggle: paste CSV and get a JSON array of objects keyed by the header row, or paste a JSON array and get CSV back with values containing commas or quotes automatically wrapped and escaped. The CSV-to-JSON side is intentionally simple: it splits each line on commas, which handles typical exports fine but will misread a quoted field that itself contains a comma, like \"Doe, John\" in a name column: that value will split into two columns instead of staying together. For CSV that only ever came from a spreadsheet export with commas inside quoted text fields, double-check the header count in the output matches what you expect before trusting it for anything beyond a quick look. The JSON-to-CSV direction is more robust, since it controls the escaping itself.",
      fr: "Changez de sens en un clic : collez du CSV et obtenez un tableau JSON d'objets avec les clés de la ligne d'en-tête, ou collez un tableau JSON et récupérez du CSV avec les valeurs contenant des virgules ou des guillemets automatiquement entourées et échappées. Le sens CSV vers JSON est volontairement simple : il découpe chaque ligne sur les virgules, ce qui fonctionne bien pour des exports classiques mais interprétera mal un champ entre guillemets contenant lui-même une virgule, comme \"Doe, John\" dans une colonne nom : cette valeur se scindera en deux colonnes au lieu de rester ensemble. Pour du CSV provenant d'un export tableur avec des virgules à l'intérieur de champs texte entre guillemets, vérifiez que le nombre de colonnes du résultat correspond à ce que vous attendez avant de vous y fier au-delà d'un coup d'œil rapide. Le sens JSON vers CSV est plus robuste, car il contrôle lui-même l'échappement.",
    },
    useCases: {
      en: ["Turning a small CSV export into JSON to paste into a script or test fixture", "Converting a JSON API response array into a CSV a non-technical colleague can open in a spreadsheet", "Quickly inspecting the shape of tabular data without writing a parsing script for a one-off task", "Reformatting sample data for documentation examples that need both CSV and JSON versions"],
      fr: ["Transformer un petit export CSV en JSON à coller dans un script ou un fixture de test", "Convertir un tableau de réponse d'API JSON en CSV qu'un collègue non technique peut ouvrir dans un tableur", "Inspecter rapidement la forme de données tabulaires sans écrire de script de parsing pour une tâche ponctuelle", "Reformater des données d'exemple pour une documentation qui a besoin des deux versions CSV et JSON"],
    },
  },
  "deduplicate-lines": {
    desc: {
      en: "Paste a list and get back only the first occurrence of each line, in its original order, duplicates found later in the list are dropped, not the earlier ones, so the order you see in the output matches the order things first appeared in the input. The case-sensitive/insensitive toggle matters more than it looks: with case-sensitive matching on, \"Apple\" and \"apple\" count as two different lines and both survive, which is correct for things like variable names but usually wrong for a list of email addresses or tags where casing is incidental. One thing this tool won't catch: it compares lines exactly as typed, so \"apple\" and \"apple \" (with a trailing space) are treated as different lines and neither gets removed, trim trailing whitespace first if your source data has inconsistent spacing, which is common in copy-pasted spreadsheet columns.",
      fr: "Collez une liste et récupérez uniquement la première occurrence de chaque ligne, dans son ordre d'origine, les doublons trouvés plus loin dans la liste sont supprimés, pas les premiers, donc l'ordre du résultat correspond à l'ordre d'apparition initial dans la saisie. Le bouton sensible/insensible à la casse compte plus qu'il n'y paraît : avec la casse sensible activée, \"Apple\" et \"apple\" comptent comme deux lignes différentes et survivent toutes les deux, ce qui est correct pour des noms de variables mais généralement faux pour une liste d'adresses e-mail ou de tags où la casse est accessoire. Une chose que cet outil ne détecte pas : il compare les lignes exactement telles que saisies, donc \"apple\" et \"apple \" (avec une espace en fin) sont traitées comme des lignes différentes et aucune n'est supprimée, retirez les espaces de fin d'abord si votre source a un espacement incohérent, ce qui arrive souvent avec des colonnes de tableur copiées-collées.",
    },
    useCases: {
      en: ["Cleaning a mailing list or contact export that accumulated duplicate entries over time", "Deduplicating a list of URLs or file paths before running a batch script against them", "Merging two lists of tags or categories without ending up with repeated entries", "Checking how many genuinely unique values a messy dataset actually contains"],
      fr: ["Nettoyer une liste de diffusion ou un export de contacts qui a accumulé des doublons avec le temps", "Dédupliquer une liste d'URLs ou de chemins de fichiers avant de lancer un script batch dessus", "Fusionner deux listes de tags ou de catégories sans se retrouver avec des entrées répétées", "Vérifier combien de valeurs réellement uniques contient un jeu de données désordonné"],
    },
  },
  "diff-viewer": {
    desc: {
      en: "Paste two versions of code or config into the two panes and the tool runs a classic longest-common-subsequence diff, the same family of algorithm behind `git diff`, to work out the minimal set of added and removed lines rather than treating the whole file as changed. Comparison is line-by-line, not character-by-character: adding a single argument to a function signature marks that whole line as removed-and-re-added (shown in red/green) rather than highlighting just the inserted characters within it, which is normal for line-oriented diff tools but different from what an IDE's inline word-diff view shows. It's useful for exactly what it's built for (comparing two versions of a config file, a function before and after a refactor, or output from two runs of a script) without needing git history or a local diff tool installed.",
      fr: "Collez deux versions de code ou de config dans les deux volets, et l'outil exécute un diff classique par plus longue sous-séquence commune, la même famille d'algorithme derrière `git diff`, pour déterminer l'ensemble minimal de lignes ajoutées et supprimées plutôt que de traiter tout le fichier comme modifié. La comparaison est ligne par ligne, pas caractère par caractère : ajouter un seul argument à une signature de fonction marque toute la ligne comme supprimée-puis-rajoutée (affichée en rouge/vert) plutôt que de surligner uniquement les caractères insérés à l'intérieur, normal pour un outil de diff orienté lignes, mais différent de ce qu'affiche la vue de diff mot à mot intégrée à un IDE. C'est utile exactement pour ce à quoi c'est destiné, comparer deux versions d'un fichier de config, une fonction avant et après un refactor, ou la sortie de deux exécutions d'un script, sans avoir besoin de l'historique git ni d'un outil de diff installé localement.",
    },
    useCases: {
      en: ["Comparing a config file before and after a deployment to spot an unintended change", "Reviewing a function's before/after state during a refactor without committing to git first", "Checking whether two versions of a generated file (build output, lockfile) actually differ", "Spotting exactly which line changed between two API response samples during debugging", "Comparing two drafts of an article or email to see which sentences changed between revisions", "Spotting what changed between two versions of terms of service or a policy document"],
      fr: ["Comparer un fichier de config avant et après un déploiement pour repérer un changement non voulu", "Revoir l'état avant/après d'une fonction pendant un refactor sans passer par un commit git", "Vérifier si deux versions d'un fichier généré (sortie de build, lockfile) diffèrent réellement", "Repérer exactement quelle ligne a changé entre deux échantillons de réponse API en déboguant", "Comparer deux versions d'un article ou d'un e-mail pour voir quelles phrases ont changé entre les révisions", "Repérer ce qui a changé entre deux versions de conditions d'utilisation ou d'un document de politique"],
    },
    deepDive: [
      {
        h: { en: "Comparing prose rather than code", fr: "Comparer de la prose plutôt que du code" },
        p: {
          en: ["The same engine works on prose: paste an original paragraph and a revised one, and see exactly which lines were added, removed, or left untouched. Because comparison happens per line rather than per word, this works best when each sentence or list item is on its own line, a whole paragraph typed as one unbroken line will show as fully removed and fully re-added the moment a single word changes inside it, which reads as far noisier than the actual edit. If you're comparing contract redlines, essay drafts, or translated text where a word-level 'track changes' view matters more than line-level, break the text into shorter lines first (one sentence per line works well) before pasting it in, so the diff can actually isolate the sentence that changed."],
          fr: ["Le même moteur fonctionne sur de la prose : collez un paragraphe original et une version révisée, et voyez exactement quelles lignes ont été ajoutées, supprimées ou laissées intactes. Comme la comparaison se fait par ligne et non par mot, ça fonctionne mieux quand chaque phrase ou élément de liste est sur sa propre ligne, un paragraphe entier tapé sur une seule ligne s'affichera comme entièrement supprimé et entièrement rajouté dès qu'un seul mot change à l'intérieur, ce qui paraît bien plus bruyant que la modification réelle. Si vous comparez des redlines de contrat, des brouillons de dissertation, ou du texte traduit où une vue « suivi des modifications » au niveau du mot compte plus qu'au niveau de la ligne, découpez d'abord le texte en lignes plus courtes (une phrase par ligne fonctionne bien) avant de le coller, pour que le diff puisse réellement isoler la phrase qui a changé."],
        },
      },
    ],
  },
  "env-formatter": {
    desc: {
      en: "Paste a .env file and sort keys alphabetically, remove duplicate keys (keeping the first occurrence, matching how most dotenv loaders resolve conflicts), and strip entries with empty values, each as an independent toggle. The one behavior worth knowing before you rely on this for a real project file: comments and blank lines are not preserved in the output. If your .env is organized into sections with # Database, # App-level config style headers, formatting it here will produce a flat list of KEY=value lines with those section comments gone, not reorganized underneath their original headers. For a file with meaningful comments you want to keep, sort and dedupe a copy here, then manually merge the reordered keys back into your commented original rather than replacing it outright.",
      fr: "Collez un fichier .env pour trier les clés par ordre alphabétique, supprimer les clés en double (en gardant la première occurrence, comme la plupart des chargeurs dotenv résolvent les conflits), et retirer les entrées à valeur vide, chacun étant un bouton indépendant. Le comportement à connaître avant de s'en servir sur un vrai fichier de projet : les commentaires et lignes vides ne sont pas conservés dans le résultat. Si votre .env est organisé en sections avec des en-têtes style # Database, # App, le formater ici produira une liste plate de lignes KEY=valeur, ces commentaires de section ayant disparu, pas réorganisés sous leurs en-têtes d'origine. Pour un fichier avec des commentaires que vous voulez garder, triez et dédupliquez une copie ici, puis fusionnez manuellement les clés réordonnées dans votre original commenté plutôt que de le remplacer directement.",
    },
    useCases: {
      en: ["Spotting duplicate environment variable keys that accumulated after merging branches with conflicting .env changes", "Alphabetizing a growing .env file to make a specific key faster to find during debugging", "Stripping placeholder empty-value entries left over from a .env.example before committing a real config", "Quickly comparing which keys exist across two .env files by sorting both the same way first"],
      fr: ["Repérer des clés de variables d'environnement en double accumulées après avoir fusionné des branches avec des changements .env conflictuels", "Trier alphabétiquement un fichier .env qui a grossi pour retrouver plus vite une clé précise en déboguant", "Retirer les entrées à valeur vide laissées par un .env.example avant de committer une vraie config", "Comparer rapidement quelles clés existent entre deux fichiers .env en les triant de la même façon d'abord"],
    },
  },
  "image-compressor": {
    desc: {
      en: "Drop a JPG, PNG, WebP or AVIF image, pick an output format, and adjust the quality slider (10–100) to see the compressed result and the exact size saved compared to the original, everything runs through the Canvas API in your browser. The quality slider only applies to WebP and JPEG output: PNG is a lossless format, so there's no quality dial for it, and choosing PNG for a photo is usually the wrong move for file size, re-encoding a photographic JPG or WebP into lossless PNG can produce a larger file than the original, which shows up here as a red '+X% larger' result instead of the green savings you'd expect. WebP at quality 75–85 is the sweet spot for most web use: visually close to the original, with meaningfully smaller output than an equivalent-quality JPEG.",
      fr: "Déposez une image JPG, PNG, WebP ou AVIF, choisissez un format de sortie, et ajustez le curseur de qualité (10 à 100) pour voir le résultat compressé et le poids exact économisé par rapport à l'original, tout passe par l'API Canvas dans votre navigateur. Le curseur de qualité ne s'applique qu'aux sorties WebP et JPEG : le PNG est un format sans perte, donc pas de réglage de qualité pour lui, et choisir le PNG pour une photo est généralement le mauvais choix côté poids de fichier, réencoder un JPG ou WebP photographique en PNG sans perte peut produire un fichier plus lourd que l'original, ce qui s'affiche ici en rouge « +X% plus lourd » au lieu de l'économie verte attendue. Le WebP à qualité 75-85 est le point d'équilibre pour la plupart des usages web : visuellement proche de l'original, avec un résultat nettement plus léger qu'un JPEG de qualité équivalente.",
    },
    useCases: {
      en: ["Shrinking a photo before uploading it somewhere with a strict file-size limit", "Comparing how much smaller WebP is than the original JPG at the same visual quality", "Preparing images for a web page where load time and Core Web Vitals matter", "Checking honestly whether converting to PNG actually helps or hurts a photo's file size before committing to it"],
      fr: ["Réduire une photo avant de l'envoyer quelque part avec une limite de taille de fichier stricte", "Comparer à quel point le WebP est plus léger que le JPG d'origine à qualité visuelle équivalente", "Préparer des images pour une page web où le temps de chargement et les Core Web Vitals comptent", "Vérifier honnêtement si convertir en PNG aide ou nuit réellement au poids d'une photo avant de s'y engager"],
    },
  },
  "compress-to-kb": {
    desc: {
      en: "Drop an image, pick a target such as 50, 100 or 200 KB, and the tool finds the highest quality that fits under it. It first lowers the JPEG or WebP quality, down to a floor of 40%; only if that isn't enough does it reduce the dimensions, keeping the proportions. The result shows the final size, the quality used and the new dimensions if they changed. Everything runs on a canvas in your browser, and the image is never uploaded.",
      fr: "Déposez une image, choisissez une cible comme 50, 100 ou 200 Ko, et l'outil trouve la meilleure qualité qui tient dessous. Il baisse d'abord la qualité JPEG ou WebP, jusqu'à un plancher de 40 % ; seulement si ça ne suffit pas, il réduit les dimensions en gardant les proportions. Le résultat affiche le poids final, la qualité retenue et les nouvelles dimensions si elles ont changé. Tout se passe sur un canvas dans votre navigateur, l'image n'est jamais envoyée.",
    },
    useCases: {
      en: ["Getting an ID photo or a scanned document under the size limit of an online administrative form", "Attaching a CV photo or a portfolio image to a job application platform that caps files at 100 or 200 KB", "Uploading a profile picture to a forum, school platform or intranet with a strict limit", "Sending a photo by email to someone whose mailbox refuses large attachments"],
      fr: ["Faire passer une photo d'identité ou un document scanné sous la limite d'un formulaire administratif en ligne", "Joindre une photo de CV ou une image de portfolio à une plateforme de candidature qui plafonne les fichiers à 100 ou 200 Ko", "Envoyer une photo de profil sur un forum, un ENT ou un intranet à la limite stricte", "Envoyer une photo par e-mail à quelqu'un dont la messagerie refuse les grosses pièces jointes"],
    },
    deepDive: [
      {
        h: { en: "How the tool reaches the target", fr: "Comment l'outil atteint la cible" },
        p: {
          en: [
            "File size doesn't follow the quality setting in a straight line, and it depends heavily on the picture: a blue sky compresses far better than foliage or fabric. So instead of guessing, the tool encodes the image several times and narrows down the quality by dichotomy, about ten attempts, keeping the highest value whose file stays under the target.",
            "Quality never goes below 40%. Under that threshold JPEG blocks and WebP smearing become obvious, and a slightly smaller image with clean detail is more useful than a full-size one covered in artefacts. When 40% still weighs too much, the tool reduces the width and height together, aiming at the right ratio from the measured size, then searches the quality again at the new size.",
          ],
          fr: [
            "Le poids d'un fichier ne suit pas le réglage de qualité en ligne droite, et il dépend beaucoup de l'image : un ciel bleu se compresse bien mieux qu'un feuillage ou un tissu. Plutôt que de deviner, l'outil encode donc l'image plusieurs fois et resserre la qualité par dichotomie, une dizaine d'essais, en gardant la valeur la plus haute dont le fichier reste sous la cible.",
            "La qualité ne descend jamais sous 40 %. En dessous, les blocs du JPEG et le flou du WebP deviennent visibles, et une image un peu plus petite mais nette sert davantage qu'une image pleine taille couverte d'artefacts. Quand 40 % pèse encore trop, l'outil réduit largeur et hauteur ensemble, en visant le bon rapport d'après le poids mesuré, puis recherche à nouveau la qualité à la nouvelle taille.",
          ],
        },
      },
      {
        h: { en: "KB, KiB and the limit on the form", fr: "Ko, Kio et la limite du formulaire" },
        p: {
          en: [
            "A \"100 KB\" limit can mean 100,000 bytes or 102,400 bytes, depending on who wrote the form. Windows shows file sizes in units of 1024 while labelling them KB; macOS counts in units of 1000. The tool always counts 1 KB as 1000 bytes, the stricter of the two, so a file it declares under 100 KB passes both readings.",
            "That's also why the size shown by your file explorer may look slightly smaller than the one shown here. Both are right; they don't use the same unit.",
          ],
          fr: [
            "Une limite de « 100 Ko » peut vouloir dire 100 000 octets ou 102 400 octets, selon qui a écrit le formulaire. Windows affiche les tailles en unités de 1024 tout en les appelant Ko ; macOS compte par 1000. L'outil compte toujours 1 Ko pour 1000 octets, la lecture la plus stricte des deux : un fichier qu'il annonce sous 100 Ko passe donc dans les deux cas.",
            "C'est aussi pourquoi le poids affiché par votre explorateur de fichiers peut sembler un peu plus faible que celui affiché ici. Les deux sont justes ; ils n'utilisent pas la même unité.",
          ],
        },
      },
      {
        h: { en: "Before you compress: crop, and check the minimum size", fr: "Avant de compresser : recadrer, et vérifier la taille minimale" },
        p: {
          en: [
            "The cheapest bytes to save are the ones outside the subject. A phone photo of a document includes the table around it; an ID photo taken at arm's length includes half the room. Cropping first leaves the whole weight budget to the part that matters, and the tool will need less quality reduction to reach the target.",
            "Some forms also set a minimum resolution, for example a photo of at least 600 pixels on each side. The dimensions of the result are shown next to its size: if the tool had to shrink the image below what the form requires, crop tighter or choose a slightly higher target rather than sending a file that will be rejected for the opposite reason.",
          ],
          fr: [
            "Les octets les moins chers à gagner sont ceux qui sont hors du sujet. Une photo de document prise au téléphone inclut la table autour ; une photo d'identité prise à bout de bras inclut la moitié de la pièce. Recadrer d'abord laisse tout le budget de poids à la partie utile, et l'outil aura moins besoin de baisser la qualité pour atteindre la cible.",
            "Certains formulaires imposent aussi une résolution minimale, par exemple une photo d'au moins 600 pixels de côté. Les dimensions du résultat s'affichent à côté de son poids : si l'outil a dû réduire l'image en dessous de ce que demande le formulaire, recadrez davantage ou choisissez une cible un peu plus haute plutôt que d'envoyer un fichier refusé pour la raison inverse.",
          ],
        },
      },
      {
        h: { en: "JPG or WebP, and what disappears on the way", fr: "JPG ou WebP, et ce qui disparaît en route" },
        p: {
          en: [
            "WebP is typically 25 to 35% lighter than JPEG at the same visual quality, so it reaches a small target with less damage. But upload forms very often accept only JPG, and that's the tool's default for this reason. Choose WebP when you know the destination accepts it, such as a website or a modern chat app.",
            "Redrawing the image on a canvas drops its EXIF metadata: camera model, date, and GPS position if the phone recorded it. On a photo sent to a stranger or an administration, that's a welcome side effect, and it saves a few kilobytes. Transparent areas, in a PNG logo for instance, become white in JPG since the format has no transparency.",
          ],
          fr: [
            "Le WebP pèse en général 25 à 35 % de moins que le JPEG à qualité visuelle égale : il atteint donc une petite cible avec moins de dégâts. Mais les formulaires d'envoi n'acceptent très souvent que le JPG, et c'est pour cette raison le format par défaut de l'outil. Choisissez le WebP quand vous savez que la destination l'accepte, comme un site web ou une messagerie récente.",
            "Redessiner l'image sur un canvas supprime ses métadonnées EXIF : modèle d'appareil, date, et position GPS si le téléphone l'a enregistrée. Sur une photo envoyée à un inconnu ou à une administration, c'est un effet secondaire bienvenu, qui fait en plus gagner quelques kilo-octets. Les zones transparentes, celles d'un logo PNG par exemple, deviennent blanches en JPG, ce format n'ayant pas de transparence.",
          ],
        },
      },
    ],
  },
  "lorem-ipsum": {
    desc: {
      en: "Generate placeholder text by word count, sentence count, or paragraph count, pulled from the classical Lorem Ipsum word list (the scrambled Latin passage that's been the default filler text in publishing since the 1960s, derived from Cicero's De Finibus). One thing worth knowing: the output is deterministic, not random, asking for '3 paragraphs' twice in a row produces the exact same text both times, because words are cycled through the source list in a fixed pattern rather than picked randomly. That's actually useful for reproducible mockups you'll revisit later, but it means this isn't the right tool if you need visibly varied dummy text across many separate elements on the same page, for that, you'd need to vary the count or paragraph type per element to get different output.",
      fr: "Générez du texte de remplissage par nombre de mots, de phrases, ou de paragraphes, tiré de la liste de mots classique du Lorem Ipsum (ce passage latin brouillé qui sert de texte de substitution par défaut dans l'édition depuis les années 1960, dérivé du De Finibus de Cicéron). Une chose à savoir : le résultat est déterministe, pas aléatoire, demander « 3 paragraphes » deux fois de suite produit exactement le même texte à chaque fois, car les mots sont parcourus dans la liste source selon un motif fixe plutôt que tirés au hasard. C'est en fait utile pour des maquettes reproductibles que vous reviendrez consulter plus tard, mais ça signifie que ce n'est pas le bon outil s'il vous faut du texte factice visiblement varié sur plusieurs éléments distincts d'une même page, pour ça, il faudrait varier le nombre ou le type de paragraphe par élément pour obtenir un résultat différent.",
    },
    useCases: {
      en: ["Filling a design mockup with realistic-length text before real copy is written", "Testing how a layout handles long vs short paragraphs by switching between word/sentence/paragraph modes", "Generating consistent placeholder text you can regenerate identically later for a style guide", "Quickly padding a component in development to check text overflow and wrapping behavior"],
      fr: ["Remplir une maquette de design avec du texte de longueur réaliste avant que le vrai contenu ne soit écrit", "Tester comment une mise en page gère des paragraphes longs ou courts en changeant entre les modes mot/phrase/paragraphe", "Générer un texte de remplissage cohérent, régénérable à l'identique plus tard pour un guide de style", "Remplir rapidement un composant en développement pour vérifier le débordement de texte et le retour à la ligne"],
    },
  },
  "schema-generator": {
    desc: {
      en: "Fill in a form for one of four schema types (Article, Product, FAQPage, or BreadcrumbList) and get valid JSON-LD structured data back, ready to paste into a <script type=\"application/ld+json\"> tag. What this tool guarantees is syntactic correctness: the output is always valid JSON matching schema.org's vocabulary for that type. What it can't guarantee is rich-result eligibility, which is a separate, stricter bar Google sets per type, a Product schema here covers name, description and price/availability, but Google's Merchant rich snippet guidelines often also expect fields like aggregateRating or review to actually trigger a star-rating rich result in search. Always run the generated markup through Google's Rich Results Test before deploying it; valid JSON-LD and an eligible rich result are two different things, and only the second one changes how your page looks in search.",
      fr: "Remplissez un formulaire pour l'un des quatre types de schema (Article, Product, FAQPage, ou BreadcrumbList) et récupérez des données structurées JSON-LD valides, prêtes à coller dans une balise <script type=\"application/ld+json\">. Ce que cet outil garantit, c'est la correction syntaxique : le résultat est toujours du JSON valide respectant le vocabulaire schema.org pour ce type. Ce qu'il ne peut pas garantir, c'est l'éligibilité aux résultats enrichis, une barre séparée et plus stricte que Google fixe par type, un schema Product ici couvre nom, description et prix/disponibilité, mais les consignes Google Merchant pour les extraits enrichis attendent souvent aussi des champs comme aggregateRating ou review pour réellement déclencher un résultat enrichi avec étoiles dans la recherche. Testez toujours le balisage généré avec le Rich Results Test de Google avant de le déployer ; un JSON-LD valide et un résultat enrichi éligible sont deux choses différentes, et seule la seconde change l'apparence de votre page dans les résultats de recherche.",
    },
    useCases: {
      en: ["Generating FAQPage JSON-LD from an existing list of questions and answers without hand-writing the nesting", "Building BreadcrumbList markup that matches a site's actual navigation hierarchy", "Creating a starting Article schema for a blog post, then extending it with fields this form doesn't cover", "Producing syntactically correct Product JSON-LD to test in Google's Rich Results Test before adding the extra fields it flags as missing"],
      fr: ["Générer du JSON-LD FAQPage à partir d'une liste existante de questions-réponses sans écrire l'imbrication à la main", "Construire un balisage BreadcrumbList qui correspond à la hiérarchie de navigation réelle d'un site", "Créer un schema Article de départ pour un article de blog, puis l'étendre avec des champs que ce formulaire ne couvre pas", "Produire du JSON-LD Product syntaxiquement correct à tester dans le Rich Results Test de Google avant d'ajouter les champs manquants qu'il signale"],
    },
  },
  "sitemap-generator": {
    desc: {
      en: "Paste one URL per line and this wraps each one in valid sitemap XML with a shared lastmod date, changefreq and priority applied uniformly across every URL in the batch: there's no per-URL override, so a homepage and a rarely updated legal page both get the same priority value unless you generate them in separate batches and merge the files by hand. Worth knowing before you spend time fine-tuning priority values: Google has stated for years that it largely ignores changefreq and priority as ranking or crawling signals, treating them as weak hints at best, lastmod is the one field that's still genuinely useful, and only when it's accurate, since Google uses it to decide whether a URL is worth recrawling. A sitemap with a fake or copy-pasted lastmod on every URL is arguably worse than omitting the field entirely.",
      fr: "Collez une URL par ligne et l'outil enveloppe chacune dans un XML de sitemap valide avec une date lastmod, un changefreq et une priorité partagés, appliqués uniformément à toutes les URLs du lot, pas de surcharge par URL, donc une page d'accueil et une page légale rarement mise à jour reçoivent la même valeur de priorité, sauf à générer des lots séparés et fusionner les fichiers à la main. Bon à savoir avant de passer du temps à peaufiner les valeurs de priorité : Google déclare depuis des années qu'il ignore largement changefreq et priority comme signaux de classement ou de crawl, les traitant au mieux comme des indices faibles, lastmod reste le seul champ réellement utile, et seulement s'il est exact, puisque Google s'en sert pour décider si une URL mérite d'être recrawlée. Un sitemap avec un lastmod inventé ou copié-collé sur toutes les URLs est sans doute pire que d'omettre complètement ce champ.",
    },
    useCases: {
      en: ["Generating a first sitemap.xml for a new site launch from a manually compiled URL list", "Producing a supplementary sitemap for a set of URLs a CMS-generated sitemap missed", "Quickly checking what valid sitemap XML syntax looks like before writing a script to generate one dynamically", "Creating a small sitemap for a static site or landing page that doesn't have a build-time sitemap generator"],
      fr: ["Générer un premier sitemap.xml pour le lancement d'un nouveau site à partir d'une liste d'URLs compilée manuellement", "Produire un sitemap complémentaire pour un ensemble d'URLs qu'un sitemap généré par CMS aurait manqué", "Vérifier rapidement à quoi ressemble une syntaxe XML de sitemap valide avant d'écrire un script pour en générer un dynamiquement", "Créer un petit sitemap pour un site statique ou une landing page sans générateur de sitemap au build"],
    },
  },
  "slug-generator": {
    desc: {
      en: "Type a title and get a URL-safe slug back instantly: accented Latin characters are normalized and stripped (é, à, ü, ñ all convert to their plain-ASCII base letter), everything is lowercased, and any character that isn't a letter, number or your chosen separator gets removed before spaces collapse into hyphens or underscores. This handles Latin-alphabet diacritics well (French, Spanish, German, Portuguese titles convert cleanly) but it isn't a transliteration engine: a title written in Cyrillic, Arabic, Greek or CJK characters falls outside the regex's allowed range entirely and gets stripped rather than converted to a Latin equivalent, which can leave you with an empty or near-empty slug. For non-Latin-script content, a proper transliteration library (not simple character filtering) is the right tool, not this one.",
      fr: "Tapez un titre et récupérez instantanément un slug compatible URL : les caractères latins accentués sont normalisés et retirés (é, à, ü, ñ se convertissent tous vers leur lettre ASCII de base), tout est mis en minuscules, et tout caractère qui n'est ni une lettre, ni un chiffre, ni le séparateur choisi est supprimé avant que les espaces ne se transforment en tirets ou underscores. Ça gère bien les diacritiques de l'alphabet latin (les titres français, espagnols, allemands, portugais se convertissent proprement) mais ce n'est pas un moteur de translittération : un titre écrit en cyrillique, arabe, grec ou caractères CJK sort entièrement de la plage autorisée par l'expression régulière et se voit supprimé plutôt que converti vers un équivalent latin, ce qui peut laisser un slug vide ou quasi vide. Pour du contenu en écriture non latine, une vraie bibliothèque de translittération (pas un simple filtrage de caractères) est le bon outil, pas celui-ci.",
    },
    useCases: {
      en: ["Generating a clean URL slug from a blog post title before publishing", "Converting a French or Spanish title with accents into an ASCII-safe URL path", "Creating consistent file names or IDs from user-submitted titles", "Quickly checking what a title will look like as a URL before committing to it in a CMS"],
      fr: ["Générer un slug d'URL propre à partir d'un titre d'article de blog avant publication", "Convertir un titre français ou espagnol avec accents en chemin d'URL compatible ASCII", "Créer des noms de fichiers ou des IDs cohérents à partir de titres saisis par des utilisateurs", "Vérifier rapidement à quoi ressemblera un titre en URL avant de le valider dans un CMS"],
    },
  },
  "string-escape": {
    desc: {
      en: "Three languages (JavaScript, SQL, Bash), each direction (escape or unescape), each with rules specific to that context rather than one generic escaping scheme: JS mode handles backslashes, quotes, and \\n/\\r/\\t control characters; SQL mode doubles single quotes ('') per the ANSI-SQL standard that MySQL, PostgreSQL and SQLite all honor; Bash mode escapes backslashes, double quotes, $ and backticks, the characters that trigger variable expansion or command substitution inside a double-quoted shell string. One important boundary: SQL escaping here makes a string literal safe to drop into a query you're writing by hand: it is not a substitute for parameterized queries or prepared statements in application code. Manual string escaping is a known-fragile defense against SQL injection precisely because it's easy to miss an edge case; use it for one-off scripts and ad hoc queries, never as the injection defense in a production codebase.",
      fr: "Trois langages (JavaScript, SQL, Bash), chaque sens (échapper ou dé-échapper), chacun avec des règles spécifiques à son contexte plutôt qu'un schéma d'échappement générique unique : le mode JS gère les antislashs, les guillemets, et les caractères de contrôle \\n/\\r/\\t ; le mode SQL double les guillemets simples ('') selon le standard ANSI-SQL que respectent MySQL, PostgreSQL et SQLite ; le mode Bash échappe les antislashs, les guillemets doubles, le $ et les backticks, les caractères qui déclenchent l'expansion de variable ou la substitution de commande dans une chaîne shell entre guillemets doubles. Une frontière importante : l'échappement SQL ici rend une chaîne littérale sûre à insérer dans une requête écrite à la main, ce n'est pas un substitut aux requêtes paramétrées ou aux instructions préparées dans du code applicatif. L'échappement manuel de chaînes est une défense reconnue comme fragile contre l'injection SQL, précisément parce qu'il est facile de manquer un cas limite ; utilisez-le pour des scripts ponctuels et des requêtes ad hoc, jamais comme défense contre l'injection dans une base de code de production.",
    },
    useCases: {
      en: ["Safely embedding a string containing quotes into a one-off SQL query run manually in a database console", "Escaping a variable value before dropping it into a bash script that shouldn't break on special characters", "Preparing a JSON string value that contains quotes and newlines for a JS source file or config", "Unescaping a string copied from a log file back into its original readable form"],
      fr: ["Insérer en toute sécurité une chaîne contenant des guillemets dans une requête SQL ponctuelle exécutée manuellement dans une console de base de données", "Échapper une valeur de variable avant de l'insérer dans un script bash qui ne doit pas casser sur des caractères spéciaux", "Préparer une valeur de chaîne JSON contenant des guillemets et des sauts de ligne pour un fichier source JS ou une config", "Dé-échapper une chaîne copiée depuis un fichier de log pour retrouver sa forme lisible d'origine"],
    },
  },
  "svg-optimizer": {
    desc: {
      en: "Runs SVGO (the same optimization engine used by build tools like vite-imagetools and many icon pipelines) entirely in your browser via preset-default, with optional toggles to also strip comments, metadata and editor-specific namespace data (the <!-- Generated by Figma --> and data-name=\"Layer_1\" cruft design tools leave behind). The size reduction shown (often 30–60% on icons exported from Figma or Illustrator) mostly comes from removing exactly that kind of unused markup, not from degrading the image. One thing to actually verify rather than assume: SVGO's preset-default is intentionally aggressive: it can merge paths, drop attributes it judges redundant, or convert shapes to path data, and in edge cases (very precise strokes, specific fill-rule behavior) that rewriting can shift how the SVG renders. Always look at the optimized output before shipping it, especially for icons where a pixel of stroke width actually matters.",
      fr: "Exécute SVGO (le même moteur d'optimisation utilisé par des outils de build comme vite-imagetools et de nombreux pipelines d'icônes) entièrement dans votre navigateur via preset-default, avec des options pour aussi retirer les commentaires, les métadonnées et les données de namespace spécifiques aux éditeurs (le <!-- Generated by Figma --> et le data-name=\"Layer_1\" que laissent les outils de design). La réduction de poids affichée (souvent 30 à 60% sur des icônes exportées de Figma ou Illustrator) vient surtout de la suppression de ce type de balisage inutile, pas d'une dégradation de l'image. Une chose à vérifier réellement plutôt qu'à supposer : le preset-default de SVGO est volontairement agressif : il peut fusionner des chemins, retirer des attributs qu'il juge redondants, ou convertir des formes en données de chemin, et dans des cas limites (traits très précis, comportement spécifique de fill-rule), cette réécriture peut modifier le rendu du SVG. Regardez toujours le résultat optimisé avant de le déployer, surtout pour des icônes où un pixel d'épaisseur de trait compte vraiment.",
    },
    useCases: {
      en: ["Cleaning up an icon exported from Figma or Illustrator before adding it to a component library", "Reducing the file size of SVG assets bundled into a web app to improve load time", "Stripping editor metadata and comments from SVGs before committing them to version control", "Checking exactly how much of an SVG's file size was unused design-tool cruft versus actual path data"],
      fr: ["Nettoyer une icône exportée de Figma ou Illustrator avant de l'ajouter à une bibliothèque de composants", "Réduire le poids de fichiers SVG intégrés à une app web pour améliorer le temps de chargement", "Retirer les métadonnées et commentaires d'éditeur des SVG avant de les committer dans le contrôle de version", "Vérifier exactement quelle part du poids d'un fichier SVG était du superflu d'outil de design plutôt que de vraies données de chemin"],
    },
  },
  "zip-extractor": {
    desc: {
      en: "Drop a .zip file and it's unpacked entirely in your browser using fflate, a WebAssembly-adjacent decompression library, no upload, and the archive is read into memory via the File API rather than sent anywhere. Folders sort to the top, each file shows its uncompressed size, and any entry can be downloaded individually without extracting the whole archive first. Two real constraints worth knowing before you rely on this for something important: it doesn't support password-protected or encrypted zip entries (fflate's unzip has no AES or ZipCrypto decryption), so an encrypted archive will fail to read rather than prompt for a password; and because the whole file is loaded into memory at once rather than streamed, a multi-gigabyte archive can hit your browser's memory limit on lower-end devices even though it would extract fine with a desktop archive manager.",
      fr: "Déposez un fichier .zip et il est décompressé entièrement dans votre navigateur via fflate, une bibliothèque de décompression proche du WebAssembly, aucun envoi, l'archive est lue en mémoire via l'API File plutôt qu'envoyée où que ce soit. Les dossiers remontent en haut, chaque fichier affiche sa taille décompressée, et n'importe quelle entrée peut être téléchargée individuellement sans extraire toute l'archive d'abord. Deux vraies contraintes à connaître avant de s'y fier pour quelque chose d'important : pas de support des entrées zip protégées par mot de passe ou chiffrées (l'unzip de fflate n'a pas de déchiffrement AES ou ZipCrypto), donc une archive chiffrée échouera à la lecture plutôt que de demander un mot de passe ; et comme tout le fichier est chargé en mémoire d'un coup plutôt qu'en streaming, une archive de plusieurs gigaoctets peut atteindre la limite mémoire du navigateur sur des appareils moins puissants, même si elle s'extrairait sans problème avec un gestionnaire d'archives de bureau.",
    },
    useCases: {
      en: ["Peeking inside a .zip attachment or download without installing an archive manager", "Grabbing a single file out of a large archive without extracting everything to disk", "Checking the contents and folder structure of an archive before deciding whether to download it fully", "Quickly inspecting a zipped project export or backup on a machine without extraction software"],
      fr: ["Jeter un œil dans une pièce jointe ou un téléchargement .zip sans installer de gestionnaire d'archives", "Récupérer un seul fichier dans une grosse archive sans tout extraire sur le disque", "Vérifier le contenu et la structure de dossiers d'une archive avant de décider de la télécharger en entier", "Inspecter rapidement un export de projet ou une sauvegarde zippée sur une machine sans logiciel d'extraction"],
    },
  },
};
