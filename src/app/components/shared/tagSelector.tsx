// components/shared/tagSelector.tsx

"use client";
import React, { useState } from 'react';
import { useTags } from '../../context/tagsContext';
import styles from './tagSelector.module.css';

interface TagSelectorProps {
  selectedTags: string[];
  onAddTag: (tagId: string) => void;
  onRemoveTag: (tagId: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onAddTag, onRemoveTag }) => {
  const { tags, addTag } = useTags();
  const [newTagName, setNewTagName] = useState('');

  const handleAddNewTag = () => {
    if (newTagName.trim() !== '') {
      addTag(newTagName.trim());
      setNewTagName('');
    }
  };

  return (
    <div className={styles.tagSelector}>
      {/* Existing Tags */}
      {tags.map(tag => (
        <label key={tag.id} className={styles.tagOption}>
          <input
            type="checkbox"
            checked={selectedTags.includes(tag.id)}
            onChange={(e) => {
              if (e.target.checked) {
                onAddTag(tag.id);
              } else {
                onRemoveTag(tag.id);
              }
            }}
          />
          <span
            className={styles.tagColor}
            style={{ backgroundColor: tag.color || '#cccccc' }}
          ></span>
          {tag.name}
        </label>
      ))}
      {/* Add New Tag */}
      <div className={styles.newTag}>
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name"
          className={styles.newTagInput}
        />
        <button onClick={handleAddNewTag} className={styles.newTagButton}>
          Add Tag
        </button>
      </div>
    </div>
  );
};

export default TagSelector;
