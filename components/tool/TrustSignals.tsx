import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";
import { REPO_URL } from "@/lib/brand";

interface TrustSignalsProps {
  privacy?: "local" | "network";
  lang: Lang;
}

function Row({ children, variant = "local" }: { children: React.ReactNode; variant?: "local" | "network" }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span
        className="inline-block w-[7px] h-[7px] rounded-full shrink-0"
        style={{
          background: variant === "network" ? "var(--hot)" : "var(--brand)",
          boxShadow: variant === "network" ? "0 0 8px var(--hot)" : "0 0 8px var(--brand)",
        }}
      />
      <span className={`font-mono text-[12px] whitespace-nowrap ${variant === "network" ? "text-hot" : "text-fg-1"}`}>
        {children}
      </span>
    </div>
  );
}

export function TrustSignals({ privacy = "local", lang }: TrustSignalsProps) {
  const i = t(lang);

  return (
    <div className="border border-line bg-bg-1 p-4 flex flex-col gap-[10px] text-[12px] self-start">
      {privacy === "network" ? (
        <>
          <Row variant="network">{i.privacyNetwork}</Row>
          <Row>{i.privacyNotStored}</Row>
          <Row><a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand underline-offset-2 hover:underline">{i.openSource}</a></Row>
          <p className="font-mono text-[11px] text-dim leading-[1.5] mt-2 pt-2 border-t border-dashed border-line">
            {"// "}{lang === "fr" ? "passe par notre serveur : un navigateur ne peut pas lire un autre site directement (CORS)" : "goes through our server: a browser can't read another site directly (CORS)"}
          </p>
        </>
      ) : (
        <>
          <Row>{i.privacyLocal}</Row>
          <Row>{i.privacyNoLog}</Row>
          <Row><a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand underline-offset-2 hover:underline">{i.openSource}</a></Row>
        </>
      )}
    </div>
  );
}
