import React, { useState } from 'react';
import './PatientAppointments.css';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([
    {
      fullName: 'John Doe',
      age: '30',
      city: 'New York',
      complaints: 'Headache',
      time: '10:00 AM',
      phoneNumber: '123-456-7890',
      photo: '', // URL or path to photo
      fathersName: 'Jane Doe',
      address: '123 Main St',
      aadharCard: '', // Path for file upload
      bloodGroup: 'O+',
      majorComplaints: '',
      localExamination: '',
      diagnosis: '',
      familyHistory: '',
      birthHistory: '',
      surgicalHistory: '',
      anyOtherHistory: '',
      onExamination: '',
      systematicExamination: '',
      reports: '',
      treatmentGiven: [
        { name: 'Medicine A', dosage: '500mg', route: 'Oral' },
      ],
      prescription: [
        { medicine: 'Medicine A', dosage: '500mg', timing: 'After meal', duration: '7 days' },
      ],
      followUpDate: '2024-08-01',
      adviceGiven: 'Rest and hydration',
    }
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handlePhotoClick = () => {
    // Code to open phone camera or upload photo
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <div className="container">
      <h2>Patient Appointments</h2>
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Age</th>
            <th>City/Town</th>
            <th>Complaints</th>
            <th>Time</th>
            <th>Phone No.</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index} onClick={() => handleAppointmentClick(appointment)}>
              <td>{appointment.fullName}</td>
              <td>{appointment.age}</td>
              <td>{appointment.city}</td>
              <td>{appointment.complaints}</td>
              <td>{appointment.time}</td>
              <td>{appointment.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAppointment && (
        <div className="appointment-details">
          <div className="details-header">
            <div className="details-info">
              <h3>{selectedAppointment.fullName}</h3>
              <p>Age: {selectedAppointment.age}</p>
              <p>Gender: {selectedAppointment.gender}</p>
              <p>City/Town: {selectedAppointment.city}</p>
              <p>Complaints: {selectedAppointment.complaints}</p>
              <p>Time: {selectedAppointment.time}</p>
              <p>Phone Number: {selectedAppointment.phoneNumber}</p>
            </div>
            <div className="details-photo">
              <button onClick={handlePhotoClick}>Upload Photo</button>
              {/* Optionally display photo if available */}
              {selectedAppointment.photo && <img src={selectedAppointment.photo} alt="Patient Photo" />}
            </div>
          </div>

          <div className="vitals">
            <h4>Vitals</h4>
            <label>
              <input type="checkbox" /> Vital 1
            </label>
            <label>
              <input type="checkbox" /> Vital 2
            </label>
            {/* Add more vitals as needed */}
          </div>

          <div className="health-history">
            <h4>Health History</h4>
            <div className="history-boxes">
              <div className="box">Major Complaints: {selectedAppointment.majorComplaints}</div>
              <div className="box">Local Examination: {selectedAppointment.localExamination}</div>
              <div className="box">Diagnosis: {selectedAppointment.diagnosis}</div>
            </div>
          </div>

          <div className="history-boxes">
            <div className="box">Family History: {selectedAppointment.familyHistory}</div>
            <div className="box">Birth History: {selectedAppointment.birthHistory}</div>
            <div className="box">Surgical History: {selectedAppointment.surgicalHistory}</div>
            <div className="box">Any Other History: {selectedAppointment.anyOtherHistory}</div>
          </div>

          <br></br><br></br>

          <div className="examinations">
            <div className="box">On Examination: {selectedAppointment.onExamination}</div>
            <div className="box">Systematic Examination: {selectedAppointment.systematicExamination}</div>
          </div>

          <div className="reports">
            <h4>Reports</h4>
            <div className="report-boxes">
              <div className="box">{selectedAppointment.reports}</div>
            </div>
          </div>

          <div className="treatment-table">
            <h4>Treatment Given</h4>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dosage</th>
                  <th>Route of Administration</th>
                </tr>
              </thead>
              <tbody>
                {selectedAppointment.treatmentGiven.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.dosage}</td>
                    <td>{item.route}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prescription-table">
            <h4>Prescription</h4>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Timing</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {selectedAppointment.prescription.map((item, index) => (
                  <tr key={index}>
                    <td>{item.medicine}</td>
                    <td>{item.dosage}</td>
                    <td>{item.timing}</td>
                    <td>{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="follow-up">
            <p>Follow Up Date: {selectedAppointment.followUpDate}</p>
            <p>Advice Given: {selectedAppointment.adviceGiven}</p>
          </div>

          <div className="view-options">
            <button className="btn">View Prescription</button>
            <button className="btn">View Test Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
