// hamburger.tsx
"use client";

import { useState, useEffect, useRef, useContext } from 'react';
import AuthModal from '../auth/auth';
import styles from './hamburger.module.css';
import { useAuth } from '../../../context/authContext';
import { TogglesContext } from '../../../context/togglesContext';
import Status from '../status/status';
import Language from '../language/language';
import DarkMode from '../darkMode/darkMode';
import MobileMenu from '../mobileMenu/mobileMenu';

const Hamburger: React.FC = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const { togglesState, setTogglesState, isInitialized } = useContext(TogglesContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const toggleHeaderButtons = () => {
    setTogglesState(prev => ({
      ...prev,
      headerToggles: !prev.headerToggles
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      {isMobile ? (
        <>
          <button className={styles.hamburgerButton} onClick={toggleMobileMenu}>
            ☰
          </button>
          {isMobileMenuOpen && (
            <MobileMenu
              onClose={() => {
                toggleMobileMenu();
                setIsModalOpen(true);
              }}
            />
          )}
        </>
      ) : (
        // Desktop layout
        <>
          <div className={`${styles.indicators} ${styles.desktopOnly}`}>
            <Status />
          </div>
          <button className={styles.button} onClick={handlePrint}>
            🖨️
          </button>
          <button 
            className={`${styles.button} ${togglesState.headerToggles ? styles.active : ''}`} 
            onClick={toggleHeaderButtons}
          >
            🎛️
          </button>

          {isAuthenticated ? (
            <div
              className={`${styles.dropdownContainer} ${styles.desktopOnly}`}
              ref={dropdownRef}
            >
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
            <button
              className={`${styles.button} ${styles.desktopOnly}`}
              onClick={toggleModal}
            >
              🔑
            </button>
          )}
        </>
      )}
      <AuthModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Hamburger;
