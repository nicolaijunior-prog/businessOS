import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ViewModeProvider } from "@/components/content/ViewModeProvider";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ViewModeProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col">{children}</div>
        </main>
      </div>
    </ViewModeProvider>
  );
}
