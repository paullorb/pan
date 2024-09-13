import React from 'react';
import styles from './status.module.css';
import { useAuth } from '../context/authContext';

const Status: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className={`${styles.statusLight} ${
        isAuthenticated ? styles.greenBlink : styles.redSolid
      }`}
      aria-label={isAuthenticated ? 'Logged In' : 'Not Logged In'}
    ></div>
  );
};

export default Status;
