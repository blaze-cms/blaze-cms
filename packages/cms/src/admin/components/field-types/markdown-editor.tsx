import { Eye, Pencil } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ onChange, value }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="overflow-hidden rounded-md border border-input">
      <div className="flex items-center gap-0.5 border-b border-input bg-muted/50 px-2 py-1.5">
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 gap-1 text-xs ${tab === "edit" ? "bg-accent" : ""}`}
          onClick={() => setTab("edit")}
        >
          <Pencil className="h-3 w-3" /> Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 gap-1 text-xs ${tab === "preview" ? "bg-accent" : ""}`}
          onClick={() => setTab("preview")}
        >
          <Eye className="h-3 w-3" /> Preview
        </Button>
      </div>

      {tab === "edit" ? (
        <textarea
          className="flex min-h-[250px] w-full resize-y bg-background px-3 py-2 font-mono text-sm focus:outline-none"
          value={value ?? ""}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
          placeholder="Write markdown..."
        />
      ) : (
        <div className="prose prose-sm dark:prose-invert min-h-[250px] overflow-auto px-3 py-2">
          <Markdown remarkPlugins={[remarkGfm]}>{value || "*Nothing to preview*"}</Markdown>
        </div>
      )}
    </div>
  );
}
