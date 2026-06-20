"use client";

import { useState, useMemo } from "react";

export function useBidirectionalConverter(
  encode: (s: string) => string,
  decode: (s: string) => string,
  initialInput: string,
) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState(initialInput);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };
    try {
      const out = mode === "encode" ? encode(input) : decode(input);
      return { output: out, error: null };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, mode, encode, decode]);

  const swap = () => {
    if (!output) return;
    setInput(output);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  };

  return { mode, setMode, input, setInput, output, error, swap };
}
