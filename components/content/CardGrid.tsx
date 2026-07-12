import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardGridProps {
  children: ReactNode;
  className?: string;
}

/** Wrapper de layout em grade responsiva. Não sabe nada sobre o conteúdo dos cards. */
export function CardGrid({ children, className }: CardGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {children}
    </div>
  );
}
