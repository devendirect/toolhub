interface FaqItem {
  q: string;
  a: string;
}

interface FaqListProps {
  items: FaqItem[];
  headingAs?: "h2" | "h3";
}

export function FaqList({ items, headingAs: Heading = "h2" }: FaqListProps) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col divide-y divide-line border border-line">
      {items.map((item, i) => (
        <details key={i} className="group px-5 py-4">
          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-mono text-[13px] text-fg font-medium select-none">
            <Heading className="text-[13px] font-medium">
              <span className="text-brand mr-2">{">"}</span>
              {item.q}
            </Heading>
            <span className="text-dim text-[16px] transition-transform duration-150 group-open:rotate-45 shrink-0">+</span>
          </summary>
          <p className="mt-3 text-[13px] text-fg-1 leading-relaxed pl-5">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
