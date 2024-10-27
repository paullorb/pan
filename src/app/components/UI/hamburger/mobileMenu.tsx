import { useState, memo } from 'react';
import styles from './hamburger.module.css';

interface MobileMenuProps {
  onAuthClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = memo(({ onAuthClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <>
      <button className={styles.hamburgerButton} onClick={toggleMenu} aria-label="Toggle menu">
        ☰
      </button>
      {isOpen && (
        <div className={styles.mobileMenu}>
          <button onClick={onAuthClick}>Login/Signup</button>
        </div>
      )}
    </>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;