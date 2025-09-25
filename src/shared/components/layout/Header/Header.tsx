import { Link } from "react-router";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1 className={styles.title}>Podcaster</h1>
        </Link>
      </div>
    </header>
  );
}
