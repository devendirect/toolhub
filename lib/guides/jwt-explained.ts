import type { Guide } from "../guides";

export const GUIDE_JWT: Guide = {
  slug: "jwt-explained",
  published: "2026-09-25",
  updated: "2026-09-25",
  tools: ["jwt-decoder", "jwt-generator", "timestamp", "base64"],
  en: {
    title: "JWT explained: what's inside a token, and what isn't safe",
    description: "What a JWT contains, why anyone can read its payload, how exp and iat work, and the mistakes that turn a signed token into a security hole.",
    lead: "A JWT is three pieces of base64url text joined by dots: a header, a payload of claims, and a signature. The payload is encoded, not encrypted, so anyone holding the token can read it. What makes a JWT trustworthy is the signature, and only when the server verifies it, with an algorithm it chose, before believing a single claim.",
    sections: [
      {
        h: "What's inside a JWT",
        blocks: [
          { p: "Take any token and split it on the two dots. The first part is the header, the second the payload, the third the signature. Decode the first two from base64url and you get plain JSON:" },
          { code: "// header\n{ \"alg\": \"HS256\", \"typ\": \"JWT\" }\n\n// payload\n{\n  \"sub\": \"user_1842\",\n  \"role\": \"editor\",\n  \"iat\": 1790323200,\n  \"exp\": 1790326800\n}" },
          { p: "The header says how the token was signed. The payload holds the claims: who the token is about (sub), when it was issued (iat), when it stops being valid (exp), and whatever the application adds, like a role. The signature is computed over the first two parts with a key, so changing a single character of the payload makes it invalid." },
          { p: "You can see all of this in the [JWT decoder](/t/jwt-decoder): paste a token, and it splits it, decodes the JSON, and turns exp, iat and nbf into readable dates, with a flag telling you whether the token has expired." },
        ],
      },
      {
        h: "Encoded is not encrypted",
        blocks: [
          { p: "This is the misunderstanding behind most JWT leaks. Base64url is a way to write bytes as URL-safe text, not a way to hide them. Anyone who gets hold of a token, from a log file, a browser extension, a screenshot of dev tools, can read its payload in seconds, without any key." },
          { p: "So the rule is simple: never put anything in a payload that you wouldn't show the user it belongs to. An ID and a role, fine. An email address, think twice, since tokens end up in logs. A password hash, an internal price, another user's data: never. If the content really must stay secret, the format for that is JWE, an encrypted variant, and it's rarely what people actually need." },
          { p: "A side effect worth knowing: because the payload is readable, the client can show the user's name from the token without calling the API. That's convenient, as long as nothing on the server trusts what the client says it read." },
        ],
      },
      {
        h: "exp, iat and nbf: timestamps in seconds",
        blocks: [
          { p: "The time claims are Unix timestamps in seconds: exp is the expiry, iat the issue time, nbf the moment before which the token must be refused. Seconds, not milliseconds, and that one detail produces two opposite bugs." },
          { ul: [
            "Token always rejected as expired: your own check compares exp with `Date.now()`, which returns milliseconds. A value in seconds is always a thousand times smaller, so every token looks long expired.",
            "Token that never expires: you set exp from `Date.now()` without dividing by 1000. The token is valid until roughly the year 58,000. Nothing fails, and that's the problem: a stolen token stays usable forever.",
          ] },
          { p: "Write `Math.floor(Date.now() / 1000)` whenever you build or compare a JWT time, and check a doubtful value in the [timestamp converter](/t/timestamp): a 13-digit number is milliseconds, a 10-digit one is seconds." },
          { p: "Also allow a little clock skew. Servers rarely agree to the second, so most libraries accept a leeway of a few seconds to a minute on exp and nbf. Without it, a token issued by one machine can be refused by another as not yet valid." },
        ],
      },
      {
        h: "Decoding isn't verifying",
        blocks: [
          { p: "Reading a payload proves nothing. Anyone can write a JSON object that says role: admin, encode it and glue it to a header. The only thing that makes a claim believable is a signature that the server checks with its own key, before reading the claims." },
          { p: "Two historical mistakes come from trusting the header, which is written by whoever made the token:" },
          { ul: [
            "The none algorithm. The JWT standard defines alg: none for unsigned tokens. A server that accepts whatever algorithm the header names can be handed a token with no signature at all. Refuse none outright.",
            "Algorithm confusion. If a server expecting RS256 (a public and a private key) lets the header switch it to HS256 (one shared secret), an attacker can sign a token with the public key, which is public by definition. The fix is the same: the server decides the algorithm, never the token.",
          ] },
          { p: "Every serious library lets you pass the list of accepted algorithms when you verify. Pass exactly one, and treat any token that asks for another as invalid." },
        ],
      },
      {
        h: "HS256 or RS256?",
        blocks: [
          { p: "HS256 uses one shared secret to sign and to verify. It's simple and fits a single service that issues and checks its own tokens. The weakness is that anyone able to verify can also sign, so the secret must never reach a client or a third party." },
          { p: "RS256 and ES256 sign with a private key and verify with a public key. That's the right choice when several services, or other companies, need to check your tokens: you publish the public key and keep the private one to yourself." },
          { p: "For HS256, the secret must be long and random: a short human password can be brute-forced offline from any token you issue, since the attacker has everything needed to test guesses. Generate it with the [password generator](/t/password-generator) at 32 characters or more, and to try the flow end to end, sign a test token with the [JWT generator](/t/jwt-generator), which does it in your browser without sending the key anywhere." },
        ],
      },
      {
        h: "Where tokens should live, and how long",
        blocks: [
          { p: "A JWT stored in localStorage can be read by any script running on your page, which means a single XSS flaw hands it to an attacker. An HttpOnly cookie can't be read by scripts, which removes that risk, but cookies are sent automatically, so you then need protection against cross-site request forgery (SameSite settings, CSRF tokens). There's no option without trade-offs; for browser sessions, an HttpOnly, Secure, SameSite cookie is the usual recommendation." },
          { p: "Keep access tokens short-lived, minutes rather than days. A JWT can't be recalled once issued, short of keeping a server-side deny list, so its lifetime is your exposure window if it leaks. Longer sessions are handled with a separate refresh token that the server can revoke." },
        ],
      },
    ],
    faq: [
      { q: "Can anyone read the contents of a JWT?", a: "Yes. The header and payload are only base64url-encoded, so anyone who has the token can decode and read them without a key. Only the signature protects the token, and it protects against changes, not against reading." },
      { q: "Is it safe to paste a production token into an online decoder?", a: "Only if the decoder works in your browser. Our JWT decoder decodes with a few lines of JavaScript in the page and sends nothing. Even so, a production token is a live credential: prefer an expired or test token when you can." },
      { q: "Why is my JWT always rejected as expired?", a: "Most often because code compares exp, which is in seconds, with Date.now(), which returns milliseconds. Divide Date.now() by 1000. Also check the server clocks: without a small leeway, a few seconds of drift can reject a fresh token." },
      { q: "Can I revoke a JWT before it expires?", a: "Not by itself: a signed token stays valid until exp. To revoke early, the server has to keep a list of revoked token IDs (the jti claim) or rotate the signing key. That's why access tokens are kept short-lived." },
    ],
  },
  fr: {
    title: "Comprendre un JWT : son contenu, et ce qui n'est pas sûr",
    description: "Ce que contient un JWT, pourquoi n'importe qui peut le lire, comment marchent exp et iat, et les erreurs qui transforment un jeton signé en faille.",
    lead: "Un JWT, ce sont trois morceaux de texte en base64url reliés par des points : un en-tête, un contenu de claims et une signature. Le contenu est encodé, pas chiffré : quiconque détient le jeton peut le lire. Ce qui rend un JWT digne de confiance, c'est la signature, et seulement quand le serveur la vérifie, avec un algorithme qu'il a lui-même choisi, avant de croire le moindre claim.",
    sections: [
      {
        h: "Ce que contient un JWT",
        blocks: [
          { p: "Prenez n'importe quel jeton et coupez-le aux deux points. La première partie est l'en-tête, la deuxième le contenu (payload), la troisième la signature. Décodez les deux premières depuis le base64url, et vous obtenez du JSON tout simple :" },
          { code: "// en-tête\n{ \"alg\": \"HS256\", \"typ\": \"JWT\" }\n\n// contenu\n{\n  \"sub\": \"user_1842\",\n  \"role\": \"editor\",\n  \"iat\": 1790323200,\n  \"exp\": 1790326800\n}" },
          { p: "L'en-tête indique comment le jeton a été signé. Le contenu porte les claims : de qui parle le jeton (sub), quand il a été émis (iat), quand il cesse d'être valable (exp), et tout ce que l'application ajoute, comme un rôle. La signature est calculée sur les deux premières parties avec une clé : changer un seul caractère du contenu la rend invalide." },
          { p: "Vous pouvez voir tout cela dans le [décodeur JWT](/t/jwt-decoder) : collez un jeton, il le découpe, décode le JSON et transforme exp, iat et nbf en dates lisibles, en indiquant si le jeton a expiré." },
        ],
      },
      {
        h: "Encodé ne veut pas dire chiffré",
        blocks: [
          { p: "C'est le malentendu derrière la plupart des fuites liées aux JWT. Le base64url est une façon d'écrire des octets en texte compatible avec les URL, pas une façon de les cacher. Quiconque met la main sur un jeton, dans un fichier de logs, une extension de navigateur, une capture des outils de développement, peut lire son contenu en quelques secondes, sans aucune clé." },
          { p: "La règle est donc simple : ne mettez jamais dans un jeton ce que vous ne montreriez pas à la personne à qui il appartient. Un identifiant et un rôle, très bien. Une adresse e-mail, réfléchissez-y, puisque les jetons finissent dans les logs. Un hash de mot de passe, un prix interne, les données d'un autre utilisateur : jamais. Si le contenu doit vraiment rester secret, le format prévu est le JWE, une variante chiffrée, et c'est rarement ce dont on a réellement besoin." },
          { p: "Un effet secondaire bon à savoir : puisque le contenu est lisible, le client peut afficher le nom de l'utilisateur à partir du jeton, sans appeler l'API. C'est pratique, tant que rien côté serveur ne fait confiance à ce que le client dit y avoir lu." },
        ],
      },
      {
        h: "exp, iat et nbf : des timestamps en secondes",
        blocks: [
          { p: "Les claims de temps sont des timestamps Unix en secondes : exp est l'expiration, iat la date d'émission, nbf le moment avant lequel le jeton doit être refusé. Des secondes, pas des millisecondes, et ce seul détail produit deux bugs opposés." },
          { ul: [
            "Jeton toujours rejeté comme expiré : votre propre contrôle compare exp à `Date.now()`, qui renvoie des millisecondes. Une valeur en secondes est toujours mille fois plus petite, donc chaque jeton paraît expiré depuis longtemps.",
            "Jeton qui n'expire jamais : vous calculez exp à partir de `Date.now()` sans diviser par 1000. Le jeton est valable jusque vers l'an 58 000. Rien n'échoue, et c'est bien le problème : un jeton volé reste utilisable indéfiniment.",
          ] },
          { p: "Écrivez `Math.floor(Date.now() / 1000)` chaque fois que vous construisez ou comparez un temps de JWT, et vérifiez une valeur douteuse dans le [convertisseur de timestamp](/t/timestamp) : un nombre à 13 chiffres est en millisecondes, un nombre à 10 chiffres en secondes." },
          { p: "Prévoyez aussi un peu de décalage d'horloge. Les serveurs sont rarement d'accord à la seconde près : la plupart des bibliothèques acceptent une tolérance de quelques secondes à une minute sur exp et nbf. Sans elle, un jeton émis par une machine peut être refusé par une autre comme « pas encore valable »." },
        ],
      },
      {
        h: "Décoder n'est pas vérifier",
        blocks: [
          { p: "Lire un contenu ne prouve rien. N'importe qui peut écrire un objet JSON qui dit role: admin, l'encoder et le coller à un en-tête. La seule chose qui rend un claim crédible, c'est une signature que le serveur vérifie avec sa propre clé, avant de lire les claims." },
          { p: "Deux erreurs historiques viennent d'une confiance accordée à l'en-tête, écrit par celui qui a fabriqué le jeton :" },
          { ul: [
            "L'algorithme none. Le standard JWT définit alg: none pour les jetons non signés. Un serveur qui accepte l'algorithme annoncé par l'en-tête peut recevoir un jeton sans aucune signature. Refusez none catégoriquement.",
            "La confusion d'algorithmes. Si un serveur qui attend du RS256 (une clé publique et une clé privée) laisse l'en-tête le faire passer en HS256 (un seul secret partagé), un attaquant peut signer un jeton avec la clé publique, publique par définition. La parade est la même : c'est le serveur qui décide de l'algorithme, jamais le jeton.",
          ] },
          { p: "Toute bibliothèque sérieuse permet de fournir la liste des algorithmes acceptés au moment de la vérification. Donnez-en exactement un, et traitez comme invalide tout jeton qui en demande un autre." },
        ],
      },
      {
        h: "HS256 ou RS256 ?",
        blocks: [
          { p: "Le HS256 utilise un seul secret partagé pour signer et pour vérifier. C'est simple, et adapté à un service unique qui émet et contrôle ses propres jetons. Sa faiblesse : quiconque peut vérifier peut aussi signer, donc le secret ne doit jamais atteindre un client ou un tiers." },
          { p: "Le RS256 et l'ES256 signent avec une clé privée et vérifient avec une clé publique. C'est le bon choix quand plusieurs services, ou d'autres entreprises, doivent contrôler vos jetons : vous publiez la clé publique et gardez la clé privée pour vous." },
          { p: "En HS256, le secret doit être long et aléatoire : un mot de passe humain court peut être cassé hors ligne à partir de n'importe quel jeton émis, puisque l'attaquant a tout ce qu'il faut pour tester ses essais. Générez-le avec le [générateur de mots de passe](/t/password-generator), sur 32 caractères ou plus, et pour tester le circuit de bout en bout, signez un jeton de test avec le [générateur de JWT](/t/jwt-generator), qui le fait dans votre navigateur sans envoyer la clé nulle part." },
        ],
      },
      {
        h: "Où stocker les jetons, et pour combien de temps",
        blocks: [
          { p: "Un JWT rangé dans le localStorage peut être lu par n'importe quel script de votre page : une seule faille XSS le livre à un attaquant. Un cookie HttpOnly ne peut pas être lu par les scripts, ce qui écarte ce risque, mais les cookies sont envoyés automatiquement, et il faut alors se protéger des requêtes intersites forgées (réglages SameSite, jetons CSRF). Aucune option n'est sans compromis ; pour des sessions navigateur, un cookie HttpOnly, Secure et SameSite est la recommandation habituelle." },
          { p: "Gardez des jetons d'accès de courte durée, des minutes plutôt que des jours. Un JWT ne peut pas être rappelé une fois émis, sauf à tenir une liste de refus côté serveur : sa durée de vie est votre fenêtre d'exposition en cas de fuite. Les sessions longues passent par un jeton de rafraîchissement distinct, que le serveur peut révoquer." },
        ],
      },
    ],
    faq: [
      { q: "N'importe qui peut-il lire le contenu d'un JWT ?", a: "Oui. L'en-tête et le contenu sont seulement encodés en base64url : quiconque détient le jeton peut les décoder et les lire sans clé. Seule la signature protège le jeton, et elle protège contre la modification, pas contre la lecture." },
      { q: "Puis-je coller un jeton de production dans un décodeur en ligne ?", a: "Seulement si le décodeur fonctionne dans votre navigateur. Notre décodeur JWT décode avec quelques lignes de JavaScript dans la page et n'envoie rien. Même ainsi, un jeton de production est un identifiant actif : préférez un jeton expiré ou de test quand c'est possible." },
      { q: "Pourquoi mon JWT est-il toujours rejeté comme expiré ?", a: "Le plus souvent parce qu'un code compare exp, en secondes, à Date.now(), qui renvoie des millisecondes. Divisez Date.now() par 1000. Vérifiez aussi les horloges des serveurs : sans petite tolérance, quelques secondes d'écart peuvent faire refuser un jeton tout neuf." },
      { q: "Peut-on révoquer un JWT avant son expiration ?", a: "Pas à lui seul : un jeton signé reste valable jusqu'à exp. Pour révoquer plus tôt, le serveur doit tenir une liste des identifiants de jetons révoqués (le claim jti) ou changer de clé de signature. C'est pour ça qu'on garde des jetons d'accès de courte durée." },
    ],
  },
};
