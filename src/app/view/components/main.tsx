"use client";

import { useState } from 'react';
import style from './main.module.css';
import Month from './month';
import Week from './week';
import WorkWeek from './workWeek';

export default function MainComponent() {
  const [selectedView, setSelectedView] = useState<string>('week');

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedView(event.target.value);
  };

  const renderView = () => {
    switch (selectedView) {
      case 'week':
        return <Week />;
      case 'workWeek':
        return <WorkWeek />;
      case 'month':
        return <Month />;
      default:
        return null;
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <input
          type="radio"
          name="view"
          value="week"
          id="week"
          checked={selectedView === 'week'}
          onChange={handleViewChange}
        />
        <label htmlFor="week">Week</label>

        <input
          type="radio"
          name="view"
          value="workWeek"
          id="workWeek"
          checked={selectedView === 'workWeek'}
          onChange={handleViewChange}
        />
        <label htmlFor="workWeek">Work Week</label>

        <input
          type="radio"
          name="view"
          value="month"
          id="month"
          checked={selectedView === 'month'}
          onChange={handleViewChange}
        />
        <label htmlFor="month">Month</label>
      </div>

      <div className={style.view}>
        {renderView()}
      </div>
    </div>
  );
}
