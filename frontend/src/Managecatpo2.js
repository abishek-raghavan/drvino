import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import './ManagerUsers.css'; // Import your CSS file
import Modal from 'react-modal'; // Import the Modal component

// Component for displaying the list of examinations
function ExaminationList({ examinations, onExaminationClick, onDeleteExamination }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Examinations</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Examination</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {examinations.length > 0 ? (
              examinations.map((examination, index) => (
                <tr key={index}>
                  <td>{examination.onexam_text}</td> {/* Updated field name */}
                  <td>
                    <button onClick={() => onExaminationClick(examination)} className='btngreen'>Edit</button>
                    <button onClick={() => onDeleteExamination(examination)} className='btndelete'>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No examinations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main component for managing examinations
function ManageExaminations() {
  const [examinations, setExaminations] = useState([]);
  const [selectedExamination, setSelectedExamination] = useState(null);
  const [newExaminationText, setNewExaminationText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/examinations');
        setExaminations(response.data);
      } catch (error) {
        console.error('Error fetching examinations:', error);
      }
    };
    fetchExaminations();
  }, []);

  const handleExaminationClick = (examination) => {
    setSelectedExamination(examination);
    setNewExaminationText(examination.onexam_text);
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  const handleUpdateExamination = async () => {
    try {
      await axios.put(`http://localhost:5000/examinations/${selectedExamination.id}`, {
        examination_text: newExaminationText,
      });
      console.log('Examination updated successfully');
      setSelectedExamination(null);
      setNewExaminationText('');
      setEditMode(false);
      refreshExaminations();
      setModalIsOpen(false); // Close the modal after updating

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Examination updated successfully!',
      });
    } catch (error) {
      console.error('Error updating examination:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong!',
      });
    }
  };

  const handleDeleteExamination = async (examination) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this examination!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/examinations/${examination.id}`);
          console.log('Examination deleted successfully');
          refreshExaminations();
          Swal.fire('Deleted!', 'Examination deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting examination:', error);
          Swal.fire('Error!', 'Something went wrong!', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Examination deletion cancelled!', 'info');
      }
    });
  };

  const refreshExaminations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/examinations');
      setExaminations(response.data);
    } catch (error) {
      console.error('Error fetching examinations:', error);
      Swal.fire('Error!', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className="container">
          <ExaminationList examinations={examinations} onExaminationClick={handleExaminationClick} onDeleteExamination={handleDeleteExamination} />
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
            {selectedExamination && editMode && (
              <div className="details">
                <h2 className="center bus">Edit Examination</h2>
                <div className="input-field">
                  <label>Examination Text:</label>
                  <input
                    type="text"
                    value={newExaminationText}
                    onChange={(e) => setNewExaminationText(e.target.value)}
                  />
                </div>
                <button className="update-button" onClick={handleUpdateExamination}>Update Examination</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageExaminations;
