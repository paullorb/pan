import { useState, useEffect, useRef } from 'react';
import styles from './auth.module.css';
import { useAuth } from '../context/authContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to track login or signup mode
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Ref for email input
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus on email input when modal opens
  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoginMode) {
      login(email, password);
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      signup(email, password);
    }
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
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
              ref={emailInputRef} // Add ref here
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
