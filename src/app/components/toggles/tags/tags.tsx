// /components/toggles/tags/tags.tsx
"use client";

import React, { useState } from 'react';
import { useTags } from '../../../context/tagsContext';
import style from './tags.module.css';
import Title from '../../shared/title';
import AddItem from '../../shared/addItem';
import Item from '../../shared/item';

const Tags: React.FC = () => {
  const { tags, addTag, deleteTag } = useTags();
  const [selectedColor, setSelectedColor] = useState<string>('#cccccc'); // Default color

  const handleAddTag = (name: string) => {
    addTag(name, selectedColor);
  };

  return (
    <div className={style.container}>
      <Title title="Tags" />
      <div className={style.tagList}>
        {tags.map((tag) => (
          <Item
            key={tag.id}
            text={tag.name}
            onDelete={() => deleteTag(tag.id)}
            className={style.tagItem}
          >
            <div className={style.tagContent}>
              <span
                className={style.tagColor}
                style={{ backgroundColor: tag.color || '#cccccc' }}
              ></span>
              <span className={style.tagName}>{tag.name}</span>
              <span className={style.tagCount}>{tag.count}</span>
              <button
                className={style.deleteButton}
                onClick={() => deleteTag(tag.id)}
              >
                🗑️
              </button>
            </div>
          </Item>
        ))}
      </div>
      <div className={style.addTagContainer}>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className={style.colorPicker}
        />
        <AddItem
          placeholder="Add new tag"
          onAdd={handleAddTag}
          className={style.addItem}
        />
      </div>
    </div>
  );
};

export default Tags;
