import type { Guide } from "../guides";

export const GUIDE_JSON_YAML_TOML: Guide = {
  slug: "json-yaml-toml",
  published: "2026-09-25",
  updated: "2026-09-25",
  tools: ["json-formatter", "toml-json", "csv-json"],
  en: {
    title: "JSON vs YAML vs TOML: which one, and what breaks",
    description: "JSON, YAML or TOML? A practical comparison for APIs and config files, with the conversion traps we measured: big integers, null, dates, comments.",
    lead: "Use JSON for data that programs exchange, TOML for config files people edit by hand, and YAML when your tooling already expects it (Kubernetes, CI pipelines). The choice matters less than knowing what each format silently changes when you convert between them: long integers, null, dates and comments.",
    sections: [
      {
        h: "JSON, YAML or TOML: the short answer",
        blocks: [
          { p: "Most comparisons end with \"it depends\". It does, but on two questions only: who writes the file, and what reads it." },
          { table: {
            head: ["", "JSON", "YAML", "TOML"],
            rows: [
              ["Best for", "APIs, data exchange, generated files", "Kubernetes, CI/CD, Ansible, Docker Compose", "App config: Cargo.toml, pyproject.toml, Hugo"],
              ["Comments", "No", "Yes (#)", "Yes (#)"],
              ["Structure by", "Braces and brackets", "Indentation", "[sections] and key = value"],
              ["Dates", "No type, strings only", "Timestamps, parser-dependent", "Native date and time types"],
              ["null", "Yes", "Yes (~ or null)", "No"],
              ["Integer vs float", "One number type", "Distinct", "Distinct"],
              ["Typing surprises", "Few", "Many (implicit types)", "Few (strings must be quoted)"],
            ],
          } },
          { p: "If a program writes the file and another program reads it, pick JSON: every language parses it without a library, and there's no ambiguity about what a value is. If a person maintains the file, pick TOML when you're free to choose, because comments and explicit types make mistakes visible. YAML wins when the ecosystem has already decided for you." },
        ],
      },
      {
        h: "JSON: strict, universal, and blind to comments",
        blocks: [
          { p: "JSON's strength is that there's almost nothing to interpret. Strings are always in double quotes, keys too, and a value is a string, a number, true, false, null, an array or an object. That's the whole format, defined in RFC 8259." },
          { p: "The price is paid by humans. No comments, so you can't explain why a setting has a strange value. No trailing comma, so deleting the last line of a list breaks the file. When a package.json refuses to load after a manual edit, it's almost always one of those two, and the [JSON formatter](/t/json-formatter) points at the exact line and names the cause." },
          { p: "One trap catches people who think a file is JSON when it isn't. tsconfig.json and VS Code's settings.json accept comments and trailing commas: they're JSONC, a relaxed variant. Paste one into a strict JSON parser and it fails on the first comment. That's not a bug in your tsconfig." },
          { p: "The subtler problem is numbers. JSON itself puts no limit on integers, but JavaScript reads every number as a 64-bit float, exact only up to 9,007,199,254,740,991. Beyond that, `JSON.parse` rounds: `1234567890123456789` comes back as `1234567890123456800`. API IDs from large databases and social platforms live in that range, which is why some APIs send them twice, as a number and as a string. We rebuilt our JSON formatter so it keeps those digits intact, but your own code will still round them unless they arrive as strings." },
        ],
      },
      {
        h: "YAML: pleasant to read, generous with surprises",
        blocks: [
          { p: "YAML reads like a clean outline. Indentation gives the structure, quotes are optional, and anchors let you reuse a block instead of copying it. That's why Kubernetes manifests and CI pipelines use it." },
          { p: "Optional quotes are also the problem. When a value isn't quoted, the parser guesses its type, and the guess depends on which version of YAML it follows. We ran the same four lines through js-yaml, a widely used JavaScript parser that follows YAML 1.2:" },
          { code: "country: NO\nversion: 1.10\nmode: 0755\nenabled: yes" },
          { p: "Result: country stayed the string \"NO\" and enabled stayed \"yes\", but version became the number 1.1 and mode became the number 755. A parser that follows the older YAML 1.1, such as PyYAML in Python, goes further: NO and yes become booleans (false and true), which is the famous Norway problem, and 0755 is read as an octal number." },
          { p: "So the same file can mean different things to two tools in the same pipeline. The fix is dull and reliable: quote every value that isn't meant to be a number or a boolean, especially version numbers, country codes, file modes and anything with leading zeros." },
        ],
      },
      {
        h: "TOML: config files with real types",
        blocks: [
          { p: "TOML looks like an INI file that grew up. Sections in square brackets, key = value lines, comments with #. Strings must be quoted, so there's no guessing: `version = \"1.10\"` is a string, `port = 8080` an integer, `ratio = 3.0` a float." },
          { code: "[package]\nname = \"my-app\"\nversion = \"1.10.0\"   # a string, never a number\n\n[server]\nport = 8080\nstarted = 2026-09-25T08:00:00Z   # a real date" },
          { p: "It also has native dates and times, which neither JSON nor most YAML setups handle as cleanly. Where TOML gets awkward is deep nesting: a structure four levels deep turns into long [a.b.c.d] headers or arrays of tables written [[like.this]], which is why nobody writes API payloads in TOML." },
          { p: "Rust's Cargo and Python's pyproject.toml settled on it, and since Python 3.11 the standard library can read TOML without an extra package." },
        ],
      },
      {
        h: "What breaks when you convert between them",
        blocks: [
          { p: "Converting is where the differences stop being theoretical. These are the losses we measured while testing our [TOML to JSON converter](/t/toml-json) and our JSON tools, not guesses:" },
          { ul: [
            "A JSON null has nowhere to go in TOML. The key simply disappears unless the converter warns you; ours now lists every key concerned.",
            "TOML dates become plain strings in JSON, so converting back gives quoted text, not a date.",
            "A TOML float written 3.0 comes back as the integer 3, which a strictly typed program may reject.",
            "TOML's inf and nan have no JSON spelling and become null.",
            "Comments are lost in both directions, since JSON can't hold them.",
            "An inline TOML table such as `serde = { version = \"1.0\" }` comes back as a separate [dependencies.serde] section: same meaning, very different diff.",
            "Integers beyond 2^53 are rounded by JavaScript before any conversion starts, unless the tool reads them as text.",
          ] },
          { p: "The practical rule: convert to read or to generate, not to round-trip. Turning a Cargo.toml into JSON to feed a script is fine. Converting a hand-written, commented TOML file to JSON and back, then committing the result, throws away information you'll want later." },
          { p: "The same applies to tabular data. A CSV export turned into JSON with the [CSV to JSON converter](/t/csv-json) gains structure but loses nothing; going from nested JSON to CSV flattens objects, so plan which fields become columns." },
        ],
      },
      {
        h: "Which one should you pick?",
        blocks: [
          { ol: [
            "Data sent between programs, stored, or returned by an API: JSON. Send long IDs as strings.",
            "A config file you create for your own project and edit by hand: TOML, for comments and explicit types.",
            "A config file for a tool that expects YAML (Kubernetes, GitHub Actions, Docker Compose): YAML, with every non-numeric value quoted.",
            "A file that must be both machine-generated and human-edited: JSON if tooling matters more, TOML if people matter more. Avoid YAML here; generated YAML is where implicit typing hurts most.",
          ] },
          { p: "This site has a JSON formatter and a TOML to JSON converter, but no YAML tool yet. For YAML, the safest check is the parser your deployment actually uses, since two parsers can disagree on the same file, as the test above shows." },
        ],
      },
    ],
    faq: [
      { q: "Is YAML a superset of JSON?", a: "Mostly. YAML 1.2 was designed so that a JSON document is also valid YAML, and most JSON files parse as YAML. The reverse isn't true: comments, anchors and unquoted strings have no JSON equivalent." },
      { q: "Why doesn't JSON allow comments?", a: "The format was kept deliberately minimal for data exchange between programs. Tools that want comments use a variant such as JSONC, accepted by tsconfig.json and VS Code, or a different format like TOML or YAML." },
      { q: "Can TOML represent null?", a: "No. TOML has no null value. A missing key plays that role, which is why a JSON null is dropped when you convert to TOML. Give the key a real value, such as an empty string or false, if it must exist." },
      { q: "Which format is fastest to parse?", a: "JSON, in practice, because its grammar is small and every platform ships an optimized parser. For config files read once at startup, the difference is irrelevant; choose for readability and safety instead." },
    ],
  },
  fr: {
    title: "JSON, YAML ou TOML : lequel choisir, et ce qui casse",
    description: "JSON, YAML ou TOML ? Un comparatif pratique pour les API et les fichiers de config, avec les pièges de conversion mesurés : entiers, null, dates.",
    lead: "Prenez le JSON pour les données que des programmes s'échangent, le TOML pour les fichiers de config qu'on modifie à la main, et le YAML quand vos outils l'imposent déjà (Kubernetes, pipelines CI). Le choix compte moins que de savoir ce que chaque format change sans prévenir quand on passe de l'un à l'autre : grands entiers, null, dates et commentaires.",
    sections: [
      {
        h: "JSON, YAML ou TOML : la réponse courte",
        blocks: [
          { p: "La plupart des comparatifs finissent par « ça dépend ». C'est vrai, mais de deux questions seulement : qui écrit le fichier, et qu'est-ce qui le lit." },
          { table: {
            head: ["", "JSON", "YAML", "TOML"],
            rows: [
              ["Idéal pour", "API, échange de données, fichiers générés", "Kubernetes, CI/CD, Ansible, Docker Compose", "Config d'appli : Cargo.toml, pyproject.toml, Hugo"],
              ["Commentaires", "Non", "Oui (#)", "Oui (#)"],
              ["Structure", "Accolades et crochets", "Indentation", "[sections] et clé = valeur"],
              ["Dates", "Pas de type, chaînes seulement", "Horodatages, selon l'analyseur", "Types date et heure natifs"],
              ["null", "Oui", "Oui (~ ou null)", "Non"],
              ["Entier ou décimal", "Un seul type de nombre", "Distincts", "Distincts"],
              ["Surprises de typage", "Rares", "Nombreuses (types implicites)", "Rares (chaînes entre guillemets)"],
            ],
          } },
          { p: "Si un programme écrit le fichier et qu'un autre le lit, prenez le JSON : tous les langages le lisent sans bibliothèque, sans ambiguïté sur la nature d'une valeur. Si une personne entretient le fichier, prenez le TOML quand vous êtes libre, car commentaires et types explicites rendent les erreurs visibles. Le YAML gagne quand l'écosystème a déjà choisi pour vous." },
        ],
      },
      {
        h: "JSON : strict, universel, et sans commentaires",
        blocks: [
          { p: "La force du JSON, c'est qu'il n'y a presque rien à interpréter. Les chaînes sont toujours entre guillemets doubles, les clés aussi, et une valeur est une chaîne, un nombre, true, false, null, un tableau ou un objet. C'est tout le format, défini par la RFC 8259." },
          { p: "Le prix, ce sont les humains qui le paient. Pas de commentaires : impossible d'expliquer pourquoi un réglage a une valeur étrange. Pas de virgule finale : supprimer la dernière ligne d'une liste casse le fichier. Quand un package.json refuse de se charger après une modification à la main, c'est presque toujours l'un des deux, et le [formateur JSON](/t/json-formatter) pointe la ligne exacte et nomme la cause." },
          { p: "Un piège attrape ceux qui croient avoir du JSON sous les yeux. tsconfig.json et le settings.json de VS Code acceptent commentaires et virgules finales : c'est du JSONC, une variante assouplie. Collez-en un dans un analyseur JSON strict, et il échoue au premier commentaire. Ce n'est pas un bug de votre tsconfig." },
          { p: "Le problème plus discret, ce sont les nombres. Le JSON ne limite pas les entiers, mais JavaScript lit chaque nombre comme un flottant 64 bits, exact seulement jusqu'à 9 007 199 254 740 991. Au-delà, `JSON.parse` arrondit : `1234567890123456789` revient en `1234567890123456800`. Les identifiants d'API des grandes bases de données et des réseaux sociaux sont dans cette zone, d'où certaines API qui les envoient deux fois, en nombre et en chaîne. Nous avons refait notre formateur JSON pour qu'il garde ces chiffres intacts, mais votre propre code les arrondira toujours s'ils n'arrivent pas en chaînes." },
        ],
      },
      {
        h: "YAML : agréable à lire, généreux en surprises",
        blocks: [
          { p: "Le YAML se lit comme un plan bien tenu. L'indentation donne la structure, les guillemets sont facultatifs, et les ancres permettent de réutiliser un bloc au lieu de le copier. C'est pour ça que les manifestes Kubernetes et les pipelines CI l'utilisent." },
          { p: "Les guillemets facultatifs sont aussi le problème. Quand une valeur n'est pas entre guillemets, l'analyseur devine son type, et sa réponse dépend de la version de YAML qu'il suit. Nous avons passé les quatre mêmes lignes dans js-yaml, un analyseur JavaScript très utilisé qui suit YAML 1.2 :" },
          { code: "country: NO\nversion: 1.10\nmode: 0755\nenabled: yes" },
          { p: "Résultat : country est resté la chaîne \"NO\" et enabled est resté \"yes\", mais version est devenu le nombre 1.1 et mode le nombre 755. Un analyseur qui suit l'ancien YAML 1.1, comme PyYAML en Python, va plus loin : NO et yes deviennent des booléens (false et true), c'est le fameux « problème norvégien », et 0755 est lu comme un nombre octal." },
          { p: "Le même fichier peut donc vouloir dire deux choses pour deux outils d'une même chaîne. La parade est ennuyeuse et fiable : mettez entre guillemets toute valeur qui n'est pas censée être un nombre ou un booléen, surtout les numéros de version, les codes pays, les droits de fichiers et tout ce qui commence par un zéro." },
        ],
      },
      {
        h: "TOML : des fichiers de config avec de vrais types",
        blocks: [
          { p: "Le TOML ressemble à un fichier INI qui aurait grandi. Des sections entre crochets, des lignes clé = valeur, des commentaires avec #. Les chaînes doivent être entre guillemets, donc rien n'est deviné : `version = \"1.10\"` est une chaîne, `port = 8080` un entier, `ratio = 3.0` un décimal." },
          { code: "[package]\nname = \"mon-appli\"\nversion = \"1.10.0\"   # une chaîne, jamais un nombre\n\n[server]\nport = 8080\nstarted = 2026-09-25T08:00:00Z   # une vraie date" },
          { p: "Il a aussi des dates et des heures natives, ce que ni le JSON ni la plupart des configurations YAML ne gèrent aussi proprement. Là où le TOML devient pénible, c'est l'imbrication profonde : une structure sur quatre niveaux se transforme en longs en-têtes [a.b.c.d] ou en tableaux de tables écrits [[comme.ceci]], et c'est pour ça que personne n'écrit de payload d'API en TOML." },
          { p: "Cargo pour Rust et pyproject.toml pour Python l'ont adopté, et depuis Python 3.11 la bibliothèque standard sait lire le TOML sans paquet supplémentaire." },
        ],
      },
      {
        h: "Ce qui casse quand on convertit de l'un à l'autre",
        blocks: [
          { p: "C'est à la conversion que les différences cessent d'être théoriques. Voici les pertes mesurées en testant notre [convertisseur TOML vers JSON](/t/toml-json) et nos outils JSON, pas des suppositions :" },
          { ul: [
            "Un null JSON n'a pas de place en TOML. La clé disparaît tout simplement, sauf si le convertisseur prévient ; le nôtre liste désormais chaque clé concernée.",
            "Les dates TOML deviennent de simples chaînes en JSON : le retour en TOML donne du texte entre guillemets, pas une date.",
            "Un décimal TOML écrit 3.0 revient en entier 3, ce qu'un programme strictement typé peut refuser.",
            "Les valeurs inf et nan du TOML n'ont aucune écriture en JSON et deviennent null.",
            "Les commentaires sont perdus dans les deux sens, le JSON ne sachant pas les garder.",
            "Une table TOML en ligne comme `serde = { version = \"1.0\" }` revient sous forme d'une section [dependencies.serde] à part : même sens, diff très différent.",
            "Les entiers au-delà de 2^53 sont arrondis par JavaScript avant même le début de la conversion, sauf si l'outil les lit comme du texte.",
          ] },
          { p: "La règle pratique : convertissez pour lire ou pour générer, pas pour faire un aller-retour. Transformer un Cargo.toml en JSON pour l'envoyer à un script, très bien. Convertir en JSON un TOML écrit et commenté à la main, le reconvertir, puis commiter le résultat, c'est jeter des informations dont vous aurez besoin plus tard." },
          { p: "C'est la même chose pour les données en tableau. Un export CSV transformé en JSON avec le [convertisseur CSV ↔ JSON](/t/csv-json) gagne de la structure sans rien perdre ; passer d'un JSON imbriqué à un CSV aplatit les objets, alors décidez à l'avance quels champs deviennent des colonnes." },
        ],
      },
      {
        h: "Lequel choisir ?",
        blocks: [
          { ol: [
            "Des données échangées entre programmes, stockées ou renvoyées par une API : JSON. Envoyez les longs identifiants en chaînes.",
            "Un fichier de config créé pour votre propre projet et modifié à la main : TOML, pour les commentaires et les types explicites.",
            "Un fichier de config pour un outil qui attend du YAML (Kubernetes, GitHub Actions, Docker Compose) : YAML, avec toute valeur non numérique entre guillemets.",
            "Un fichier à la fois généré par une machine et retouché à la main : JSON si l'outillage compte le plus, TOML si ce sont les personnes. Évitez le YAML dans ce cas : c'est le YAML généré qui souffre le plus du typage implicite.",
          ] },
          { p: "Ce site propose un formateur JSON et un convertisseur TOML vers JSON, mais pas encore d'outil YAML. Pour le YAML, le contrôle le plus sûr reste l'analyseur qu'utilise réellement votre déploiement, puisque deux analyseurs peuvent ne pas lire le même fichier de la même façon, comme le montre le test plus haut." },
        ],
      },
    ],
    faq: [
      { q: "Le YAML est-il un sur-ensemble du JSON ?", a: "En grande partie. YAML 1.2 a été conçu pour qu'un document JSON soit aussi du YAML valide, et la plupart des fichiers JSON se lisent comme du YAML. L'inverse est faux : commentaires, ancres et chaînes sans guillemets n'ont pas d'équivalent JSON." },
      { q: "Pourquoi le JSON n'accepte-t-il pas les commentaires ?", a: "Le format a été voulu minimal pour l'échange de données entre programmes. Les outils qui veulent des commentaires utilisent une variante comme le JSONC, accepté par tsconfig.json et VS Code, ou un autre format comme le TOML ou le YAML." },
      { q: "Le TOML peut-il représenter null ?", a: "Non. Le TOML n'a pas de valeur null. C'est l'absence de la clé qui joue ce rôle, d'où la disparition d'un null JSON à la conversion en TOML. Donnez à la clé une vraie valeur, comme une chaîne vide ou false, si elle doit exister." },
      { q: "Quel format se lit le plus vite ?", a: "Le JSON, en pratique, car sa grammaire est petite et chaque plateforme fournit un analyseur optimisé. Pour un fichier de config lu une fois au démarrage, la différence est sans importance : choisissez pour la lisibilité et la sûreté." },
    ],
  },
};
