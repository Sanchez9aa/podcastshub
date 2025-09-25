import type { SearchFilterProps } from "@/features/podcast-list/types";
import styles from "./SearchFilter.module.css";

export function SearchFilter({
  value,
  onChange,
  placeholder = "Filter podcasts...",
}: SearchFilterProps) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}
