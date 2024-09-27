import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import './ManagerUsers.css';
import Modal from 'react-modal'; // Import the Modal component

function ComplaintList({ complaints, onComplaintClick, onDeleteComplaint }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Complaints</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Complaint</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint, index) => (
              <tr key={index}>
                <td>{complaint.complaint_text}</td>
                <td>
                  <button onClick={() => onComplaintClick(complaint)} className='btngreen'>Edit</button>
                  <button onClick={() => onDeleteComplaint(complaint)} className='btndelete'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newComplaintText, setNewComplaintText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5000/complaints');
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    fetchComplaints();
  }, []);

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setNewComplaintText(complaint.complaint_text);
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  const handleUpdateComplaint = async () => {
    try {
      await axios.put(`http://localhost:5000/complaints/${selectedComplaint.id}`, {
        complaint_text: newComplaintText,
      });
      console.log('Complaint updated successfully');
      setSelectedComplaint(null);
      setNewComplaintText('');
      setEditMode(false);
      refreshComplaints();
      setModalIsOpen(false); // Close the modal after updating

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Complaint updated successfully!',
      });
    } catch (error) {
      console.error('Error updating complaint:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong!',
      });
    }
  };

  const handleDeleteComplaint = async (complaint) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this complaint!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/complaints/${complaint.id}`);
          console.log('Complaint deleted successfully');
          refreshComplaints();
          Swal.fire('Deleted!', 'Complaint deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting complaint:', error);
          Swal.fire('Error!', 'Something went wrong!', 'error');
        }
      } else {
        Swal.fire('Cancelled', 'Complaint deletion cancelled!', 'info');
      }
    });
  };

  const refreshComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5000/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Swal.fire('Error!', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className="container">
          <ComplaintList complaints={complaints} onComplaintClick={handleComplaintClick} onDeleteComplaint={handleDeleteComplaint} />
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
            {selectedComplaint && editMode && (
              <div className="details">
                <h2 className="center bus">Edit Complaint</h2>
                <div className="input-field">
                  <label>Complaint Text:</label>
                  <input
                    type="text"
                    value={newComplaintText}
                    onChange={(e) => setNewComplaintText(e.target.value)}
                  />
                </div>
                <button className="update-button" onClick={handleUpdateComplaint}>Update Complaint</button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageComplaints;
