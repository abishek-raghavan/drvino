import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import './ManagerUsers.css'; // Import your CSS file
import Modal from 'react-modal'; // Import the Modal component

// Component for displaying the list of durations
function DurationList({ durations, onDurationClick, onDeleteDuration }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Durations</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {durations.length > 0 ? (
              durations.map((duration, index) => (
                <tr key={index}>
                  <td>{duration.duration_text}</td>
                  <td>
                    <button onClick={() => onDurationClick(duration)} className='btngreen'>Edit</button>
                    <button onClick={() => onDeleteDuration(duration)} className='btndelete'>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No durations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main component for managing durations
function ManageDurations() {
  const [durations, setDurations] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [newDurationText, setNewDurationText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  // Fetch durations from the backend
  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/duration');
        setDurations(response.data);
      } catch (error) {
        console.error('Error fetching durations:', error);
      }
    };
    fetchDurations();
  }, []);

  // Handle click on "Edit" button
  const handleDurationClick = (duration) => {
    setSelectedDuration(duration);
    setNewDurationText(duration.duration_text);
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  // Handle update of duration
  const handleUpdateDuration = async () => {
    try {
      await axios.put(`http://localhost:5000/duration/${selectedDuration.id}`, {
        duration_text: newDurationText,
      });
      console.log('Duration updated successfully');
      setSelectedDuration(null);
      setNewDurationText('');
      setEditMode(false);
      refreshDurations();
      setModalIsOpen(false); // Close the modal after updating

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Duration updated successfully!',
      });
    } catch (error) {
      console.error('Error updating duration:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong!',
      });
    }
  };

  // Handle deletion of duration
  const handleDeleteDuration = async (duration) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this duration!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/duration/${duration.id}`);
          console.log('Duration deleted successfully');
          refreshDurations();
          Swal.fire('Deleted!', 'Duration deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting duration:', error);
          Swal.fire('Error!', 'Something went wrong!', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Duration deletion cancelled!', 'info');
      }
    });
  };

  // Refresh durations after adding, editing, or deleting
  const refreshDurations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/duration');
      setDurations(response.data);
    } catch (error) {
      console.error('Error fetching durations:', error);
      Swal.fire('Error!', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className="container">
          <DurationList durations={durations} onDurationClick={handleDurationClick} onDeleteDuration={handleDeleteDuration} />
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
            {selectedDuration && editMode && (
              <div className="details">
                <h2 className="center bus">Edit Duration</h2>
                <div className="input-field">
                  <label>Duration Text:</label>
                  <input
                    type="text"
                    value={newDurationText}
                    onChange={(e) => setNewDurationText(e.target.value)}
                  />
                </div>
                <button className="update-button" onClick={handleUpdateDuration}>Update Duration</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageDurations;
