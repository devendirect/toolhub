"use client";

import { useRef } from "react";
import { useLang } from "@/components/providers/I18nProvider";

interface DropZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  glyph?: string;
  label: string;
  sublabel?: string;
  current?: string | null;
  className?: string;
}

interface DropZoneMultiProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  glyph?: string;
  label: string;
  sublabel?: string;
  className?: string;
}

export function DropZone({ onFile, accept, glyph = "▣", label, sublabel, current, className = "" }: DropZoneProps) {
  const ref = useRef<HTMLInputElement>(null);
  const { lang } = useLang();

  return (
    <div
      className={`border border-line border-dashed flex flex-col items-center justify-center gap-3 py-14 cursor-pointer hover:bg-bg-1 transition-colors ${className}`}
      onClick={() => ref.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
    >
      <span className="font-mono text-[28px] text-dim">{glyph}</span>
      <span className="font-mono text-[12px] text-dim text-center px-4">{current ?? label}</span>
      {sublabel && !current && (
        <span className="font-mono text-[11px] text-dim-2">{sublabel}</span>
      )}
      {current && (
        <span className="font-mono text-[11px] text-dim-2">
          {lang === "fr" ? "cliquer pour changer" : "click to change"}
        </span>
      )}
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </div>
  );
}

export function DropZoneMulti({ onFiles, accept, glyph = "≡+≡", label, sublabel, className = "" }: DropZoneMultiProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 p-6 border-b border-dashed border-line cursor-pointer hover:bg-bg-2 transition-colors ${className}`}
      onClick={() => ref.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files));
      }}
    >
      <span className="font-mono text-[24px] text-dim">{glyph}</span>
      <span className="font-mono text-[12px] text-dim text-center">{label}</span>
      {sublabel && <span className="font-mono text-[11px] text-dim-2">{sublabel}</span>}
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) onFiles(Array.from(e.target.files)); }}
      />
    </div>
  );
}
