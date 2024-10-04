// components/shared/addItem.tsx

"use client";
import React, { useState } from 'react';
import style from './addItem.module.css';

interface AddItemProps {
  placeholder: string;
  onAdd: (text: string) => void;
  className?: string;
}

const AddItem: React.FC<AddItemProps> = ({ placeholder, onAdd, className }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={`${style.container} ${className || ''}`}>
      <input
        type="text"
        className={style.input}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleAddItem();
          }
        }}
      />
    </div>
  );
};

export default AddItem;
