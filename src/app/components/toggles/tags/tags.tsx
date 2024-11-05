import React from 'react';
import { useTags } from '../../../context/tagsContext';
import style from './tags.module.css';

const Tags: React.FC = () => {
  const { tags } = useTags();
  
  return (
    <div className={style.container}>
      <h2>Tags</h2>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;