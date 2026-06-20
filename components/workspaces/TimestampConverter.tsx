"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { CopyableRow } from "@/components/workspace/CopyableRow";

const TR = {
  fr: {
    invalidTs:     "timestamp invalide",
    localTimezone: "fuseau horaire local",
  },
  en: {
    invalidTs:     "invalid timestamp",
    localTimezone: "local timezone",
  },
} as const;

function nowTs() { return Math.floor(Date.now() / 1000); }

function toIso(ts: number) { return new Date(ts * 1000).toISOString(); }
function toLocal(ts: number) { return new Date(ts * 1000).toLocaleString(); }
function toUtc(ts: number) { return new Date(ts * 1000).toUTCString(); }
function toRfc(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-CA");
}

export function TimestampConverter() {
  const { lang } = useLang();
  const i = t(lang);
  const [ts, setTs] = useState(String(nowTs()));
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16));
  const { copy, copied } = useCopy();

  const parsed = parseInt(ts, 10);
  const isValid = !isNaN(parsed) && parsed > 0;

  const fromDate = () => {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) setTs(String(Math.floor(d.getTime() / 1000)));
  };

  const rows = isValid
    ? [
        { label: "Unix (s)",   value: String(parsed) },
        { label: "Unix (ms)",  value: String(parsed * 1000) },
        { label: "ISO 8601",   value: toIso(parsed) },
        { label: "UTC",        value: toUtc(parsed) },
        { label: "Local",      value: toLocal(parsed) },
        { label: "Date",       value: toRfc(parsed) },
      ]
    : [];

  return (
    <section className="mb-10">
      <div className="border border-line border-b-0">
        <div className="flex items-center gap-0">
          <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">Unix →</span>
          <input
            value={ts}
            onChange={(e) => setTs(e.target.value)}
            placeholder="1700000000"
            className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
          />
          <button
            onClick={() => setTs(String(nowTs()))}
            className="px-[14px] py-[11px] font-mono text-[11px] text-dim hover:text-brand border-l border-line transition-colors shrink-0"
          >
            now
          </button>
        </div>
      </div>

      <div className="border border-line divide-y divide-line mb-4">
        {isValid ? rows.map(({ label, value }) => (
          <CopyableRow
            key={label}
            id={label}
            label={label}
            value={value}
            copied={copied}
            onClick={() => copy(value, label)}
            lang={lang}
            labelClass="w-24"
          />
        )) : (
          <div className="px-[14px] py-[14px]">
            <span className="font-mono text-[12px] text-dim-2">
              {TR[lang].invalidTs}
            </span>
          </div>
        )}
      </div>

      <div className="border border-line">
        <div className="flex items-center gap-0 border-b border-line">
          <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">
            date →
          </span>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none"
          />
          <button
            onClick={fromDate}
            className="px-[18px] py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold shrink-0 hover:brightness-110 transition-all border-l border-brand"
          >
            {i.convertBtn}
          </button>
        </div>
        <div className="px-[14px] py-2 bg-bg font-mono text-[11px] text-dim">
          {TR[lang].localTimezone}
        </div>
      </div>
    </section>
  );
}
