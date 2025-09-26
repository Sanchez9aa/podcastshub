import styles from "@/features/podcast-list/components/SearchFilter/SearchFilter.module.css";
import type { SearchFilterProps } from "@/features/podcast-list/types";

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
