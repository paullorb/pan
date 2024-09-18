// toggles.tsx
"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./toggles.module.css";
import { TogglesContext, TogglesState } from "../../context/togglesContext"; // Adjust the import path as necessary

export default function Toggles() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Use the context
  const context = useContext(TogglesContext);

  if (!context) {
    throw new Error("Toggles must be used within a TogglesProvider");
  }

  const { togglesState, setTogglesState } = context;

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

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
            {(Object.keys(togglesState) as Array<keyof TogglesState>).map((toggle) => (
              <label key={toggle} className={styles.toggleOption}>
                <input
                  type="checkbox"
                  name={toggle}
                  checked={togglesState[toggle]}
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
