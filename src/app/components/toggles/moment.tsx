import styles from './moment.module.css';
import SMART from './smart';

interface MomentProps {
  placeholder: string;
}

const Moment = ({ placeholder }: MomentProps) => {
  return (
    <div className={styles.pan}>
      <input type="checkbox" className={styles.checkbox} />
      <input type="text" placeholder={placeholder} className={styles.input} />
      <div className={styles.smartC}>
      <SMART />
      </div>
    </div>
  );
}

export default Moment;
