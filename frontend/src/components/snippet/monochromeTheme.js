import { EditorView } from '@uiw/react-codemirror';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

export const monochromeTheme = EditorView.theme({
  "&": {
    color: "var(--foreground)",
    backgroundColor: "var(--card)",
  },
  ".cm-content": {
    caretColor: "var(--foreground)",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "var(--foreground)"
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "var(--accent)"
  },
  ".cm-gutters": {
    backgroundColor: "var(--muted)",
    color: "var(--muted-foreground)",
    border: "none"
  }
}, { dark: true });

export const monochromeHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "var(--foreground)", fontWeight: "bold" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "var(--foreground)" },
  { tag: [t.function(t.variableName), t.labelName], color: "var(--foreground)", fontStyle: "italic" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "var(--foreground)" },
  { tag: [t.definition(t.name), t.separator], color: "var(--foreground)" },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: "var(--foreground)" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: "var(--muted-foreground)" },
  { tag: [t.meta, t.comment], color: "var(--muted-foreground)", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "var(--muted-foreground)", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "var(--foreground)" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "var(--foreground)" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "var(--muted-foreground)" },
  { tag: t.invalid, color: "var(--destructive)" },
]);

export const monochromeSetup = [monochromeTheme, syntaxHighlighting(monochromeHighlightStyle)];
