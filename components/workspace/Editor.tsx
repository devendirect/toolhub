"use client";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";

const utilisioTheme = EditorView.theme({
  "&": {
    background: "var(--bg-code)",
    color: "var(--fg)",
    fontFamily: "var(--font-mono)",
    fontSize: "12.5px",
    height: "100%",
  },
  ".cm-scroller": { background: "var(--bg-code)", overflowY: "auto" },
  ".cm-content": { padding: "14px 16px", caretColor: "var(--brand)" },
  ".cm-focused": { outline: "none" },
  ".cm-gutters": {
    background: "var(--bg-code)",
    borderRight: "1px solid var(--line)",
    color: "var(--dim-2)",
    minWidth: "44px",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingRight: "10px",
    fontSize: "11px",
    lineHeight: "1.65",
  },
  ".cm-activeLine": { background: "rgba(255,255,255,0.02)" },
  ".cm-activeLineGutter": { background: "rgba(255,255,255,0.02)" },
  ".cm-selectionBackground, ::selection": { background: "var(--brand-soft) !important" },
  ".cm-cursor": { borderLeftColor: "var(--brand)" },
  // JSON token colors
  ".tok-propertyName": { color: "#7cc3ff" },
  ".tok-string": { color: "var(--brand)" },
  ".tok-number": { color: "var(--hot)" },
  ".tok-bool": { color: "#c084fc" },
  ".tok-null": { color: "#c084fc" },
  ".tok-punctuation": { color: "var(--dim)" },
}, { dark: true });

interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
}

export function Editor({ value, onChange, readOnly = false, minHeight = "380px" }: EditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      extensions={[json(), utilisioTheme]}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
      }}
      style={{ minHeight, flex: 1, display: "flex", flexDirection: "column" }}
    />
  );
}
