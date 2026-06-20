"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useLang } from "@/components/providers/I18nProvider";

interface DropBaseProps {
  inputRef:  RefObject<HTMLInputElement | null>;
  onDrop:    (files: FileList) => void;
  accept?:   string;
  multiple?: boolean;
  className: string;
  children:  ReactNode;
}

function DropBase({ inputRef, onDrop, accept, multiple, className, children }: DropBaseProps) {
  return (
    <div
      className={className}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) onDrop(e.dataTransfer.files);
      }}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) onDrop(e.target.files); }}
      />
    </div>
  );
}

interface DropZoneProps {
  onFile:    (file: File) => void;
  accept?:   string;
  glyph?:    string;
  label:     string;
  sublabel?: string;
  current?:  string | null;
  className?: string;
}

export function DropZone({ onFile, accept, glyph = "▣", label, sublabel, current, className = "" }: DropZoneProps) {
  const ref = useRef<HTMLInputElement>(null);
  const { lang } = useLang();
  return (
    <DropBase
      inputRef={ref}
      onDrop={(files) => { const f = files[0]; if (f) onFile(f); }}
      accept={accept}
      className={`border border-line border-dashed flex flex-col items-center justify-center gap-3 py-14 cursor-pointer hover:bg-bg-1 transition-colors ${className}`}
    >
      <span className="font-mono text-[28px] text-dim">{glyph}</span>
      <span className="font-mono text-[12px] text-dim text-center px-4">{current ?? label}</span>
      {sublabel && !current && <span className="font-mono text-[11px] text-dim-2">{sublabel}</span>}
      {current && <span className="font-mono text-[11px] text-dim-2">{lang === "fr" ? "cliquer pour changer" : "click to change"}</span>}
    </DropBase>
  );
}

interface DropZoneMultiProps {
  onFiles:   (files: File[]) => void;
  accept?:   string;
  glyph?:    string;
  label:     string;
  sublabel?: string;
  className?: string;
}

export function DropZoneMulti({ onFiles, accept, glyph = "≡+≡", label, sublabel, className = "" }: DropZoneMultiProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <DropBase
      inputRef={ref}
      onDrop={(files) => onFiles(Array.from(files))}
      accept={accept}
      multiple
      className={`flex flex-col items-center justify-center gap-3 p-6 border-b border-dashed border-line cursor-pointer hover:bg-bg-2 transition-colors ${className}`}
    >
      <span className="font-mono text-[24px] text-dim">{glyph}</span>
      <span className="font-mono text-[12px] text-dim text-center">{label}</span>
      {sublabel && <span className="font-mono text-[11px] text-dim-2">{sublabel}</span>}
    </DropBase>
  );
}
