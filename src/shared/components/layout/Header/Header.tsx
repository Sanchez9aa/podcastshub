import { Link } from "react-router";
import styles from "@/shared/components/layout/Header/Header.module.css";
import { Spinner } from "@/shared/components/ui/Spinner/Spinner";
import { useUI } from "@/shared/context/UIContext";
import { useNavigationLoading } from "@/shared/hooks/useNavigationLoading";

export function Header() {
  const { isLoading } = useUI();

  useNavigationLoading();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          to="/"
          className={styles.logo}
          aria-label="Podcaster - Go to home page"
        >
          <h1 className={styles.title}>Podcaster</h1>
        </Link>
        {isLoading && (
          <div className={styles.spinner} aria-live="polite">
            <Spinner size="small" />
            <span className={styles.visuallyHidden}>Loading content...</span>
          </div>
        )}
      </div>
    </header>
  );
}
