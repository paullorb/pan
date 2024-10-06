// /components/UI/auth/auth.tsx

import { useState, useEffect, useRef } from 'react';
import styles from './auth.module.css';
import { useAuth } from '../../../context/authContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to track login or signup mode and closing animation
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Ref for email input
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus on email input when modal opens
  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isOpen]);

  // Close modal with animation when authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      setIsClosing(true);
    }
  }, [isAuthenticated, isOpen]);

  // After animation ends, close the modal
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300); // Duration matches CSS transition

      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  if (!isOpen && !isClosing) return null;

  // Adjust modal rendering based on isLoading if necessary
  if (isLoading) return null; // Or a loading indicator

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoginMode) {
      await login(email, password);
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      await signup(email, password);
    }
    // No need to call onClose() here
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsClosing(true);
    }
  };

  return (
    <div
      className={`${styles.backdrop} ${isClosing ? styles.fadeOut : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`${styles.modal} ${isClosing ? styles.modalFadeOut : ''}`}>
        {/* Login / Signup Tabs */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${isLoginMode ? styles.activeTab : ''}`}
            onClick={() => setIsLoginMode(true)}
          >
            Login
          </button>
          <button
            className={`${styles.tabButton} ${!isLoginMode ? styles.activeTab : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">email:</label>
            <input
              type="email"
              id="email"
              ref={emailInputRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {!isLoginMode && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">confirm password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            {isLoginMode ? 'Login' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
