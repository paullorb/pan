import styles from './filter.module.css';

interface FilterProps {
  filter: string | null;
  totalCount: number;
  openCount: number;
}

export default function Filter({ filter, totalCount, openCount }: FilterProps) {
  return (
    <div className={styles.container}>
      {filter === null && <span className={styles.default}>All {totalCount}</span>}
      <button
        className={`${styles.button} ${filter === 'open' ? styles.active : ''}`}
      >
        {filter === 'open' ? `Open ${openCount}/${totalCount}` : `Open ${openCount}`}
      </button>
    </div>
  );
}
