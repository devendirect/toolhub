"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: { modified: "modifié" },
  en: { modified: "modified" },
} as const;

type DiffLine = { type: "equal" | "added" | "removed"; value: string };

function computeDiff(a: string[], b: string[]): DiffLine[] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0) as number[]);
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i]![j] = a[i - 1] === b[j - 1] ? (dp[i - 1]![j - 1] ?? 0) + 1 : Math.max(dp[i - 1]![j] ?? 0, dp[i]![j - 1] ?? 0);

  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: "equal", value: a[i - 1] ?? "" });
      i--; j--;
    } else if (j > 0 && (i === 0 || (dp[i]![j - 1] ?? 0) >= (dp[i - 1]![j] ?? 0))) {
      result.unshift({ type: "added", value: b[j - 1] ?? "" });
      j--;
    } else {
      result.unshift({ type: "removed", value: a[i - 1] ?? "" });
      i--;
    }
  }
  return result;
}

const SAMPLE_A = `const greet = (name) => {
  console.log("Hello, " + name);
  return true;
};`;

const SAMPLE_B = `const greet = (name, title = "") => {
  const msg = title ? \`\${title} \${name}\` : name;
  console.log("Hello, " + msg);
};`;

export function DiffViewer() {
  const { lang } = useLang();
  const [textA, setTextA] = useState(SAMPLE_A);
  const [textB, setTextB] = useState(SAMPLE_B);
  const trackRun = useTrackRun("diff-viewer", "dev");
  const tracked = useRef(false);

  const diff = useMemo(() => {
    const linesA = textA.split(/\r?\n/);
    const linesB = textB.split(/\r?\n/);
    return computeDiff(linesA, linesB);
  }, [textA, textB]);

  const stats = useMemo(() => ({
    added:   diff.filter((l) => l.type === "added").length,
    removed: diff.filter((l) => l.type === "removed").length,
  }), [diff]);

  useEffect(() => {
    if (!tracked.current && (stats.added + stats.removed) > 0) { tracked.current = true; trackRun(); }
  }, [stats, trackRun]);

  const LINE_CLASS: Record<DiffLine["type"], string> = {
    equal:   "text-fg-1",
    added:   "bg-ok/10 text-ok",
    removed: "bg-danger/10 text-danger line-through",
  };
  const LINE_PREFIX: Record<DiffLine["type"], string> = {
    equal: "  ", added: "+ ", removed: "- ",
  };

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 border border-line border-b-0">
        {[
          { id: "a", label: "original",              value: textA, onChange: setTextA },
          { id: "b", label: TR[lang].modified,       value: textB, onChange: setTextB },
        ].map(({ id, label, value, onChange }, idx) => (
          <div key={id} className={idx === 0 ? "border-r border-line" : ""}>
            <div className="flex items-center gap-2 px-[14px] py-[9px] border-b border-line bg-bg">
              <span className="font-mono text-[11px] text-dim">// {label}</span>
            </div>
            <div className="p-[14px] bg-bg-code">
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-h-[200px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none"
                spellCheck={false}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border border-line">
        <div className="flex items-center gap-4 px-[14px] py-[9px] border-b border-line bg-bg">
          <span className="font-mono text-[11px] text-dim">// diff</span>
          <span className="font-mono text-[11px] text-ok">+{stats.added}</span>
          <span className="font-mono text-[11px] text-danger">-{stats.removed}</span>
        </div>
        <div className="bg-bg-code px-[14px] py-[12px] overflow-auto max-h-[400px]">
          {diff.map((line, i) => (
            <div key={`${i}:${line.type}`} className={`font-mono text-[12.5px] leading-[1.65] px-2 rounded-[2px] ${LINE_CLASS[line.type]}`}>
              <span className="select-none opacity-50 mr-2">{LINE_PREFIX[line.type]}</span>
              <span>{line.value || " "}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
