import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

const Switch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label className={cn("relative inline-flex h-6 w-11 cursor-pointer items-center", className)}>
        <input type="checkbox" className="peer sr-only" ref={ref} {...props} />
        <span className="absolute inset-0 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-background transition-transform peer-checked:translate-x-5" />
      </label>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
