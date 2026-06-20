import { useState } from "react";

export function useConversionState<S extends string>(initial: S) {
  const [status, setStatus] = useState<S>(initial);
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const fail = (e: unknown) => {
    setError(e instanceof Error ? e.message : String(e));
    setStatus("error" as S);
  };

  const succeed = (url: string, size: number) => {
    setOutputUrl(url);
    setOutputSize(size);
    setStatus("done" as S);
  };

  const reset = () => {
    setStatus(initial);
    setError(null);
    setOutputUrl(null);
    setOutputSize(0);
  };

  return { status, setStatus, error, outputUrl, outputSize, fail, succeed, reset };
}
