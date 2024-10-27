"use client";

import React, { useContext } from "react";
import { TogglesContext, TogglesState } from "../../context/togglesContext";
import style from "./Header.module.css";

const Header = () => {
  const context = useContext(TogglesContext);
  if (!context) {
    throw new Error("Header must be used within a TogglesProvider");
  }

  const { togglesState, setTogglesState, isInitialized } = context;

  const handleToggleClick = (toggleName: keyof TogglesState) => {
    setTogglesState((prevState) => ({
      ...prevState,
      [toggleName]: !prevState[toggleName],
    }));
  };

  // Function to check if a toggle is actually visible
  const isToggleVisible = (toggle: keyof TogglesState) => {
    if (toggle === 'hours') {
      return togglesState.main && togglesState.hours;
    }
    return togglesState.aside && togglesState[toggle];
  }

  // Filter and sort toggles by section
  const mainToggles = ['hours'];
  const asideToggles = Object.keys(togglesState)
    .filter(key => !['main', 'aside', 'hours'].includes(key))
    .sort() as Array<keyof TogglesState>;

  return (
    <header className={style.container}>
      <div className={style.layoutToggles}>
        <button
          onClick={() => handleToggleClick('main')}
          className={isInitialized && togglesState.main ? [style.toggle, style.active].join(' ') : style.toggle}
        >
          Main
        </button>
        <button
          onClick={() => handleToggleClick('aside')}
          className={isInitialized && togglesState.aside ? [style.toggle, style.active].join(' ') : style.toggle}
        >
          Aside
        </button>
      </div>
      <div className={style.toggles}>
        {mainToggles.map((toggle) => (
          <button
            key={toggle}
            onClick={() => handleToggleClick(toggle as keyof TogglesState)}
            className={isInitialized && isToggleVisible(toggle as keyof TogglesState) ? [style.toggle, style.active].join(' ') : style.toggle}
          >
            {toggle.charAt(0).toUpperCase() + toggle.slice(1)}
          </button>
        ))}
        {asideToggles.map((toggle) => (
          <button
            key={toggle}
            onClick={() => handleToggleClick(toggle)}
            className={isInitialized && isToggleVisible(toggle) ? [style.toggle, style.active].join(' ') : style.toggle}
          >
            {toggle.charAt(0).toUpperCase() + toggle.slice(1)}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;