"use client";

import { useState, useEffect, useRef } from 'react';
import AuthModal from '../auth/auth';
import styles from './hamburger.module.css';
import { useAuth } from '../../../context/authContext';
import Status from './status';
import Toggles from './toggles';
import Language from './language';
import DarkMode from '../darkMode/darkMode';

const Hamburger: React.FC = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.indicators}>
        <Status />
      </div>
      <Toggles />
      <button className={styles.button} onClick={handlePrint}>
        🖨️
      </button>

      {isAuthenticated ? (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button className={styles.button} onClick={toggleDropdown}>
            👤
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={`${styles.dropdownItem} ${styles.email}`}>
                {userEmail}
              </div>
              <div className={styles.dropdownItem}>
                <DarkMode />
              </div>
              <div
                className={`${styles.dropdownItem} ${styles.internationalization}`}
              >
                <Language />
              </div>
              <button
                className={styles.logoutButton}
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className={styles.button} onClick={toggleModal}>
          🔑
        </button>
      )}

      <AuthModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Hamburger;
