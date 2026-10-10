/**
 * Fenêtre « terminal » (barre à trois points + titre + corps en mono), partagée
 * par la page Nouveautés et les blocs de vérification des guides. Composant
 * serveur : le contenu est du vrai HTML, pas une image ni un rendu client.
 */
export function TerminalWindow({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-line-2 bg-bg-code rounded-[6px] overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-[14px] py-[10px] border-b border-line bg-bg-1 font-mono text-[12px] text-dim">
        <span className="flex gap-[6px]" aria-hidden>
          <i className="block w-[10px] h-[10px] rounded-full bg-line-2" />
          <i className="block w-[10px] h-[10px] rounded-full bg-line-2" />
          <i className="block w-[10px] h-[10px] rounded-full bg-line-2" />
        </span>
        <span className="ml-[6px]">{title}</span>
      </div>
      <div className="px-5 py-5 sm:px-6 font-mono text-[13px] leading-[1.75] text-fg-1">{children}</div>
    </div>
  );
}

/** Ligne d'invite `~ $ commande`, décorative (masquée aux lecteurs d'écran). */
export function TerminalPrompt({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={`text-fg ${className}`} aria-hidden>
      <span className="text-brand">~</span> $ {children}
    </p>
  );
}
