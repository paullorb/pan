// Adjuster.tsx
import React from 'react';
import style from './adjuster.module.css';

interface AdjusterProps {
  onIncrease: () => void; // Function to be called when the "+" button is clicked
}

const Adjuster: React.FC<AdjusterProps> = ({ onIncrease }) => {
  return (
    <div className={style.container}>
      <button className={style.button} onClick={onIncrease}>+</button>
      <button className={style.button}>-</button> {/* No functionality yet */}
    </div>
  );
};

export default Adjuster;
