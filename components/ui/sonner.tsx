"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="dark"
    position="bottom-right"
    toastOptions={{
      style: {
        background:   "var(--bg-1)",
        border:       "1px solid var(--line)",
        color:        "var(--fg)",
        fontFamily:   "var(--font-mono)",
        fontSize:     "12px",
        borderRadius: "0",
      },
    }}
    {...props}
  />
);

export { Toaster };
