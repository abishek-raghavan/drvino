import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');

  const handleLogout = () => {
    sessionStorage.removeItem('sessionId'); // Clear the session ID from sessionStorage
    navigate('/'); // Redirect to login page
  };

  return (
    <>
      <div>
        {/* Optional content */}
      </div>
      <div className='admin-container2'>
        <div className='admin-panel'>
          <div className='admin-buttons'>
            <Link to={`/AddPatient?loginlocation=${username}`} className='btn-default'>Patient's Appointment</Link>
            <Link to={`/PatientsFollowUp?loginlocation=${username}`} className='btn-default'>Appointments</Link>
            <Link to={`/add?loginlocation=${username}`} className='btn-default'>Add</Link>
            <Link to={`/choosecatpo?loginlocation=${username}`} className='btn-default'>Manage</Link>
            <Link to={`/adminfollow?loginlocation=${username}`} className='btn-default'>Patients</Link>
            <button onClick={handleLogout} className='btn btn-danger'>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
