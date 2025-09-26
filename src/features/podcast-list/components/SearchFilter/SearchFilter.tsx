import { useId } from "react";
import styles from "@/features/podcast-list/components/SearchFilter/SearchFilter.module.css";
import type { SearchFilterProps } from "@/features/podcast-list/types";

export function SearchFilter({
  value,
  onChange,
  placeholder = "Filter podcasts...",
}: SearchFilterProps) {
  const inputId = useId();

  return (
    <div className={styles.container}>
      <label htmlFor={inputId} className={styles.visuallyHidden}>
        Search podcasts by title or author
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        aria-label="Search podcasts by title or author"
        autoComplete="off"
      />
    </div>
  );
}
