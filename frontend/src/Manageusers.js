import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import the Modal component
import './ManagerUsers.css';
import myImage from './Visual Planet.png';

function UserList({ users, onUserClick }) {
  return (
    <div className="container-fluid">
      <h2 className='bus'>Users</h2>
      <div className='table-responsive'>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Country</th>
            <th>State</th>
            <th>District</th>
            <th>Area</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.UserName}</td>
              <td>{user.Country}</td>
              <td>{user.State}</td>
              <td>{user.District}</td>
              <td>{user.Area}</td>
              <td>
                <button className="btngreen" onClick={() => onUserClick(user)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function ManageUsers() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newState, setNewState] = useState('');
  const [newId, setNewID] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newLoginLocation, setNewLoginLocation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/admin/users?loginlocation=${username}`);
        const filteredUsers = response.data.filter(user => user.username !== 'admin');
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [username]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setNewID(user.id);
    setNewUsername(user.UserName);
    setNewLoginLocation(user.Area);
    setNewPassword(user.Password);
    setNewCountry(user.Country);
    setNewDistrict(user.District);
    setNewState(user.State);
    setEditMode(true);
    openModal(); // Open the modal when a user is clicked
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8081/admin/users/${selectedUser.id}`, {
        id: newId,
        username: newUsername,
        country: newCountry,
        district: newDistrict,
        state: newState,
        loginlocation: newLoginLocation,
        password: newPassword
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'User updated successfully'
      });
      // Update the user list directly in the state
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            UserName: newUsername,
            Country: newCountry,
            District: newDistrict,
            State: newState,
            Area: newLoginLocation,
            Password: newPassword
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      setSelectedUser(null);
      setNewUsername('');
      setNewCountry('');
      setNewDistrict('');
      setNewState('');
      setNewLoginLocation('');
      setNewPassword('');
      setEditMode(false);
      closeModal(); // Close the modal after update
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    }
  };

  const handleDelete = async () => {
    // Show confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Delete user if confirmed
          await axios.delete(`http://localhost:8081/admin/users/${selectedUser.id}`);
          
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'User deleted successfully'
          });
  
          // Remove the deleted user from the user list
          const updatedUsers = users.filter(user => user.id !== selectedUser.id);
          setUsers(updatedUsers);
          setSelectedUser(null);
          setNewUsername('');
          setNewCountry('');
          setNewDistrict('');
          setNewState('');
          setNewLoginLocation('');
          setNewPassword('');
          setEditMode(false);
          closeModal(); // Close the modal after delete
        } catch (error) {
          console.error('Error deleting user:', error);
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          });
        }
      }
    });
  };
  
  return (
    <>
      <div className='admin-container'>
       <div className='admin-headerM'>
          <img src={myImage} alt="My Image" className="admin-panel-image" />
        </div>
        <div className="container">
          <UserList users={users} onUserClick={handleUserClick} />
          {/* Modal */}
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="Modal_ManageUsers">
            <h2>Edit User</h2>
            <div className="input-field">
              <label>Username:</label>
              <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="username-input" />
            </div>
            <div className="input-field">
              <label>Country:</label>
              <input type="text" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="country-input" />
            </div>
            <div className="input-field">
              <label>State:</label>
              <input type="text" value={newState} onChange={(e) => setNewState(e.target.value)} className="state-input" />
            </div>
            <div className="input-field">
              <label>District:</label>
              <input type="text" value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} className="district-input" />
            </div>
            <div className="input-field">
              <label>Login Location:</label>
              <input type="text" value={newLoginLocation} onChange={(e) => setNewLoginLocation(e.target.value)} className="location-input" />
            </div>
            <div className="input-field">
              <label>Password:</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="password-input"
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>
            <button className="update-button" onClick={handleUpdate}>Update</button>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
            <button className="cancel-button" onClick={closeModal}>Cancel</button>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ManageUsers;
