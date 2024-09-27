import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import './ManagerUsers.css'; // Import your CSS file
import Modal from 'react-modal'; // Import the Modal component

// Component for displaying the list of vitals
function VitalList({ vitals, onVitalClick, onDeleteVital }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Vitals</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Vital</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vitals.length > 0 ? (
              vitals.map((vital, index) => (
                <tr key={index}>
                  <td>{vital.vitals_text}</td> {/* Updated field name */}
                  <td>
                    <button onClick={() => onVitalClick(vital)} className='btngreen'>Edit</button>
                    <button onClick={() => onDeleteVital(vital)} className='btndelete'>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No vitals found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main component for managing vitals
function ManageVitals() {
  const [vitals, setVitals] = useState([]);
  const [selectedVital, setSelectedVital] = useState(null);
  const [newVitalText, setNewVitalText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vitals');
        console.log('Vitals fetched:', response.data); // Log the fetched data
        setVitals(response.data);
      } catch (error) {
        console.error('Error fetching vitals:', error);
      }
    };
    fetchVitals();
  }, []);

  const handleVitalClick = (vital) => {
    setSelectedVital(vital);
    setNewVitalText(vital.vitals_text); // Ensure this matches the data from backend
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  const handleUpdateVital = async () => {
    try {
      await axios.put(`http://localhost:5000/vitals/${selectedVital.id}`, {
        vital_text: newVitalText, // This should match the backend field name
      });
      console.log('Vital updated successfully');
      setSelectedVital(null);
      setNewVitalText('');
      setEditMode(false);
      refreshVitals();
      setModalIsOpen(false); // Close the modal after updating
  
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Vital updated successfully!',
      });
    } catch (error) {
      console.error('Error updating vital:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong!',
      });
    }
  };
  

  const handleDeleteVital = async (vital) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this vital!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/vitals/${vital.id}`);
          console.log('Vital deleted successfully');
          refreshVitals();
          Swal.fire('Deleted!', 'Vital deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting vital:', error);
          Swal.fire('Error!', 'Something went wrong!', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Vital deletion cancelled!', 'info');
      }
    });
  };

  const refreshVitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vitals');
      setVitals(response.data);
    } catch (error) {
      console.error('Error fetching vitals:', error);
      Swal.fire('Error!', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className="container">
          <VitalList vitals={vitals} onVitalClick={handleVitalClick} onDeleteVital={handleDeleteVital} />
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
            {selectedVital && editMode && (
              <div className="details">
                <h2 className="center bus">Edit Vital</h2>
                <div className="input-field">
                  <label>Vital Text:</label>
                  <input
                    type="text"
                    value={newVitalText}
                    onChange={(e) => setNewVitalText(e.target.value)}
                  />
                </div>
                <button className="update-button" onClick={handleUpdateVital}>Update Vital</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageVitals;
