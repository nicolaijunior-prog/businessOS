"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export type ViewMode = "grid" | "list";

const STORAGE_KEY = "businessos:view-mode";
const DEFAULT_MODE: ViewMode = "grid";
/** Evento síntetico para notificar todos os hooks assinantes na mesma aba. */
const CHANGE_EVENT = "businessos:view-mode-change";

function isViewMode(value: unknown): value is ViewMode {
  return value === "grid" || value === "list";
}

function getSnapshot(): ViewMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isViewMode(stored) ? stored : DEFAULT_MODE;
  } catch {
    // localStorage indisponível (ex.: modo privado) — usa o default em memória.
    return DEFAULT_MODE;
  }
}

/** Snapshot usado durante SSR/hidratação — sempre o default, para nunca divergir do HTML do servidor. */
function getServerSnapshot(): ViewMode {
  return DEFAULT_MODE;
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function persistMode(next: ViewMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Falha ao persistir não deve quebrar a troca de modo — apenas não sobrevive ao reload.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

interface ViewModeContextValue {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export interface ViewModeProviderProps {
  children: ReactNode;
}

/**
 * Preferência GLOBAL de exibição (grid vs. lista), persistida em localStorage.
 * Envolve toda a árvore em AppShell (RF4.2 do PRD) — não é reinicializada por
 * página. Usa useSyncExternalStore (em vez de useState+useEffect) para
 * sincronizar com localStorage sem risco de mismatch de hidratação.
 */
export function ViewModeProvider({ children }: ViewModeProviderProps) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <ViewModeContext.Provider value={{ mode, setMode: persistMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode(): ViewModeContextValue {
  const ctx = useContext(ViewModeContext);
  if (!ctx) {
    throw new Error("useViewMode() deve ser usado dentro de um <ViewModeProvider>.");
  }
  return ctx;
}
