// /components/shared/delItem.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styles from './delItem.module.css';

interface DelItemProps {
  onDelete: () => void;
}

const DelItem: React.FC<DelItemProps> = ({ onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteEnabled, setDeleteEnabled] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (showConfirmation) {
      // Enable the delete button after 3 seconds
      timer = setTimeout(() => {
        setDeleteEnabled(true);
      }, 2000);
    } else {
      setDeleteEnabled(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showConfirmation]);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleCancelClick = () => {
    setShowConfirmation(false);
    setDeleteEnabled(false);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirmation(false);
    setDeleteEnabled(false);
  };

  return (
    <div className={styles.container}>
      {showConfirmation ? (
        <div className={styles.confirmation}>
          <button
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={handleConfirmDelete}
            disabled={!deleteEnabled}
          >
            Yes!
          </button>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={handleCancelClick}>
            No!
          </button>
        </div>
      ) : (
        <button className={`${styles.button} ${styles.deleteButton}`} onClick={handleDeleteClick}>
          🗑️
        </button>
      )}
    </div>
  );
};

export default DelItem;
