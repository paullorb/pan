// components/toggles/tags/Tags.tsx
"use client";

import React from 'react';
import { useTags } from '../../../context/tagsContext';
import style from './tags.module.css';
import Title from '../../shared/title';
import AddItem from '../../shared/addItem';
import Item from '../../shared/item';

const Tags: React.FC = () => {
  const { tags, addTag } = useTags();

  const handleAddTag = (text: string) => {
    if (text.trim()) {
      addTag(text.trim());
    }
  };

  return (
    <div className={style.container}>
      <Title title="Tags" />
      <div className={style.tagList}>
        {tags.map((tag) => (
          <Item
            key={tag.id}
            text={tag.name}
            className={style.tagItem}
          />
        ))}
      </div>
      <AddItem
        placeholder="Add new tag"
        onAdd={handleAddTag}
        className={style.addItem}
      />
    </div>
  );
};

export default Tags;