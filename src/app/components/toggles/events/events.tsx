import styles from './events.module.css';

export default function Events () {
  return (
    <div className={styles.container}>
      <div className={styles.event}>Event 1</div>
      <div className={styles.event}>Event 2</div>
      <div className={styles.event}>Event 3</div>
    </div>
  );
}