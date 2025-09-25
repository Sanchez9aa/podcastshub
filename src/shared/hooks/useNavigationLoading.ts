import { useEffect } from "react";
import { useUI } from "@/shared/context/UIContext";

export function useNavigationLoading() {
  const { startLoading } = useUI();

  useEffect(() => {
    // Start loading on every location change
    startLoading();
  }, [startLoading]);
}
