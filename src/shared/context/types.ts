import type { ReactNode } from "react";

export interface UIState {
  isLoading: boolean;
}

export interface UIContextValue extends UIState {
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

export interface UIProviderProps {
  children: ReactNode;
}
