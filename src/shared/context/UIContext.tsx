import { createContext, useContext, useState } from "react";
import type { UIContextValue, UIProviderProps } from "./types";

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: UIProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const value = {
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
