import type { ChangeEvent } from "react";

import { Select } from "@/components/ui/select";

interface LocaleSelectorProps {
  locales: string[];
  value: string;
  onChange: (locale: string) => void;
}

export function LocaleSelector({ locales, onChange, value }: LocaleSelectorProps) {
  if (locales.length <= 1) return null;

  return (
    <Select
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      className="w-32"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>{loc.toUpperCase()}</option>
      ))}
    </Select>
  );
}
