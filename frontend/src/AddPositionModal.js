import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function AddPositionModal({ isOpen, onRequestClose, onPositionAdd }) {
  const [position, setPosition] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to the backend to add the position to the database
      const response = await axios.post('http://localhost:8081/addpositions', { position });
      // Handle success
      console.log(response.data.message);
      onPositionAdd(position);
      onRequestClose(); // Close the modal
    } catch (error) {
      // Handle error
      console.error('Error adding position:', error);
      setError('Failed to add position. Please try again.'); // Set error message
    }
  };

  const handleInput = (event) => {
    setPosition(event.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Position Modal"
      className="modal-content text"
    >
      <h2>Add New Position</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="position">Position:</label>
        <input
          type="text"
          id="position"
          value={position}
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

export default AddPositionModal;