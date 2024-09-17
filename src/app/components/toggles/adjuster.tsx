import React from 'react';
import style from './adjuster.module.css';

interface AdjusterProps {
  onIncrease: () => void; // Function to be called when the "+" button is clicked
  backgroundClass?: string; // Optional background class to apply
}

const Adjuster: React.FC<AdjusterProps> = ({ onIncrease, backgroundClass }) => {
  return (
    <div className={`${style.container} ${backgroundClass || ''}`}>
      <button className={`${style.button} ${backgroundClass || ''}`} onClick={onIncrease}>+</button>
      <button className={`${style.button} ${backgroundClass || ''}`}>-</button> {/* No functionality yet */}
    </div>
  );
};

export default Adjuster;
