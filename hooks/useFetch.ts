"use client";

import { useState } from "react";

export function useFetch<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const run = async (url: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? res.statusText ?? "request failed");
      setData(json as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, run };
}
