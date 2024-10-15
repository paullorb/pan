import { memo } from 'react';
import { useAuth } from '../../../context/authContext';
import Status from '../status/status';
import Toggles from '../toggles/toggles';
import UserDropdown from './userDropdown';
import styles from './hamburger.module.css';

interface DesktopMenuProps {
  isAuthenticated: boolean;
  onAuthClick: () => void;
}

const DesktopMenu: React.FC<DesktopMenuProps> = memo(({ isAuthenticated, onAuthClick }) => {
  const handlePrint = () => window.print();

  return (
    <>
      <div className={`${styles.indicators} ${styles.desktopOnly}`}>
        <Status />
      </div>
      <Toggles />
      <button className={styles.button} onClick={handlePrint} aria-label="Print">
        🖨️
      </button>
      {isAuthenticated ? (
        <UserDropdown />
      ) : (
        <button
          className={`${styles.button} ${styles.desktopOnly}`}
          onClick={onAuthClick}
          aria-label="Login"
        >
          🔑
        </button>
      )}
    </>
  );
});

DesktopMenu.displayName = 'DesktopMenu';

export default DesktopMenu;