import type { Guide } from "../guides";

export const GUIDE_MARKDOWN_TABLES: Guide = {
  slug: "markdown-tables",
  published: "2026-09-30",
  updated: "2026-09-30",
  tools: ["md-table", "markdown-html"],
  en: {
    title: "Markdown tables: syntax, alignment and README tricks",
    description: "How to write a table in Markdown for a README or GitHub issue: pipes, the separator row, alignment, escaping |, line breaks in cells and merged cells.",
    lead: "A Markdown table is a header row, a separator row of dashes, then one line per row, with cells separated by pipes: | Name | Role |, then |---|---|, then your data. Colons in the separator row set the alignment. Tables aren't part of the original Markdown: they come from GitHub Flavored Markdown, which GitHub, GitLab, VS Code and most documentation tools support.",
    sections: [
      {
        h: "The minimal table",
        blocks: [
          { p: "Three lines are enough to make a table: the header, the separator, and at least one row. Every line starts and ends with a pipe, and each cell sits between two pipes." },
          { code: "| Tool     | Runs in       | Price |\n|----------|---------------|-------|\n| utilisio | the browser   | free  |\n| Pandoc   | your terminal | free  |" },
          { p: "The separator row is what turns lines of text into a table. Without it, a renderer shows the pipes as plain characters. It needs exactly as many cells as the header: a header with three columns and a separator with two is not a table, it's a paragraph." },
          { p: "The pipes don't need to line up. Padding the cells with spaces so that the columns align in the source is purely for the person reading the raw file; the renderer ignores it. The leading and trailing pipes are also optional on GitHub, but keeping them makes the table readable in any editor and avoids surprises with renderers that are stricter." },
          { p: "Rows don't all need the same number of cells. On GitHub, a row with fewer cells is padded with empty ones, and extra cells beyond the header's width are dropped. That's convenient for leaving a cell blank, but a missing pipe in the middle of a row silently shifts everything after it one column to the left." },
        ],
      },
      {
        h: "Aligning columns",
        blocks: [
          { p: "Alignment is set in the separator row, one column at a time, with colons around the dashes." },
          { table: {
            head: ["Separator", "Alignment", "Typical use"],
            rows: [
              ["`---` or `:---`", "Left", "Text, names, descriptions"],
              ["`:---:`", "Centered", "Short status values, check marks"],
              ["`---:`", "Right", "Numbers, prices, sizes, so the digits line up"],
            ],
          } },
          { p: "On GitHub, one dash per cell is enough; three is the convention and some older renderers require it. The number of dashes has no effect on column width in GitHub's rendering, which sizes columns from their content. Pandoc is an exception: in long tables it uses the relative length of the dashes to share out the width." },
          { p: "Right-aligning numeric columns is the change that most improves a table's readability. When figures of different lengths are left-aligned, the eye has to compare the first digits of 9 and 1,250 as if they had the same weight." },
        ],
      },
      {
        h: "What you can put in a cell",
        blocks: [
          { p: "Cells accept inline Markdown: bold, italics, `code`, links and images. A table of tools with a link in the first column and an inline code sample in the second works exactly as you'd expect." },
          { p: "What cells can't hold is anything that spans several lines. A cell is one line of source, so a list, a code block or a paragraph break is impossible in pure Markdown. On GitHub and most renderers that accept HTML, you can force a line break inside a cell with `<br>`:" },
          { code: "| Command       | Effect                                   |\n|---------------|------------------------------------------|\n| `npm ci`      | Installs from the lockfile.<br>Fails if it is out of date. |" },
          { p: "The other character to watch is the pipe itself. A `|` inside a cell ends the cell, even inside inline code. Escape it with a backslash, `\\|`, and it displays as a normal pipe. This matters as soon as a table documents shell commands, regular expressions or TypeScript union types such as `string \\| null`." },
          { p: "Our [Markdown table generator](/t/md-table) does both for you: pipes typed in a cell are escaped, and line breaks are turned into spaces so the row stays on one line." },
        ],
      },
      {
        h: "Tables in a README",
        blocks: [
          { p: "READMEs are where most Markdown tables live: feature comparisons, configuration options, supported versions, environment variables. A few habits make them hold up." },
          { ul: [
            "Leave a blank line before and after the table. GitHub is tolerant, but some renderers and linters won't recognize a table glued to the paragraph above it.",
            "Keep tables narrow. GitHub scrolls wide tables horizontally, which on a phone means most readers never see the last columns. Four or five columns is a comfortable maximum; beyond that, split the table or turn columns into rows.",
            "For feature matrices, emoji read faster than words: ✅ and ❌, or the shortcodes `:white_check_mark:` and `:x:` that GitHub converts for you. Center that column.",
            "Put the column the reader scans first on the left: the option name, the command, the version. Descriptions go last, because they're the longest.",
          ] },
          { p: "To check the result before pushing, paste the Markdown into the [Markdown to HTML converter](/t/markdown-html) and look at the preview. It parses GitHub Flavored Markdown, so the table is built the same way as on the repository page; only the styling differs." },
        ],
      },
      {
        h: "When Markdown isn't enough: merged cells and HTML tables",
        blocks: [
          { p: "Markdown tables have no merged cells, no header column, no caption and no way to set a width. When you need one of those, write the table in HTML directly. GitHub renders HTML tables in READMEs and issues, including `colspan` and `rowspan`, while stripping styles and scripts." },
          { code: "<table>\n  <tr><th rowspan=\"2\">Plan</th><th colspan=\"2\">Limits</th></tr>\n  <tr><th>Files</th><th>Size</th></tr>\n  <tr><td>Free</td><td>10</td><td>5 MB</td></tr>\n</table>" },
          { p: "The price is readability in the source. An HTML table is much harder to edit in a diff or a pull request review, so keep it for the one table that really needs it and leave the rest in Markdown." },
          { p: "A table without a header row doesn't exist in GitHub Flavored Markdown either. The usual workaround is a header of empty cells, `|   |   |`, which renders as a thin empty band above the data. It works, but it's often a sign that a list would say the same thing better." },
        ],
      },
      {
        h: "From a spreadsheet to Markdown",
        blocks: [
          { p: "Copying cells from Excel or Google Sheets gives you text with tabs between the columns. In a code editor, replacing each tab with ` | ` and adding a pipe at the start and end of each line gives you the rows; add the separator row under the first line and the table is done." },
          { p: "For a handful of rows, it's often quicker to type the values into the [table generator](/t/md-table), which adds the separator and alignment markers for you and lets you add or remove columns without rewriting every line. For data that changes often, generate the table from the source file with a script rather than editing it by hand: a table maintained by hand in a README is the first thing to go stale." },
        ],
      },
    ],
    faq: [
      { q: "How do I make a table in Markdown?", a: "Write a header row with cells separated by pipes, then a separator row of dashes with one cell per column, then one line per row: | A | B |, |---|---|, | 1 | 2 |. Leave a blank line before the table." },
      { q: "How do I center a column in a Markdown table?", a: "Put a colon on both sides of the dashes for that column in the separator row, as in :---:. A colon on the right only, ---:, aligns to the right." },
      { q: "How do I add a line break inside a table cell?", a: "Markdown doesn't allow it, but GitHub and most renderers accept the HTML tag <br> inside a cell. The cell must still be written on a single line of source." },
      { q: "How do I write a pipe character inside a table?", a: "Escape it with a backslash: \\|. Otherwise it's read as the end of the cell, even inside inline code." },
      { q: "Can I merge cells in a Markdown table?", a: "No. Use an HTML table with colspan or rowspan instead; GitHub renders it in READMEs and issues." },
    ],
  },
  fr: {
    title: "Tableaux Markdown : syntaxe, alignement et astuces README",
    description: "Écrire un tableau en Markdown pour un README ou une issue GitHub : pipes, ligne de séparation, alignement, échapper le |, retours à la ligne, fusion.",
    lead: "Un tableau Markdown, c'est une ligne d'en-tête, une ligne de séparation faite de tirets, puis une ligne par rangée, avec des cellules séparées par des pipes : | Nom | Rôle |, puis |---|---|, puis vos données. Des deux-points dans la ligne de séparation règlent l'alignement. Les tableaux ne font pas partie du Markdown d'origine : ils viennent du GitHub Flavored Markdown, que gèrent GitHub, GitLab, VS Code et la plupart des outils de documentation.",
    sections: [
      {
        h: "Le tableau minimal",
        blocks: [
          { p: "Trois lignes suffisent pour faire un tableau : l'en-tête, la séparation et au moins une rangée. Chaque ligne commence et finit par un pipe, et chaque cellule se trouve entre deux pipes." },
          { code: "| Outil    | Tourne dans     | Prix    |\n|----------|-----------------|---------|\n| utilisio | le navigateur   | gratuit |\n| Pandoc   | votre terminal  | gratuit |" },
          { p: "C'est la ligne de séparation qui transforme des lignes de texte en tableau. Sans elle, le moteur de rendu affiche les pipes comme de simples caractères. Elle doit avoir exactement autant de cellules que l'en-tête : un en-tête à trois colonnes avec une séparation à deux, ce n'est pas un tableau, c'est un paragraphe." },
          { p: "Les pipes n'ont pas besoin d'être alignés. Compléter les cellules avec des espaces pour que les colonnes tombent droit dans le source sert uniquement à qui lit le fichier brut ; le rendu l'ignore. Les pipes de début et de fin de ligne sont eux aussi facultatifs sur GitHub, mais les garder rend le tableau lisible dans n'importe quel éditeur et évite les surprises avec des moteurs plus stricts." },
          { p: "Toutes les rangées n'ont pas besoin du même nombre de cellules. Sur GitHub, une rangée trop courte est complétée par des cellules vides, et les cellules en trop au-delà de la largeur de l'en-tête sont ignorées. C'est pratique pour laisser une case vide, mais un pipe oublié au milieu d'une rangée décale en silence tout ce qui suit d'une colonne vers la gauche." },
        ],
      },
      {
        h: "Aligner les colonnes",
        blocks: [
          { p: "L'alignement se règle dans la ligne de séparation, colonne par colonne, avec des deux-points autour des tirets." },
          { table: {
            head: ["Séparation", "Alignement", "Usage courant"],
            rows: [
              ["`---` ou `:---`", "À gauche", "Texte, noms, descriptions"],
              ["`:---:`", "Centré", "Statuts courts, coches"],
              ["`---:`", "À droite", "Nombres, prix, tailles, pour que les chiffres s'alignent"],
            ],
          } },
          { p: "Sur GitHub, un tiret par cellule suffit ; trois est la convention, et certains moteurs anciens l'exigent. Le nombre de tirets n'a aucun effet sur la largeur des colonnes dans le rendu de GitHub, qui les dimensionne d'après leur contenu. Pandoc fait exception : dans les longs tableaux, il se sert de la longueur relative des tirets pour répartir la largeur." },
          { p: "Aligner à droite les colonnes de nombres est le changement qui améliore le plus la lisibilité d'un tableau. Quand des chiffres de longueurs différentes sont alignés à gauche, l'œil doit comparer les premiers chiffres de 9 et de 1 250 comme s'ils avaient le même poids." },
        ],
      },
      {
        h: "Ce qu'on peut mettre dans une cellule",
        blocks: [
          { p: "Les cellules acceptent le Markdown en ligne : gras, italique, `code`, liens et images. Un tableau d'outils avec un lien dans la première colonne et un exemple de code dans la deuxième fonctionne exactement comme on l'attend." },
          { p: "Ce qu'une cellule ne peut pas contenir, c'est tout ce qui s'étale sur plusieurs lignes. Une cellule tient sur une ligne de source : une liste, un bloc de code ou un saut de paragraphe sont impossibles en Markdown pur. Sur GitHub et la plupart des moteurs qui acceptent le HTML, on force un retour à la ligne dans une cellule avec `<br>` :" },
          { code: "| Commande      | Effet                                    |\n|---------------|------------------------------------------|\n| `npm ci`      | Installe depuis le lockfile.<br>Échoue s'il n'est pas à jour. |" },
          { p: "L'autre caractère à surveiller, c'est le pipe lui-même. Un `|` dans une cellule termine la cellule, même à l'intérieur de code en ligne. Échappez-le avec un antislash, `\\|`, et il s'affiche comme un pipe normal. Ça compte dès qu'un tableau documente des commandes shell, des expressions régulières ou des unions de types TypeScript comme `string \\| null`." },
          { p: "Notre [générateur de tableaux Markdown](/t/md-table) fait les deux pour vous : les pipes tapés dans une cellule sont échappés, et les retours à la ligne transformés en espaces pour que la rangée reste sur une ligne." },
        ],
      },
      {
        h: "Les tableaux dans un README",
        blocks: [
          { p: "C'est dans les README que vivent la plupart des tableaux Markdown : comparatifs de fonctionnalités, options de configuration, versions prises en charge, variables d'environnement. Quelques habitudes les rendent solides." },
          { ul: [
            "Laissez une ligne vide avant et après le tableau. GitHub est tolérant, mais certains moteurs et linters ne reconnaissent pas un tableau collé au paragraphe du dessus.",
            "Gardez des tableaux étroits. GitHub fait défiler horizontalement les tableaux larges : sur un téléphone, la plupart des lecteurs ne voient jamais les dernières colonnes. Quatre ou cinq colonnes, c'est un maximum confortable ; au-delà, coupez le tableau ou transformez des colonnes en rangées.",
            "Pour les matrices de fonctionnalités, les emoji se lisent plus vite que les mots : ✅ et ❌, ou les codes `:white_check_mark:` et `:x:` que GitHub convertit pour vous. Centrez cette colonne.",
            "Mettez à gauche la colonne que le lecteur parcourt en premier : le nom de l'option, la commande, la version. Les descriptions vont en dernier, parce que ce sont les plus longues.",
          ] },
          { p: "Pour vérifier le résultat avant de pousser, collez le Markdown dans le [convertisseur Markdown vers HTML](/t/markdown-html) et regardez l'aperçu. Il lit le GitHub Flavored Markdown : le tableau y est construit comme sur la page du dépôt, seul le style change." },
        ],
      },
      {
        h: "Quand le Markdown ne suffit plus : fusion de cellules et tableaux HTML",
        blocks: [
          { p: "Les tableaux Markdown n'ont ni cellules fusionnées, ni colonne d'en-tête, ni légende, ni moyen de fixer une largeur. Quand il vous faut l'un de ces éléments, écrivez directement le tableau en HTML. GitHub affiche les tableaux HTML dans les README et les issues, `colspan` et `rowspan` compris, en retirant styles et scripts." },
          { code: "<table>\n  <tr><th rowspan=\"2\">Offre</th><th colspan=\"2\">Limites</th></tr>\n  <tr><th>Fichiers</th><th>Taille</th></tr>\n  <tr><td>Gratuite</td><td>10</td><td>5 Mo</td></tr>\n</table>" },
          { p: "Le prix à payer, c'est la lisibilité du source. Un tableau HTML est bien plus pénible à modifier dans un diff ou une revue de pull request : réservez-le au seul tableau qui en a vraiment besoin et laissez le reste en Markdown." },
          { p: "Un tableau sans ligne d'en-tête n'existe pas non plus en GitHub Flavored Markdown. Le contournement habituel est un en-tête de cellules vides, `|   |   |`, qui s'affiche comme une fine bande vide au-dessus des données. Ça marche, mais c'est souvent le signe qu'une liste dirait la même chose en mieux." },
        ],
      },
      {
        h: "D'un tableur au Markdown",
        blocks: [
          { p: "Copier des cellules depuis Excel ou Google Sheets donne du texte avec des tabulations entre les colonnes. Dans un éditeur de code, remplacer chaque tabulation par ` | ` et ajouter un pipe en début et en fin de ligne donne les rangées ; ajoutez la ligne de séparation sous la première ligne, et le tableau est prêt." },
          { p: "Pour quelques rangées, il est souvent plus rapide de taper les valeurs dans le [générateur de tableaux](/t/md-table), qui ajoute la séparation et les marqueurs d'alignement à votre place et permet d'ajouter ou de retirer des colonnes sans réécrire chaque ligne. Pour des données qui changent souvent, générez le tableau depuis le fichier source avec un script plutôt que de le modifier à la main : un tableau entretenu à la main dans un README est la première chose à devenir obsolète." },
        ],
      },
    ],
    faq: [
      { q: "Comment faire un tableau en Markdown ?", a: "Écrivez une ligne d'en-tête aux cellules séparées par des pipes, puis une ligne de séparation en tirets avec une cellule par colonne, puis une ligne par rangée : | A | B |, |---|---|, | 1 | 2 |. Laissez une ligne vide avant le tableau." },
      { q: "Comment centrer une colonne dans un tableau Markdown ?", a: "Mettez un deux-points de chaque côté des tirets de cette colonne dans la ligne de séparation, comme :---:. Un deux-points à droite seulement, ---:, aligne à droite." },
      { q: "Comment faire un retour à la ligne dans une cellule ?", a: "Le Markdown ne le permet pas, mais GitHub et la plupart des moteurs acceptent la balise HTML <br> dans une cellule. La cellule doit quand même tenir sur une seule ligne de source." },
      { q: "Comment écrire un pipe dans un tableau ?", a: "Échappez-le avec un antislash : \\|. Sinon il est lu comme la fin de la cellule, même dans du code en ligne." },
      { q: "Peut-on fusionner des cellules dans un tableau Markdown ?", a: "Non. Utilisez plutôt un tableau HTML avec colspan ou rowspan ; GitHub l'affiche dans les README et les issues." },
    ],
  },
};
