"use client";

import { useState, useCallback } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { t } from "@/lib/i18n";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: { quantity: "quantité" },
  en: { quantity: "count" },
} as const;

type Count = 1 | 5 | 10 | 25;

export function UuidGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const [count, setCount] = useState<Count>(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, () => crypto.randomUUID()));
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("uuid-generator", "dev");

  const generate = useCallback((n: Count) => {
    setUuids(Array.from({ length: n }, () => crypto.randomUUID()));
  }, []);

  const handleCopyAll = () => copy(uuids.join("\n"), "__all__");

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => { trackRun(); generate(count); }}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
          >
            {i.generateBtn}
          </button>
        }
      >
        <OptBlock label={TR[lang].quantity}>
          <SegControl
            options={[1, 5, 10, 25]}
            value={count}
            onChange={(v) => { setCount(v as Count); generate(v as Count); }}
          />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line">
        <div className="flex items-center gap-4 px-[14px] py-[10px] border-b border-line bg-bg text-[12px]">
          <span className="font-mono">
            <span className="text-dim">// </span>
            <span className="text-fg">UUID</span>
            <span className="text-dim">.txt</span>
          </span>
          <span className="font-mono text-[11px] text-dim">{uuids.length} ids</span>
          <div className="ml-auto">
            <button
              onClick={handleCopyAll}
              className="px-[9px] py-[3px] font-mono text-[11px] text-fg-1 border border-line rounded-[3px] bg-bg-1 hover:text-brand hover:border-brand-mid transition-colors"
            >
              {copied === "__all__" ? "✓ " : ""}{i.copyAll}
            </button>
          </div>
        </div>

        <div className="bg-bg-code divide-y divide-line">
          {uuids.map((uuid, idx) => (
            <div
              key={uuid}
              className="group flex items-center justify-between px-[18px] py-[11px] hover:bg-bg-2 transition-colors cursor-pointer"
              onClick={() => copy(uuid)}
            >
              <span className="font-mono text-[11px] text-dim-2 w-6 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
              <span className="font-mono text-[13px] text-fg tracking-[0.04em] flex-1 ml-4">{uuid}</span>
              <span className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                {i.copy}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span>RFC 4122 · v4 (random)</span>
          <span>{i.clickToCopy}</span>
        </div>
      </div>
    </section>
  );
}
