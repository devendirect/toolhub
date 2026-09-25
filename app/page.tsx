import { permanentRedirect } from "next/navigation";

// Filet de sécurité : proxy.ts redirige « / » avant d'arriver ici (308 vers /en,
// 302 vers /fr pour un visiteur francophone). Permanente, comme le cas par défaut.
export default function RootPage() {
  permanentRedirect("/en");
}
