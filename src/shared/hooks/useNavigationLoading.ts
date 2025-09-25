import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useUI } from "@/shared/context/UIContext";

export function useNavigationLoading() {
  const location = useLocation();
  const { setLoading } = useUI();
  const prevPathnameRef = useRef(location.pathname);
  const timeoutRef = useRef<number | null>(null);

  const stopLoadingStable = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  const startLoadingStable = useCallback(() => {
    setLoading(true);
  }, [setLoading]);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only trigger loading if pathname actually changed
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;

      startLoadingStable();

      // Stop loading after navigation completes
      timeoutRef.current = setTimeout(() => {
        stopLoadingStable();
        timeoutRef.current = null;
      }, 300);
    }

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [location.pathname, startLoadingStable, stopLoadingStable]);

  // Ensure spinner stops on component unmount
  useEffect(() => {
    return () => {
      stopLoadingStable();
    };
  }, [stopLoadingStable]);
}
