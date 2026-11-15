import type { Guide } from "../guides";

export const GUIDE_UTM_GA4_CHANNELS: Guide = {
  slug: "utm-ga4-channels",
  published: "2026-11-15",
  updated: "2026-11-15",
  tools: ["utm-builder"],
  verified: "2026-11-15",
  sources: [
    { id: "ga4-channels", title: "Default channel group", publisher: "Google Analytics Help", url: "https://support.google.com/analytics/answer/9756891", official: true },
    { id: "techwyse-ai", title: "Google Analytics Adds Native AI Assistant Channel to GA4's Default Channel Group", publisher: "TechWyse", url: "https://www.techwyse.com/news/platform-updates/google-analytics-ai-assistant-channel-ga4-default-channel-group", official: false },
    { id: "ppcland-bing", title: "Microsoft Advertising's UTM fix will finally separate Bing campaign types", publisher: "PPC Land", url: "https://ppc.land/microsoft-advertisings-utm-fix-will-finally-separate-bing-campaign-types/", official: false },
  ],
  claims: [
    { text: { fr: "Les définitions des canaux par défaut de GA4 ne sont pas sensibles à la casse et ne sont pas modifiables", en: "GA4's default channel definitions are not case sensitive and can't be edited" }, source: "ga4-channels" },
    { text: { fr: "Paid Search et Paid Social exigent un medium de type cpc, ppc, retargeting ou commençant par paid, avec une source de moteur de recherche ou de réseau social connu", en: "Paid Search and Paid Social require a medium such as cpc, ppc, retargeting or starting with paid, with a known search engine or social network as source" }, source: "ga4-channels" },
    { text: { fr: "Le canal AI Assistant correspond au medium exact ai-assistant, attribué selon une liste de référents d'assistants IA, et exclut les AI Overviews et le mode IA de Google", en: "The AI Assistant channel matches the exact medium ai-assistant, set from a list of AI assistant referrers, and excludes Google's AI Overviews and AI Mode" }, source: "ga4-channels", recheck: { fr: "quand Google modifie la liste des canaux", en: "when Google changes the channel list" } },
    { text: { fr: "Le canal AI Assistant a été ajouté à GA4 en mai 2026 (date issue de la presse spécialisée, absente de la page de Google)", en: "The AI Assistant channel was added to GA4 in May 2026 (date from trade press, not shown on Google's page)" }, source: "techwyse-ai", recheck: { fr: "dans les notes de version de Google Analytics", en: "in the Google Analytics release notes" } },
    { text: { fr: "Microsoft Advertising a changé le format de ses balises automatiques le 2 septembre 2026 (presse spécialisée)", en: "Microsoft Advertising changed the format of its auto-tags on 2 September 2026 (trade press)" }, source: "ppcland-bing", recheck: { fr: "dans l'annonce de Microsoft Advertising", en: "in Microsoft Advertising's own notice" } },
  ],
  en: {
    title: "UTM parameters and GA4 channels: which medium goes where",
    description: "How Google Analytics 4 sorts a visit into Email, Paid Social, Organic Social or AI Assistant from utm_source and utm_medium, and which values to use.",
    lead: "GA4 sorts each visit into a channel using two values you control: utm_source and utm_medium. Use email for newsletters, cpc for paid search, paid_social for paid social ads and social for organic posts. A medium GA4 doesn't recognise leaves the visit in Unassigned. Visits from AI assistants such as ChatGPT or Gemini get their own AI Assistant channel without any tagging.",
    sections: [
      {
        h: "How GA4 decides a visit's channel",
        blocks: [
          { p: "Every visit that reaches Google Analytics 4 is placed in a channel of the default channel group. For links you tag yourself, the decision rests on two values: the source and the medium. The channel rules are fixed: Google's documentation states that they are not case sensitive and cannot be edited.[^ga4-channels] Tagging is therefore a vocabulary exercise. You are not free to call a medium whatever you like, because only certain words are recognised." },
          { p: "The channel is never chosen from the campaign name or from the landing page. If no rule matches the source and medium together, the visit goes to Unassigned, which is GA4's way of telling you that a tag was wrong. Traffic from Google Ads with auto-tagging is classified from platform data rather than from your UTM values, so this guide is about the links you tag by hand: newsletters, social posts, partner placements and ads on other networks." },
        ],
      },
      {
        h: "The medium values GA4 recognises",
        blocks: [
          { table: {
            head: ["utm_medium", "Source needed", "Channel"],
            rows: [
              ["email, e-mail, e_mail, e mail", "Any (a source with one of these names also works)", "Email"],
              ["cpc, ppc, retargeting, or a value starting with paid", "A known search engine", "Paid Search"],
              ["The same values", "A known social network", "Paid Social"],
              ["social, social-network, social-media, sm", "Any (a known social network alone is enough)", "Organic Social"],
              ["display, banner, expandable, interstitial, cpm", "Any", "Display"],
              ["referral, app, link", "Any", "Referral"],
              ["Anything else", "No recognised source", "Unassigned"],
            ],
          } },
          { p: "The source matters for the paid channels. A medium of cpc with google lands in Paid Search, while the same cpc with facebook lands in Paid Social.[^ga4-channels] The lists of search engines and social networks are kept in a spreadsheet that Google links from its documentation. For organic social, a known social network as the source is enough, whatever the medium, unless the medium looks paid." },
        ],
      },
      {
        h: "The most common mistake: paid social tagged as social",
        blocks: [
          { p: "A link in a Facebook ad tagged with utm_source=facebook and utm_medium=social looks right and reads wrong. Social is an organic medium, so GA4 counts the click as free traffic. With paid_social or cpc, the same visit is counted as Paid Social, next to your other paid channels." },
          { code: "Counted as free social traffic:\nhttps://example.com/offer?utm_source=facebook&utm_medium=social&utm_campaign=autumn-sale\n\nCounted as Paid Social:\nhttps://example.com/offer?utm_source=facebook&utm_medium=paid_social&utm_campaign=autumn-sale" },
          { p: "The preset buttons of our [UTM builder](/t/utm-builder) set social for Facebook and X, which suits an organic post. For an ad, change the medium after choosing the preset. It is a one-word edit, and it decides whether your ad spend shows up next to the traffic it paid for." },
        ],
      },
      {
        h: "Source and medium for the usual cases",
        blocks: [
          { table: {
            head: ["Where the link goes", "utm_source", "utm_medium"],
            rows: [
              ["A newsletter", "newsletter", "email"],
              ["A Google search ad tagged by hand", "google", "cpc"],
              ["A Facebook or Instagram ad", "facebook", "paid_social"],
              ["A LinkedIn ad", "linkedin", "paid_social"],
              ["An unpaid LinkedIn post", "linkedin", "social"],
              ["A banner on a partner's site", "partner-name", "display"],
              ["A link on a partner's page", "partner-name", "referral"],
            ],
          } },
          { p: "Whatever you pick, write it down once and reuse it. The campaign name is yours to define and does not change the channel: keep it lowercase, with hyphens instead of spaces. The channel rules ignore case, but the source and medium reports list the values as you wrote them, so a mix of Newsletter and newsletter makes those reports harder to read." },
        ],
      },
      {
        h: "AI assistants have their own channel",
        blocks: [
          { p: "GA4's default channel group now contains an AI Assistant channel. It covers visits from assistants such as ChatGPT, Gemini, Deepseek, Copilot or Grok, and it leaves out Google's AI Overviews and AI Mode. GA4 recognises these visits by itself: when the referrer matches its list of AI assistants, it sets the medium to ai-assistant, and the channel rule is that the medium exactly matches that value.[^ga4-channels] Trade press dates the addition to May 2026, while Google's page shows no date.[^techwyse-ai]" },
          { p: "There is nothing for you to tag here. An assistant that cites your page links to it without UTM parameters, and you can't add them. What you can do is read the channel to see how many visits arrive that way. Two limits are worth knowing. A visit that arrives with no referrer can't be recognised and usually shows up as Direct. And an assistant missing from Google's list ends up elsewhere, typically as an ordinary referral." },
          { p: "Don't use ai-assistant as a medium in your own links. It is the value GA4 assigns itself, and tagging something else with it would mix your campaign traffic into that channel." },
        ],
      },
      {
        h: "Bing campaigns: a change to check in your reports",
        blocks: [
          { p: "Microsoft Advertising changed how its auto-tags are formatted from 2 September 2026, so that GA4 can tell campaign types apart: according to trade press, search campaigns arrive with the source bing and the medium cpc, and other campaign types map to display or to their own paid channels.[^ppcland-bing] The same coverage warns of a break in historical data for most accounts." },
          { p: "If you run Bing ads, compare channel numbers before and after that date before concluding that traffic rose or fell. Check Microsoft's own notice as well: the details here come from secondary reporting, and the exact mapping may differ for your account." },
        ],
      },
      {
        h: "A checklist before you send the link",
        blocks: [
          { ol: [
            "The medium is one of the values in the table, in lowercase.",
            "Paid ads use paid_social, cpc or display, never social.",
            "The source names the place the link sits (newsletter, facebook, a partner's name), not the campaign.",
            "No UTM parameters on links between your own pages.",
            "After sending, open the Traffic acquisition report or the Realtime view and look at where the first visit lands. A visit in Unassigned means the medium isn't one GA4 recognises.",
          ] },
        ],
      },
    ],
    faq: [
      { q: "Which utm_medium should I use for a newsletter?", a: "email, with a source such as newsletter. GA4 files a visit whose medium is email, e-mail, e_mail or e mail under the Email channel. A medium like mailing or newsletter-link matches no rule and lands in Unassigned." },
      { q: "Why do my visits show as Unassigned?", a: "No default channel rule matched the source and medium of those visits. Most often the medium is not one of the recognised values, or it is missing. Correct the tag on the links you send from now on." },
      { q: "Is there a channel for ChatGPT traffic in GA4?", a: "Yes. The default channel group has an AI Assistant channel for visits from assistants such as ChatGPT, Gemini, Copilot or Grok, recognised from the referrer. It excludes Google's AI Overviews and AI Mode, and a visit with no referrer cannot be recognised." },
      { q: "Does capitalisation matter in utm_medium?", a: "For channel grouping, no: Google states that the channel definitions are not case sensitive. Stay lowercase anyway, so that your source and medium reports stay consistent and easy to read." },
    ],
  },
  fr: {
    title: "UTM et canaux GA4 : quel medium va dans quel canal",
    description: "Comment GA4 range une visite dans Email, Paid Social, Organic Social ou AI Assistant d'après utm_source et utm_medium, et quelles valeurs choisir.",
    lead: "GA4 range chaque visite dans un canal à partir de deux valeurs que vous maîtrisez : utm_source et utm_medium. Prenez email pour une newsletter, cpc pour la recherche payante, paid_social pour une publicité sociale payante et social pour une publication organique. Un medium que GA4 ne reconnaît pas laisse la visite dans Non attribué. Les visites venant d'assistants IA comme ChatGPT ou Gemini ont leur propre canal AI Assistant, sans aucun balisage.",
    sections: [
      {
        h: "Comment GA4 décide du canal d'une visite",
        blocks: [
          { p: "Toute visite qui arrive dans Google Analytics 4 est rangée dans un canal du groupe de canaux par défaut. Pour les liens que vous balisez vous-même, la décision repose sur deux valeurs : la source et le medium. Les règles de canaux sont figées : la documentation de Google précise qu'elles ne sont pas sensibles à la casse et qu'elles ne sont pas modifiables.[^ga4-channels] Baliser revient donc à choisir du vocabulaire. Vous n'êtes pas libre de nommer un medium comme vous voulez, car seuls certains mots sont reconnus." },
          { p: "Le canal n'est jamais choisi d'après le nom de la campagne ni la page d'arrivée. Si aucune règle ne correspond à la source et au medium pris ensemble, la visite va dans Non attribué (Unassigned), la manière dont GA4 vous signale qu'un balisage était faux. Le trafic de Google Ads en balisage automatique est classé d'après les données de la plateforme et non d'après vos valeurs UTM : ce guide concerne les liens que vous balisez à la main, newsletters, publications sociales, placements chez des partenaires et publicités sur d'autres réseaux." },
        ],
      },
      {
        h: "Les valeurs de medium que GA4 reconnaît",
        blocks: [
          { table: {
            head: ["utm_medium", "Source nécessaire", "Canal"],
            rows: [
              ["email, e-mail, e_mail, e mail", "Quelconque (une source de ce nom fonctionne aussi)", "Email"],
              ["cpc, ppc, retargeting, ou une valeur commençant par paid", "Un moteur de recherche connu", "Paid Search"],
              ["Les mêmes valeurs", "Un réseau social connu", "Paid Social"],
              ["social, social-network, social-media, sm", "Quelconque (un réseau social connu suffit à lui seul)", "Organic Social"],
              ["display, banner, expandable, interstitial, cpm", "Quelconque", "Display"],
              ["referral, app, link", "Quelconque", "Referral"],
              ["Toute autre valeur", "Aucune source reconnue", "Unassigned"],
            ],
          } },
          { p: "La source compte pour les canaux payants. Un medium cpc avec google tombe dans Paid Search, alors que le même cpc avec facebook tombe dans Paid Social.[^ga4-channels] Les listes de moteurs de recherche et de réseaux sociaux sont conservées dans un tableur que Google référence depuis sa documentation. Pour le social organique, un réseau social connu comme source suffit, quel que soit le medium, sauf si le medium a l'air payant." },
        ],
      },
      {
        h: "L'erreur la plus fréquente : le social payant balisé comme social",
        blocks: [
          { p: "Un lien dans une publicité Facebook balisé avec utm_source=facebook et utm_medium=social paraît juste et se lit faux. Social est un medium organique : GA4 compte donc le clic comme du trafic gratuit. Avec paid_social ou cpc, la même visite est comptée dans Paid Social, à côté de vos autres canaux payants." },
          { code: "Compté comme du trafic social gratuit :\nhttps://example.com/offre?utm_source=facebook&utm_medium=social&utm_campaign=soldes-automne\n\nCompté dans Paid Social :\nhttps://example.com/offre?utm_source=facebook&utm_medium=paid_social&utm_campaign=soldes-automne" },
          { p: "Les préréglages de notre [générateur UTM](/t/utm-builder) mettent social pour Facebook et X, ce qui convient à une publication organique. Pour une publicité, changez le medium après avoir choisi le préréglage. C'est une modification d'un seul mot, et elle décide si votre budget publicitaire apparaît à côté du trafic qu'il a payé." },
        ],
      },
      {
        h: "Source et medium pour les cas courants",
        blocks: [
          { table: {
            head: ["Où va le lien", "utm_source", "utm_medium"],
            rows: [
              ["Une newsletter", "newsletter", "email"],
              ["Une annonce Google de recherche balisée à la main", "google", "cpc"],
              ["Une publicité Facebook ou Instagram", "facebook", "paid_social"],
              ["Une publicité LinkedIn", "linkedin", "paid_social"],
              ["Une publication LinkedIn non payante", "linkedin", "social"],
              ["Une bannière sur le site d'un partenaire", "nom-du-partenaire", "display"],
              ["Un lien sur la page d'un partenaire", "nom-du-partenaire", "referral"],
            ],
          } },
          { p: "Quoi que vous choisissiez, notez-le une fois pour toutes et réutilisez-le. Le nom de campagne vous appartient et ne change pas le canal : gardez-le en minuscules, avec des traits d'union à la place des espaces. Les règles de canaux ignorent la casse, mais les rapports de source et de medium listent les valeurs telles que vous les avez écrites : un mélange de Newsletter et de newsletter rend ces rapports plus difficiles à lire." },
        ],
      },
      {
        h: "Les assistants IA ont leur propre canal",
        blocks: [
          { p: "Le groupe de canaux par défaut de GA4 contient désormais un canal AI Assistant. Il couvre les visites venant d'assistants comme ChatGPT, Gemini, Deepseek, Copilot ou Grok, et il exclut les AI Overviews et le mode IA de Google. GA4 reconnaît ces visites tout seul : quand le référent correspond à sa liste d'assistants IA, il attribue le medium ai-assistant, et la règle du canal est que le medium corresponde exactement à cette valeur.[^ga4-channels] La presse spécialisée situe l'ajout en mai 2026, alors que la page de Google n'affiche aucune date.[^techwyse-ai]" },
          { p: "Il n'y a rien à baliser ici. Un assistant qui cite votre page y renvoie sans paramètres UTM, et vous ne pouvez pas en ajouter. Ce que vous pouvez faire, c'est lire ce canal pour savoir combien de visites arrivent ainsi. Deux limites sont à connaître. Une visite qui arrive sans référent ne peut pas être reconnue et apparaît en général dans Direct. Et un assistant absent de la liste de Google finit ailleurs, typiquement comme un simple référent." },
          { p: "N'utilisez pas ai-assistant comme medium dans vos propres liens. C'est la valeur que GA4 attribue lui-même, et s'en servir pour autre chose mélangerait le trafic de vos campagnes à ce canal." },
        ],
      },
      {
        h: "Campagnes Bing : un changement à vérifier dans vos rapports",
        blocks: [
          { p: "Microsoft Advertising a changé le format de ses balises automatiques à partir du 2 septembre 2026, pour que GA4 distingue les types de campagnes : d'après la presse spécialisée, les campagnes de recherche arrivent avec la source bing et le medium cpc, et les autres types de campagnes sont rattachés à display ou à leurs propres canaux payants.[^ppcland-bing] La même couverture signale une rupture dans les données historiques pour la plupart des comptes." },
          { p: "Si vous diffusez des annonces Bing, comparez les chiffres des canaux avant et après cette date avant de conclure à une hausse ou à une baisse du trafic. Consultez aussi l'annonce de Microsoft : les détails donnés ici viennent de relais secondaires, et la correspondance exacte peut différer pour votre compte." },
        ],
      },
      {
        h: "La liste de contrôle avant d'envoyer le lien",
        blocks: [
          { ol: [
            "Le medium fait partie des valeurs du tableau, en minuscules.",
            "Les publicités payantes utilisent paid_social, cpc ou display, jamais social.",
            "La source nomme l'endroit où se trouve le lien (newsletter, facebook, le nom d'un partenaire), pas la campagne.",
            "Aucun paramètre UTM sur les liens entre vos propres pages.",
            "Après l'envoi, ouvrez le rapport Acquisition de trafic ou la vue Temps réel et regardez où tombe la première visite. Une visite dans Non attribué signifie que le medium n'est pas reconnu par GA4.",
          ] },
        ],
      },
    ],
    faq: [
      { q: "Quel utm_medium utiliser pour une newsletter ?", a: "email, avec une source comme newsletter. GA4 range dans le canal Email une visite dont le medium est email, e-mail, e_mail ou e mail. Un medium comme mailing ou lien-newsletter ne correspond à aucune règle et tombe dans Non attribué." },
      { q: "Pourquoi mes visites apparaissent-elles dans Non attribué ?", a: "Aucune règle de canal par défaut ne correspondait à la source et au medium de ces visites. Le plus souvent, le medium ne fait pas partie des valeurs reconnues, ou il est absent. Corrigez le balisage des liens que vous enverrez désormais." },
      { q: "Existe-t-il un canal pour le trafic de ChatGPT dans GA4 ?", a: "Oui. Le groupe de canaux par défaut contient un canal AI Assistant pour les visites venant d'assistants comme ChatGPT, Gemini, Copilot ou Grok, reconnues grâce au référent. Il exclut les AI Overviews et le mode IA de Google, et une visite sans référent ne peut pas être reconnue." },
      { q: "La casse compte-t-elle dans utm_medium ?", a: "Pour le regroupement en canaux, non : Google précise que les définitions de canaux ne sont pas sensibles à la casse. Restez malgré tout en minuscules, pour que vos rapports de source et de medium restent cohérents et lisibles." },
    ],
  },
};
