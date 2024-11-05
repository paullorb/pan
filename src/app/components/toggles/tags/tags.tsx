import React from 'react';
import { useTags } from '../../../context/tagsContext';
import style from './tags.module.css';

const Tags: React.FC = () => {
  const { tags, addTag } = useTags();
  const [newTagName, setNewTagName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
    }
  };

  return (
    <div className={style.container}>
      <h2>Tags</h2>
      <ul>
        {tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Add new tag"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Tags;