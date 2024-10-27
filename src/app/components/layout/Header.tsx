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

  // Filter out layout toggles for the component toggles list
  const componentToggles = Object.keys(togglesState)
    .filter(key => key !== 'main' && key !== 'aside')
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
        {componentToggles.map((toggle) => (
          <button
            key={toggle}
            onClick={() => handleToggleClick(toggle)}
            className={isInitialized && togglesState[toggle] ? [style.toggle, style.active].join(' ') : style.toggle}
          >
            {toggle.charAt(0).toUpperCase() + toggle.slice(1)}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;