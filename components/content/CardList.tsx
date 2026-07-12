import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardListProps {
  children: ReactNode;
  className?: string;
}

/** Wrapper de layout em lista empilhada. Não sabe nada sobre o conteúdo dos cards. */
export function CardList({ children, className }: CardListProps) {
  return <div className={cn("flex flex-col gap-3", className)}>{children}</div>;
}
