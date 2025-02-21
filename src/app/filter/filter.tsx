import styles from './filter.module.css';

interface FilterProps {
  filter: string | null;
  onFilterChange: (value: string | null) => void;
}

export default function Filter({ filter, onFilterChange }: FilterProps) {
  return (
    <div className={styles.container}>
      {filter === null && <span className={styles.default}>All</span>}
      <button
        className={`${styles.button} ${filter === 'open' ? styles.active : ''}`}
        onClick={() => onFilterChange(filter === 'open' ? null : 'open')}
      >
        Open
      </button>
    </div>
  );
}
