// components/priorities/priorities.tsx

"use client";
import React, { useContext } from 'react';
import style from './priorities.module.css';
import { usePriorities } from '../../../context/prioritiesContext';
import { TogglesContext } from '../../../context/togglesContext';
import Title from '../../UI/shared/title';
import Item from '../../UI/shared/item';

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
      <Title title="Priorities" />
      <div className={style.priorities}>
        {[1, 2, 3].map((num, index) => (
          <Item
            key={num}
            text={priorities[index]}
            inputMode={true}
            onChange={(value) => handleChange(index, value)}
            label={`${num}`}
          />
        ))}
      </div>
    </div>
  );
}
