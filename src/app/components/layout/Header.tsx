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

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setTogglesState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <header className={style.container}>
      <div className={style.toggles}>
        {(Object.keys(togglesState) as Array<keyof TogglesState>).map((toggle) => (
          <label key={toggle} className={style.toggleOption}>
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
    </header>
  );
};

export default Header;