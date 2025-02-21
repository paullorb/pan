import styles from './filter.module.css';

interface FilterProps {
  filter: string | null;
  onFilterChange: (value: string | null) => void;
  totalCount: number;
  openCount: number;
}

export default function Filter({ filter, onFilterChange, totalCount, openCount }: FilterProps) {
  return (
    <div className={styles.container}>
      {filter === null && <span className={styles.default}>All ({totalCount})</span>}
      <button
        className={`${styles.button} ${filter === 'open' ? styles.active : ''}`}
        onClick={() => onFilterChange(filter === 'open' ? null : 'open')}
      >
        {filter === 'open' ? `Open (${openCount}/${totalCount})` : `Open (${openCount})`}
      </button>
    </div>
  );
}
