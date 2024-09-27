import React from 'react';
import './CategoryModal.css'; // Import CSS file for modal styling

function CategoryModal({ category, onUpdate, onClose }) {
  const [newCategoryName, setNewCategoryName] = React.useState('');

  React.useEffect(() => {
    setNewCategoryName(category.Category);
  }, [category]);

  const handleUpdate = () => {
    onUpdate(newCategoryName);
  };

  return (
    <div className="modal-overlay"> {/* Apply CSS styles for modal overlay */}
      <div className="modal">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="modal-content">
          <h2>Edit Category</h2>
          <div className="input-field">
            <label>Category Name:</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <button className="update-button" onClick={handleUpdate}>Update Category</button>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
