import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../../context/authContext';
import DarkMode from '../darkMode/darkMode';
import Language from '../language/language';
import styles from './hamburger.module.css';
import useOnClickOutside from '../../../lib/hooks/useOnClickOutside';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userEmail, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => setIsOpen(prev => !prev), []);

  const handleLogout = useCallback(() => {
    logout();
    setIsOpen(false);
  }, [logout]);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className={`${styles.dropdownContainer} ${styles.desktopOnly}`} ref={dropdownRef}>
      <button className={styles.button} onClick={toggleDropdown} aria-label="User menu">
        👤
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={`${styles.dropdownItem} ${styles.email}`}>{userEmail}</div>
          <div className={styles.dropdownItem}>
            <DarkMode />
          </div>
          <div className={`${styles.dropdownItem} ${styles.internationalization}`}>
            <Language />
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;