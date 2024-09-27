import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import './ManagerUsers.css'; // Import your CSS file
import Modal from 'react-modal'; // Import the Modal component

// Component for displaying the list of advice given
function AdviceList({ advice, onAdviceClick, onDeleteAdvice }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Advice Given</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Advice</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {advice.length > 0 ? (
              advice.map((adviceEntry, index) => (
                <tr key={index}>
                  <td>{adviceEntry.advicegiven_text}</td>
                  <td>
                    <button onClick={() => onAdviceClick(adviceEntry)} className='btngreen'>Edit</button>
                    <button onClick={() => onDeleteAdvice(adviceEntry)} className='btndelete'>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No advice found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main component for managing advice given
function ManageAdviceGiven() {
  const [advice, setAdvice] = useState([]);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [newAdviceText, setNewAdviceText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  // Fetch advice from the backend
  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await axios.get('http://localhost:5000/advicegiven');
        setAdvice(response.data);
      } catch (error) {
        console.error('Error fetching advice:', error);
      }
    };
    fetchAdvice();
  }, []);

  // Handle click on "Edit" button
  const handleAdviceClick = (adviceEntry) => {
    setSelectedAdvice(adviceEntry);
    setNewAdviceText(adviceEntry.advicegiven_text);
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  // Handle update of advice
  const handleUpdateAdvice = async () => {
    try {
      await axios.put(`http://localhost:5000/advicegiven/${selectedAdvice.id}`, {
        advicegiven_text: newAdviceText,
      });
      console.log('Advice updated successfully');
      setSelectedAdvice(null);
      setNewAdviceText('');
      setEditMode(false);
      refreshAdvice();
      setModalIsOpen(false); // Close the modal after updating

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Advice updated successfully!',
      });
    } catch (error) {
      console.error('Error updating advice:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong!',
      });
    }
  };

  // Handle deletion of advice
  const handleDeleteAdvice = async (adviceEntry) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this advice!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/advicegiven/${adviceEntry.id}`);
          console.log('Advice deleted successfully');
          refreshAdvice();
          Swal.fire('Deleted!', 'Advice deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting advice:', error);
          Swal.fire('Error!', 'Something went wrong!', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Advice deletion cancelled!', 'info');
      }
    });
  };

  // Refresh advice after adding, editing, or deleting
  const refreshAdvice = async () => {
    try {
      const response = await axios.get('http://localhost:5000/advicegiven');
      setAdvice(response.data);
    } catch (error) {
      console.error('Error fetching advice:', error);
      Swal.fire('Error!', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className="container">
          <AdviceList advice={advice} onAdviceClick={handleAdviceClick} onDeleteAdvice={handleDeleteAdvice} />
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
            {selectedAdvice && editMode && (
              <div className="details">
                <h2 className="center bus">Edit Advice</h2>
                <div className="input-field">
                  <label>Advice Text:</label>
                  <input
                    type="text"
                    value={newAdviceText}
                    onChange={(e) => setNewAdviceText(e.target.value)}
                  />
                </div>
                <button className="update-button" onClick={handleUpdateAdvice}>Update Advice</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageAdviceGiven;
