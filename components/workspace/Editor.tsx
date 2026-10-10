"use client";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

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
    color: "var(--dim)",
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
}, { dark: true });

// Couleurs de syntaxe JSON, mêmes tokens que le reste du site. Sans cette
// déclaration, CodeMirror retombe sur son style par défaut, prévu pour un fond
// clair (vert et rouge foncés, illisibles ici).
const utilisioHighlight = syntaxHighlighting(HighlightStyle.define([
  { tag: tags.propertyName, color: "var(--syntax-key)" },
  { tag: tags.string, color: "var(--syntax-string)" },
  { tag: tags.number, color: "var(--syntax-number)" },
  { tag: [tags.bool, tags.null], color: "var(--syntax-bool)" },
  { tag: [tags.punctuation, tags.separator, tags.squareBracket, tags.brace], color: "var(--dim)" },
  { tag: tags.invalid, color: "var(--danger)" },
]));

interface EditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  /** Nom accessible de la zone d'édition (CodeMirror n'en donne pas). */
  ariaLabel: string;
}

export function Editor({ value, onChange, readOnly = false, minHeight = "380px", ariaLabel }: EditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      extensions={[json(), utilisioTheme, utilisioHighlight, EditorView.contentAttributes.of({ "aria-label": ariaLabel })]}
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
