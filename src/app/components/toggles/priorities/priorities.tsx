"use client";
import React, {useContext} from 'react';
import style from './priorities.module.css';
import { usePriorities } from '../../../context/prioritiesContext';
import { TogglesContext } from '../../../context/togglesContext';

export default function Priorities() {
  const { priorities, setPriorities } = usePriorities();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("Priorities must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.priorities) {
    return null;
  }


  const handleChange = (index: number, value: string) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value;
    setPriorities(newPriorities);
  };

  return (
    <div className={style.container}>
      <div className={style.title}>Priority</div>
      <div className={style.priorities}>
        {[1, 2, 3].map((num, index) => (
          <div className={style.priority} key={num}>
            <label htmlFor={`priority-${num}`} className={style.label}>
              {num}
            </label>
            <input
              className={style.input}
              type="text"
              name={`priority-${num}`}
              id={`priority-${num}`}
              value={priorities[index]}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
