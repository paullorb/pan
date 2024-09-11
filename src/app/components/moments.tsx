import styles from './moments.module.css';
import Moment from './moment';

export default function Moments() {
  return (
    <div className={styles.container}>
      <div className={styles.moment}>
        <div className={styles.titleC}>
          <h1 className={styles.title}>Morning</h1>
        </div>
        <div className={styles.inputC}>
          <Moment placeholder="🍞" />
        </div>
      </div>
      <div className={styles.moment}>
        <div className={styles.titleC}>
          <h1 className={styles.title}>Afternoon</h1>
        </div>
        <div className={styles.inputC}>
          <Moment placeholder="🍞" />
        </div>
      </div>
      <div className={styles.moment}>
        <div className={styles.titleC}>
          <h1 className={styles.title}>Evening</h1>
        </div>
        <div className={styles.inputC}>
          <Moment placeholder="🍞" />
        </div>
      </div>
    </div>
  );
}
