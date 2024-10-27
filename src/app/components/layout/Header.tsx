"use client";

import React, { useContext } from "react";
import { TogglesContext, TogglesState } from "../../context/togglesContext";
import { useItems } from "../../context/itemsContext";
import style from "./Header.module.css";

const Header = () => {
  const context = useContext(TogglesContext);
  const { items } = useItems();
  
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

  const isToggleVisible = (toggle: keyof TogglesState): boolean => {
    if (toggle === 'hours') {
      return togglesState.main && togglesState[toggle];
    }
    return togglesState.aside && togglesState[toggle];
  };

  // Get count for each type
  const getCount = (toggle: string) => {
    switch(toggle) {
      case 'priorities':
        return items.priority.length;
      case 'tasks':
        return items.task.length;
      case 'habits':
        return items.habit.length;
      case 'hours':
        return items.hour.length;
      default:
        return 0;
    }
  };

  const mainToggles = ['hours'];
  const asideToggles = Object.keys(togglesState)
    .filter(key => !['main', 'aside', 'hours', 'headerToggles'].includes(key))
    .sort() as Array<keyof TogglesState>;

  // Helper to render toggle button
  const renderToggleButton = (toggle: keyof TogglesState, isMainToggle: boolean = false) => {
    const count = getCount(toggle);
    const isVisible = isInitialized && isToggleVisible(toggle);
    const buttonClass = isVisible ? [style.toggle, style.active].join(' ') : style.toggle;

    return (
      <button
        key={toggle}
        onClick={() => handleToggleClick(toggle)}
        className={buttonClass}
      >
        {count > 0 && <span className={style.count}>{count}</span>}
        {toggle.charAt(0).toUpperCase() + toggle.slice(1)}
      </button>
    );
  };

  return (
    <header className={style.container}>
      {isInitialized && togglesState.headerToggles && (
        <div className={style.toggles}>
          <div className={style.layoutToggles}>
            <button
              onClick={() => handleToggleClick('main')}
              className={isInitialized && togglesState.main ? [style.toggle, style.active].join(' ') : style.toggle}
            >
              Main quests
            </button>
            <button
              onClick={() => handleToggleClick('aside')}
              className={isInitialized && togglesState.aside ? [style.toggle, style.active].join(' ') : style.toggle}
            >
              Side quests
            </button>
          </div>
          <div className={style.toggleOptions}>
            {mainToggles.map((toggle) => renderToggleButton(toggle as keyof TogglesState, true))}
            {asideToggles.map((toggle) => renderToggleButton(toggle))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;