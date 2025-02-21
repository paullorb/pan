import styles from './filter.module.css';

export default function Filter () {
  return (
    <div className={styles.container}>
    <button className={styles.button}>All</button>
    <button className={styles.button}>Open</button>
    </div>
  )
}