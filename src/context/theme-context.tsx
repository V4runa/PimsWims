"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  applyStyle,
  DEFAULT_STYLE,
  loadStyle,
  saveStyle,
  type StyleState,
} from "@/lib/theme";

interface ThemeContextValue {
  style: StyleState;
  ready: boolean;
  set: <K extends keyof StyleState>(key: K, value: StyleState[K]) => void;
  reset: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useState<StyleState>(DEFAULT_STYLE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = loadStyle();
    setStyle(loaded);
    applyStyle(loaded);
    setReady(true);
  }, []);

  function set<K extends keyof StyleState>(key: K, value: StyleState[K]) {
    setStyle((prev) => {
      const next = { ...prev, [key]: value };
      applyStyle(next);
      saveStyle(next);
      return next;
    });
  }

  function reset() {
    setStyle(DEFAULT_STYLE);
    applyStyle(DEFAULT_STYLE);
    saveStyle(DEFAULT_STYLE);
  }

  return (
    <ThemeContext.Provider value={{ style, ready, set, reset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
