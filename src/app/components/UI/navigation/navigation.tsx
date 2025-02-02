// navigation.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import AuthModal from '../auth/auth';
import DarkMode from '../darkMode/darkMode';
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
      <span className={styles.email}>{userEmail}</span>
      {isAuthenticated ? (
        <div className={styles.userSection}>
          <DarkMode />
          <button 
            className={styles.logoutButton}
            onClick={logout}>
            ✌️
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAuthModalOpen(true)}>
          🔑
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.navigation}>
      {isMobile && <MenuButton />}
      <MenuItems />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}