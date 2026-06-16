"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0a0a0a", color: "#e5e5e5", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "#ef4444", marginBottom: 16 }}>FATAL</div>
          <p style={{ color: "#737373", marginBottom: 24 }}>An unrecoverable error occurred.</p>
          <button
            onClick={reset}
            style={{ padding: "8px 20px", background: "#22c55e", color: "#000", fontFamily: "monospace", fontSize: 12, border: "none", borderRadius: 3, cursor: "pointer" }}
          >
            reload ↺
          </button>
        </div>
      </body>
    </html>
  );
}
