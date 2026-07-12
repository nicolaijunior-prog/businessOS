"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useViewMode, type ViewMode } from "@/components/content/ViewModeProvider";

const VIEW_MODE_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "grid", label: "Grade" },
  { value: "list", label: "Lista" },
];

/**
 * Select (dropdown de verdade, não segmented control — decisão explícita do
 * produto) conectado a useViewMode(). Só é renderizado pelas páginas com
 * campo em lista.
 */
export function ViewToggle() {
  const { mode, setMode } = useViewMode();

  return (
    <Select
      value={mode}
      onValueChange={(value) => {
        if (value === "grid" || value === "list") {
          setMode(value);
        }
      }}
    >
      <SelectTrigger aria-label="Modo de exibição">
        <SelectValue placeholder="Modo de exibição" />
      </SelectTrigger>
      <SelectContent>
        {VIEW_MODE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
