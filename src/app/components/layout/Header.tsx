"use client";

import React, { useContext, useState, useEffect } from "react";
import { TogglesContext, TogglesState } from "../../context/togglesContext";
import style from "./Header.module.css";

const Header = () => {
  const context = useContext(TogglesContext);
  const [mounted, setMounted] = useState(false);

  if (!context) {
    throw new Error("Header must be used within a TogglesProvider");
  }

  const { togglesState, setTogglesState } = context;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleClick = (toggleName: keyof TogglesState) => {
    setTogglesState((prevState) => ({
      ...prevState,
      [toggleName]: !prevState[toggleName],
    }));
  };

  const sortedToggles = Object.keys(togglesState).sort() as Array<keyof TogglesState>;

  if (!mounted) {
    return (
      <header className={style.container}>
        <div className={style.toggles}>
          {sortedToggles.map((toggle) => (
            <button
              key={toggle}
              className={style.toggle}
            >
              {toggle.charAt(0).toUpperCase() + toggle.slice(1)}
            </button>
          ))}
        </div>
      </header>
    );
  }

  return (
    <header className={style.container}>
      <div className={style.toggles}>
        {sortedToggles.map((toggle) => (
          <button
            key={toggle}
            onClick={() => handleToggleClick(toggle)}
            className={togglesState[toggle] ? [style.toggle, style.active].join(' ') : style.toggle}
          >
            {toggle.charAt(0).toUpperCase() + toggle.slice(1)}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;