import { Cursor } from "./Cursor";

interface PromptBarProps {
  text: string;
  showCursor?: boolean;
  className?: string;
}

export function PromptBar({ text, showCursor = true, className = "" }: PromptBarProps) {
  return (
    <div className={`inline-flex items-baseline gap-2 font-mono text-[13px] text-fg-1 ${className}`}>
      <span className="text-brand">$</span>
      <span>{text}</span>
      {showCursor && <Cursor />}
    </div>
  );
}
