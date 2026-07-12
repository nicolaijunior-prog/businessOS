import type { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ContentCardProps {
  /** Título opcional do card (ex.: "Objetivo", ou o título de um item de lista). */
  title?: ReactNode;
  /** Elemento(s) de ação no canto superior direito do card (ex.: botão remover, Badge). */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Card shadcn minimalista, único wrapper de components/ui/card.tsx usado pelo
 * projeto para conteúdo. Não decide layout externo (grid vs. lista) — isso é
 * responsabilidade de CardGrid/CardList, que apenas posicionam múltiplos
 * ContentCard lado a lado ou empilhados.
 */
export function ContentCard({ title, actions, children, className }: ContentCardProps) {
  const hasHeader = Boolean(title || actions);

  return (
    <Card className={cn(className)}>
      {hasHeader && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {actions && <CardAction>{actions}</CardAction>}
        </CardHeader>
      )}
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}
