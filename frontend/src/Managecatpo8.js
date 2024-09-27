import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ManagerUsers.css'; // Import your CSS file
import Modal from 'react-modal'; // Import Modal component

// Component for displaying the list of timings
function TimingList({ timings, onTimingClick, onDeleteTiming }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Timing</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Timing</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timings.length > 0 ? (
              timings.map((timing, index) => (
                <tr key={index}>
                  <td>{timing.timing_text}</td>
                  <td>
                    <button onClick={() => onTimingClick(timing)} className='btngreen'>Edit</button>
                    <button onClick={() => onDeleteTiming(timing)} className='btndelete'>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No timings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main component for managing timings
function ManageTiming() {
  const [timings, setTimings] = useState([]);
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [newTimingText, setNewTimingText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  // Fetch all timings from the backend
  useEffect(() => {
    const fetchTimings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/timing');
        setTimings(response.data);
      } catch (error) {
        console.error('Error fetching timings:', error);
      }
    };
    fetchTimings();
  }, []);

  const handleTimingClick = (timing) => {
    setSelectedTiming(timing);
    setNewTimingText(timing.timing_text); // Populate the text input with the selected timing text
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  const handleUpdateTiming = async () => {
    try {
      await axios.put(`http://localhost:5000/timing/${selectedTiming.id}`, {
        timing_text: newTimingText,
      });
      console.log('Timing updated successfully');
      setSelectedTiming(null);
      setNewTimingText('');
      setEditMode(false);
      refreshTimings(); // Refresh the list after update
      setModalIsOpen(false); // Close the modal after updating

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Timing updated successfully!',
      });
    } catch (error) {
      console.error('Error updating timing:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong!',
      });
    }
  };

  const handleDeleteTiming = async (timing) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this timing!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/timing/${timing.id}`);
          console.log('Timing deleted successfully');
          refreshTimings();
          Swal.fire('Deleted!', 'Timing deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting timing:', error);
          Swal.fire('Error!', 'Something went wrong!', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Timing deletion cancelled!', 'info');
      }
    });
  };

  const refreshTimings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/timing');
      setTimings(response.data);
    } catch (error) {
      console.error('Error fetching timings:', error);
      Swal.fire('Error!', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className="container">
          <TimingList timings={timings} onTimingClick={handleTimingClick} onDeleteTiming={handleDeleteTiming} />
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
            {selectedTiming && editMode && (
              <div className="details">
                <h2 className="center bus">Edit Timing</h2>
                <div className="input-field">
                  <label>Timing Text:</label>
                  <input
                    type="text"
                    value={newTimingText}
                    onChange={(e) => setNewTimingText(e.target.value)}
                  />
                </div>
                <button className="update-button" onClick={handleUpdateTiming}>Update Timing</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageTiming;
