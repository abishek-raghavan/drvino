import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ManagerUsers.css'; // Import your CSS file
import Modal from 'react-modal'; // Modal for edit functionality

// Component for displaying the list of dosages
function DosageList({ dosages, onDosageClick, onDeleteDosage }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Dosage</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Dosage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dosages.length > 0 ? (
              dosages.map((dosage, index) => (
                <tr key={index}>
                  <td>{dosage.dosage_text}</td>
                  <td>
                    <button onClick={() => onDosageClick(dosage)} className='btngreen'>Edit</button>
                    <button onClick={() => onDeleteDosage(dosage)} className='btndelete'>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No dosages found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main component for managing dosages
function ManageDosage() {
  const [dosages, setDosages] = useState([]);
  const [selectedDosage, setSelectedDosage] = useState(null);
  const [newDosageText, setNewDosageText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  // Fetch all dosages from the backend
  useEffect(() => {
    const fetchDosages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/dosage');
        setDosages(response.data);
      } catch (error) {
        console.error('Error fetching dosages:', error);
      }
    };
    fetchDosages();
  }, []);

  const handleDosageClick = (dosage) => {
    setSelectedDosage(dosage);
    setNewDosageText(dosage.dosage_text); // Populate the text input with the selected dosage text
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  const handleUpdateDosage = async () => {
    try {
      await axios.put(`http://localhost:5000/dosage/${selectedDosage.id}`, {
        dosage_text: newDosageText,
      });
      console.log('Dosage updated successfully');
      setSelectedDosage(null);
      setNewDosageText('');
      setEditMode(false);
      refreshDosages(); // Refresh the list after update
      setModalIsOpen(false); // Close the modal after updating

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Dosage updated successfully!',
      });
    } catch (error) {
      console.error('Error updating dosage:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong!',
      });
    }
  };

  const handleDeleteDosage = async (dosage) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this dosage!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/dosage/${dosage.id}`);
          console.log('Dosage deleted successfully');
          refreshDosages();
          Swal.fire('Deleted!', 'Dosage deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting dosage:', error);
          Swal.fire('Error!', 'Something went wrong!', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Dosage deletion cancelled!', 'info');
      }
    });
  };

  const refreshDosages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/dosage');
      setDosages(response.data);
    } catch (error) {
      console.error('Error fetching dosages:', error);
      Swal.fire('Error!', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className="container">
          <DosageList dosages={dosages} onDosageClick={handleDosageClick} onDeleteDosage={handleDeleteDosage} />
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
            {selectedDosage && editMode && (
              <div className="details">
                <h2 className="center bus">Edit Dosage</h2>
                <div className="input-field">
                  <label>Dosage Text:</label>
                  <input
                    type="text"
                    value={newDosageText}
                    onChange={(e) => setNewDosageText(e.target.value)}
                  />
                </div>
                <button className="update-button" onClick={handleUpdateDosage}>Update Dosage</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageDosage;
