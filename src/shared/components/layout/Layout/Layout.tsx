import { useEffect } from "react";
import { Outlet } from "react-router";
import { Header } from "@/shared/components/layout/Header/Header";
import { Spinner } from "@/shared/components/ui/Spinner/Spinner";
import { useUI } from "@/shared/context/UIContext";
import { useNavigationLoading } from "@/shared/hooks/useNavigationLoading";
import styles from "./Layout.module.css";

export function Layout() {
  const { isLoading, stopLoading } = useUI();

  // Hook to trigger loading on navigation
  useNavigationLoading();

  // Stop loading when any route component mounts
  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

  return (
    <div className={styles.layout}>
      <Header />
      {isLoading && <Spinner />}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
