import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import './ManagerUsers.css'; // Import your CSS file
import Modal from 'react-modal'; // Import the Modal component

// Component for displaying the list of vaccines
function VaccineList({ vaccines, onVaccineClick, onDeleteVaccine }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Vaccines</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Vaccine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.length > 0 ? (
              vaccines.map((vaccine, index) => (
                <tr key={index}>
                  <td>{vaccine.vaccine_text}</td>
                  <td>
                    <button onClick={() => onVaccineClick(vaccine)} className='btngreen'>Edit</button>
                    <button onClick={() => onDeleteVaccine(vaccine)} className='btndelete'>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No vaccines found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main component for managing vaccines
function ManageVaccine() {
  const [vaccines, setVaccines] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [newVaccineText, setNewVaccineText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  // Fetch vaccines from the backend
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vaccine');
        setVaccines(response.data);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };
    fetchVaccines();
  }, []);

  // Handle click on "Edit" button
  const handleVaccineClick = (vaccine) => {
    setSelectedVaccine(vaccine);
    setNewVaccineText(vaccine.vaccine_text);
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  // Handle update of vaccine
  const handleUpdateVaccine = async () => {
    try {
      await axios.put(`http://localhost:5000/vaccine/${selectedVaccine.id}`, {
        vaccine_text: newVaccineText,
      });
      console.log('Vaccine updated successfully');
      setSelectedVaccine(null);
      setNewVaccineText('');
      setEditMode(false);
      refreshVaccines();
      setModalIsOpen(false); // Close the modal after updating

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Vaccine updated successfully!',
      });
    } catch (error) {
      console.error('Error updating vaccine:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong!',
      });
    }
  };

  // Handle deletion of vaccine
  const handleDeleteVaccine = async (vaccine) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this vaccine!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/vaccine/${vaccine.id}`);
          console.log('Vaccine deleted successfully');
          refreshVaccines();
          Swal.fire('Deleted!', 'Vaccine deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting vaccine:', error);
          Swal.fire('Error!', 'Something went wrong!', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Vaccine deletion cancelled!', 'info');
      }
    });
  };

  // Refresh vaccines after adding, editing, or deleting
  const refreshVaccines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vaccine');
      setVaccines(response.data);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      Swal.fire('Error!', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className="container">
          <VaccineList vaccines={vaccines} onVaccineClick={handleVaccineClick} onDeleteVaccine={handleDeleteVaccine} />
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
            {selectedVaccine && editMode && (
              <div className="details">
                <h2 className="center bus">Edit Vaccine</h2>
                <div className="input-field">
                  <label>Vaccine Text:</label>
                  <input
                    type="text"
                    value={newVaccineText}
                    onChange={(e) => setNewVaccineText(e.target.value)}
                  />
                </div>
                <button className="update-button" onClick={handleUpdateVaccine}>Update Vaccine</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageVaccine;
