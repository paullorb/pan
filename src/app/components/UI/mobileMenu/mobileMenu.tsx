// MobileMenu.tsx
import React from 'react';
import styles from './mobileMenu.module.css';
import { useAuth } from '../../../context/authContext';
import Language from '../language/language';
import DarkMode from '../darkMode/darkMode';

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const { isAuthenticated, userEmail, logout } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.menuItem} onClick={onClose}>
      </div>
      <button
        className={styles.menuButton}
        onClick={() => {
          window.print();
          onClose();
        }}
      >
        🖨️
      </button>
      {isAuthenticated ? (
        <>
          <div className={styles.menuItem}>{userEmail}</div>
          <div className={styles.menuItem}>
            <DarkMode />
          </div>
          <div className={styles.menuItem}>
            <Language />
          </div>
          <button
            className={styles.logoutButton}
            onClick={() => {
              logout();
              onClose();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <button
          className={styles.menuButton}
          onClick={() => {
            onClose();
          }}
        >
          🔑
        </button>
      )}
    </div>
  );
};

export default MobileMenu;
