"use client";

import React, { useState } from 'react';
import { useHours } from '../context/hoursContext';
import style from './controls.module.css';

const Controls: React.FC = () => {
  const { from, until, setFrom, setUntil } = useHours();
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    const newFrom = parseInt((document.getElementById('fromHour') as HTMLInputElement).value, 10);
    const newUntil = parseInt((document.getElementById('untilHour') as HTMLInputElement).value, 10);

    if (newFrom >= 0 && newFrom <= 23 && newUntil >= newFrom && newUntil <= 23) {
      setFrom(newFrom);
      setUntil(newUntil);
      setShowModal(false);
    } else {
      alert('Please enter valid hour ranges between 0 and 23.');
    }
  };

  return (
    <>
      <div className={style.controlsContainer}>
        {/* Toggle the modal on button click */}
        <button className={style.openButton} onClick={() => setShowModal(!showModal)}>
          Open Controls
        </button>
      </div>
      
      {showModal && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <h2 className={style.modalTitle}>Adjust Time Range</h2>
            <label className={style.inputLabel}>
              From:
              <input className={style.inputField} type="number" id="fromHour" defaultValue={from} min="0" max="23" />
            </label>
            <label className={style.inputLabel}>
              Until:
              <input className={style.inputField} type="number" id="untilHour" defaultValue={until} min="0" max="23" />
            </label>
            <button className={style.saveButton} onClick={handleSave}>
              Save
            </button>
            <button className={style.closeButton} onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Controls;
