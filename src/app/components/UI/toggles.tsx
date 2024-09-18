"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./toggles.module.css";

export default function Toggles() {
  const [isOpen, setIsOpen] = useState(false);
  const [togglesState, setTogglesState] = useState({
    hours: false,
    priorities: false,
    tasks: false,
    month: false,
    date: false,
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleChange = (event: { target: { name: string; checked: boolean; }; }) => {
    const { name, checked } = event.target;
    setTogglesState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Close the dropdown if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener when dropdown is closed
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.toggles}>
        <button className={styles.label} onClick={handleButtonClick}>
          Toggles
        </button>
        {isOpen && (
          <div className={styles.dropdown} ref={dropdownRef}>
            {Object.keys(togglesState).map((toggle) => (
              <label key={toggle} className={styles.toggleOption}>
                <input
                  type="checkbox"
                  name={toggle}
                  checked={togglesState[toggle as keyof typeof togglesState]}
                  onChange={handleToggleChange}
                />
                {toggle.charAt(0).toUpperCase() + toggle.slice(1)}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
