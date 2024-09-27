import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './AddPatient.css';

const AddPatient = () => {
  const [patient, setPatient] = useState({
    fullName: '',
    fathersName: '',
    age: '',
    gender: '',
    city: '',
    phoneNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    services: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setPatient({ ...patient, services: [...patient.services, value] });
    } else {
      setPatient({ ...patient, services: patient.services.filter((service) => service !== value) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data to the backend
    fetch('http://localhost:5000/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          // Show success alert with SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Appointment Booked!',
            text: 'The patient appointment has been successfully added.',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/appointments'); // Redirect to appointments page after clicking "OK"
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Show error alert with SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Please try again later.',
        });
      });
  };

  return (
    <div className="container">
      <h2>Add Patient</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={patient.fullName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input type="text" name="age" value={patient.age} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="form-radio">
              <label>
                <input type="radio" name="gender" value="Male" checked={patient.gender === 'Male'} onChange={handleChange} /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="Female" checked={patient.gender === 'Female'} onChange={handleChange} /> Female
              </label>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" value={patient.phoneNumber} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input type="date" name="appointmentDate" value={patient.appointmentDate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Appointment Time</label>
            <input type="time" name="appointmentTime" value={patient.appointmentTime} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Services</label>
          <div className="form-checkbox">
            <label>
              <input type="checkbox" value="General Medicine" onChange={handleCheckboxChange} /> General Medicine
            </label>
            <label>
              <input type="checkbox" value="Pediatrics" onChange={handleCheckboxChange} /> Pediatrics
            </label>
            <label>
              <input type="checkbox" value="Scan report consultation" onChange={handleCheckboxChange} /> Scan report consultation
            </label>
            <label>
              <input type="checkbox" value="Other" onChange={handleCheckboxChange} /> Other
            </label>
          </div>
        </div>

        <button type="submit" className="btn-submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AddPatient;
