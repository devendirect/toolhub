export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="4" y="4" width="56" height="56" rx="9" stroke="currentColor" strokeWidth="3.5" />
      <line x1="32" y1="7" x2="32" y2="57" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="7" y1="32" x2="57" y2="32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

      {/* doc */}
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 13 L20 13 L23 16 L23 26 L14 26 Z" fill="none" />
        <line x1="16" y1="20" x2="21" y2="20" />
        <line x1="16" y1="23" x2="21" y2="23" />
      </g>

      {/* { } */}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M43 13 C40.5 13 40 14.5 40 17 C40 19 39 19.5 38 19.5 C39 19.5 40 20 40 22 C40 24.5 40.5 26 43 26" />
        <path d="M50 13 C52.5 13 53 14.5 53 17 C53 19 54 19.5 55 19.5 C54 19.5 53 20 53 22 C53 24.5 52.5 26 50 26" />
      </g>

      {/* A */}
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M13 51 L18.5 38 L24 51" />
        <line x1="15.3" y1="46" x2="21.7" y2="46" />
      </g>

      {/* image */}
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="38" y="38" width="16" height="13" rx="1.5" />
        <circle cx="42.5" cy="42.5" r="1.4" fill="currentColor" stroke="none" />
        <path d="M38.5 50 L44 44 L48 48 L50.5 45.5 L53.5 50" />
      </g>
    </svg>
  );
}
