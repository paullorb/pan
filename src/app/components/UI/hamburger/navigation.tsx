// navigation.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import { TogglesContext } from '../../../context/togglesContext';
import AuthModal from '../auth/auth';
import Status from '../status/status';
import DarkMode from '../darkMode/darkMode';
import Language from '../language/language';
import styles from './navigation.module.css';

export default function Navigation() {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check viewport size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const MenuButton = () => (
    <button 
      className={styles.menuButton} 
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-label="Toggle menu"
    >
      ☰
    </button>
  );

  const MenuItems = () => (
    <div className={`${styles.menuItems} ${isMenuOpen ? styles.open : ''}`}>
      {/* Desktop-only status indicators */}
      {!isMobile && <Status />}

      {/* Common buttons */}
      <button 
        className={styles.actionButton} 
        onClick={() => window.print()}
        aria-label="Print"
      >
        🖨️
      </button>

      {/* Toggle buttons */}
      <TogglesContext.Consumer>
        {(context) => context && (
          <button 
            className={`${styles.actionButton} ${context.togglesState.headerToggles ? styles.active : ''}`}
            onClick={() => context.setTogglesState(prev => ({
              ...prev,
              headerToggles: !prev.headerToggles
            }))}
          >
            🎛️
          </button>
        )}
      </TogglesContext.Consumer>

      {/* User section */}
      {isAuthenticated ? (
        <div className={styles.userSection}>
          <span className={styles.email}>{userEmail}</span>
          <DarkMode />
          <Language />
          <button 
            className={styles.logoutButton}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className={styles.actionButton}
          onClick={() => setIsAuthModalOpen(true)}
        >
          🔑
        </button>
      )}
    </div>
  );

  return (
    <nav className={styles.navigation}>
      {isMobile && <MenuButton />}
      <MenuItems />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
}