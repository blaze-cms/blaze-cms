import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { useEffect, useRef } from "react";

const LANG_MAP: Record<string, () => import("@codemirror/language").LanguageSupport> = {
  css: () => css(),
  html: () => html(),
  javascript: () => javascript(),
  js: () => javascript(),
  json: () => json(),
  jsx: () => javascript({ jsx: true }),
  markdown: () => markdown(),
  md: () => markdown(),
  svg: () => xml(),
  ts: () => javascript({ typescript: true }),
  tsx: () => javascript({ jsx: true, typescript: true }),
  xml: () => xml(),
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({ language, onChange, value }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const lang = language ? (LANG_MAP[language.toLowerCase()]?.() ?? null) : null;

    const state = EditorState.create({
      doc: value ?? "",
      extensions: [
        basicSetup,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        lang ?? [],
        EditorView.theme({
          ".cm-content": { padding: "8px 12px" },
          ".cm-gutters": { display: "none" },
          ".cm-scroller": {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "13px",
          },
          "&": { height: "auto", minHeight: "150px" },
        }),
      ],
    });

    viewRef.current = new EditorView({
      parent: editorRef.current,
      state,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  return <div ref={editorRef} className="overflow-hidden rounded-md border border-input" />;
}
