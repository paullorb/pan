"use client";

import React, { useContext } from "react";
import { TogglesContext, TogglesState } from "../../context/togglesContext";
import style from "./Header.module.css";

const Header = () => {
  const context = useContext(TogglesContext);
  if (!context) {
    throw new Error("Header must be used within a TogglesProvider");
  }

  const { togglesState, setTogglesState } = context;

  const handleToggleClick = (toggleName: keyof TogglesState) => {
    setTogglesState((prevState) => ({
      ...prevState,
      [toggleName]: !prevState[toggleName],
    }));
  };

  return (
    <header className={style.container}>
      <div className={style.toggles}>
        {(Object.keys(togglesState) as Array<keyof TogglesState>).map((toggle) => {
          const buttonClass = togglesState[toggle] 
            ? [style.toggle, style.active].join(' ')
            : style.toggle;
            
          return (
            <button
              key={toggle}
              onClick={() => handleToggleClick(toggle)}
              className={buttonClass}
            >
              {toggle.charAt(0).toUpperCase() + toggle.slice(1)}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Header;