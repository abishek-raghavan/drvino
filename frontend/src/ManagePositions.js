import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Modal from 'react-modal'; // Import the Modal component
import './ManagePositions.css';
import myImage from './Visual Planet.png';


function PositionList({ positions, onPositionClick, onDeletePosition }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Positions</h2>
      <div className='table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Position Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={index}>
                <td>{position.position}</td>
                <td>
                  <button onClick={() => onPositionClick(position)} className='btngreen'>Edit</button>
                  <button onClick={() => onDeletePosition(position.id)} className='btndelete'>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManagePositions() {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [newPositionName, setNewPositionName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/positions');
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };
    fetchPositions();
  }, []);

  const handlePositionClick = (position) => {
    setSelectedPosition(position);
    setNewPositionName(position.position);
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"
  };

  const handleUpdatePosition = async () => {
    try {
      await axios.put(`http://localhost:8081/admin/positions/${selectedPosition.id}`, {
        Position_Name: newPositionName,
        Position_Description: selectedPosition.Position_Description // Include existing description
      });
      console.log('Position updated successfully');
      // Show sweet alert on success
      swal("Updated!", "Position updated successfully!", "success");
      setSelectedPosition(null);
      setNewPositionName('');
      setEditMode(false);
      // Refresh positions
      refreshPositions();
      setModalIsOpen(false); // Close the modal after updating
    } catch (error) {
      console.error('Error updating position:', error);
      // Show sweet alert for error
      swal("Error!", "Something went wrong!", "error");
    }
  };

  const handleDeletePosition = async (positionId) => {
    // Show confirmation dialog before deleting
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this position!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`http://localhost:8081/admin/positions/${positionId}`);
          console.log('Position deleted successfully');
          // Show sweet alert on success
          swal("Deleted!", "Position deleted successfully!", "success");
          // Refresh positions
          refreshPositions();
        } catch (error) {
          console.error('Error deleting position:', error);
          // Show sweet alert for error
          swal("Error!", "Something went wrong!", "error");
        }
      } else {
        // Show cancel message if user cancels delete operation
        swal("Cancelled!", "Position deletion cancelled!", "info");
      }
    });
  };

  const refreshPositions = async () => {
    try {
      const response = await axios.get('http://localhost:8081/admin/positions');
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  return (
    <>
          <div className='admin-container'>


    <div className='admin-header'>
    <img src={myImage} alt="My Image" className="admin-panel-image" />
    </div><div className="container">
      <PositionList positions={positions} onPositionClick={handlePositionClick} onDeletePosition={handleDeletePosition} />
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
        {selectedPosition && editMode && (
          <div className="details">
            <h2 className="center bus">Edit Position</h2>
            <div className="input-field">
              <label>Position Name:</label>
              <input
                type="text"
                value={newPositionName}
                onChange={(e) => setNewPositionName(e.target.value)}
              />
            </div>
            <button className="update-button" onClick={handleUpdatePosition}>Update Position</button>
          </div>
        )}
      </Modal>
    </div>
    </div>
    </>
  );
}

export default ManagePositions;
