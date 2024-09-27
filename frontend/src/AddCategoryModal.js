import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function AddCategoryModal({ isOpen, onRequestClose, onCategoryAdd }) {
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);

  const generateUniqueId = () => {
    // Generate a random alphanumeric ID
    return Math.random().toString(36).substring(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const id = generateUniqueId(); // Generate a unique ID
      // Send a POST request to the backend to add the category to the database
      const response = await axios.post('http://localhost:8081/addcategory', { id, category });
      // Handle success
      console.log(response.data.message); // Log success message
      onCategoryAdd(category); // Add the category to the state
      onRequestClose(); // Close the modal
    } catch (error) {
      // Handle error
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.'); // Set error message
    }
  };

  const handleInput = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Category Modal"
      className="modal-content text"
    >
      <h2>Add New Category</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={handleInput}
        />
        <button type="submit" className="btn btn-success">Add</button>
        <button type="button" className="btn btn-danger" onClick={onRequestClose}>Close</button>
      </form>
      <span className="close-button" onClick={onRequestClose}>
        &times;
      </span>
    </Modal>
  );
}

export default AddCategoryModal;
