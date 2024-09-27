import React, { useState } from 'react';

function UserAdd({ onClose, onCategoryAdd }) {
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onCategoryAdd(newCategory);
    onClose();
  };

  return (
    <div className="user-add">
      <form onSubmit={handleSubmit}>
        <label htmlFor="newCategory">New Category:</label>
        <input type="text" id="newCategory" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        <button type="submit">Add</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
}

export default UserAdd;
