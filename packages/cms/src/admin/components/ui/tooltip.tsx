import { cn } from "@/lib/utils";
import { type ReactNode, useState } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            "absolute z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
            "bottom-full left-1/2 -translate-x-1/2 mb-2",
            "animate-in fade-in zoom-in-95",
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export { Tooltip };
