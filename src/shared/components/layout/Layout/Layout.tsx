import { Outlet } from "react-router";
import { Header } from "@/shared/components/layout/Header/Header";
import styles from "@/shared/components/layout/Layout/Layout.module.css";

export function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
