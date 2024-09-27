import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Add.css';

function Add() {
  const [values, setValues] = useState({
    complaints: '',
    vitals: '',
    examination: '',
    systemicExamination: '',
    tests: '',
    treatmentGiven: '',
    drugs: '',
    dosage: '',
    timing: '',
    duration: '',
    adviceGiven: '',
    vaccine: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    setErrors({}); // Clear errors when input changes
  };

  const handleSubmit = async (field, endpoint) => {
    if (!values[field]) {
      setErrors({ [field]: `${field} is required` });
      return;
    }
    
    try {
      const fieldMapping = {
        complaints: 'complaint',
        vitals: 'vital',
        examination: 'examination',
        systemicExamination: 'systemicExamination',
        tests: 'test',
        treatmentGiven: 'treatment',
        drugs: 'drug',
        dosage: 'dosage',
        timing: 'timing',
        duration: 'duration',
        adviceGiven: 'advice',
        vaccine: 'vaccine'
      };
    
      const response = await axios.post(`http://localhost:5000/add${endpoint}`, { 
        [fieldMapping[field]]: values[field] 
      });
      
      console.log('Response:', response); // Log the full response object
    
      if (response.data.message) {
        setSuccessMessage(`${field} added successfully`);
        setValues({ ...values, [field]: '' });
        
        Swal.fire({
          icon: 'success',
          title: `${field} Added`,
          text: response.data.message || `${field} added successfully!`
        });
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error adding data:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.'
      });
    }
  };
  
  
  return (
    <div className='addbg'>
      <div className='container'>
        <div className='form-container'>
          <h1 className='form-heading bus'>Add Medical Records</h1>
          <form className='form'>
            {/* Complaints */}
            <div className='form-group'>
              <label htmlFor="complaints">Complaints</label>
              <input type="text" placeholder='Enter Complaints' name='complaints'
                value={values.complaints} onChange={handleInputChange} className='form-control' />
              {errors.complaints && <span className='text-danger'>{errors.complaints}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('complaints', 'Complaints')}>Add Complaints</button>

            <div className='spacer'></div>

            {/* Vitals */}
            <div className='form-group'>
              <label htmlFor="vitals">Vitals</label>
              <input type="text" placeholder='Enter Vitals' name='vitals'
                value={values.vitals} onChange={handleInputChange} className='form-control' />
              {errors.vitals && <span className='text-danger'>{errors.vitals}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('vitals', 'Vitals')}>Add Vitals</button>

            <div className='spacer'></div>

            {/* On Examination */}
            <div className='form-group'>
              <label htmlFor="examination">On Examination</label>
              <input type="text" placeholder='Enter OE' name='examination'
                value={values.examination} onChange={handleInputChange} className='form-control' />
              {errors.examination && <span className='text-danger'>{errors.examination}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('examination', 'Examination')}>Add On Examination</button>

            <div className='spacer'></div>

            {/* Systemic Examination */}
            <div className='form-group'>
              <label htmlFor="systemicExamination">Systemic Examination</label>
              <input type="text" placeholder='Enter SE' name='systemicExamination'
                value={values.systemicExamination} onChange={handleInputChange} className='form-control' />
              {errors.systemicExamination && <span className='text-danger'>{errors.systemicExamination}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('systemicExamination', 'SystemicExamination')}>Add SE</button>

            <div className='spacer'></div>

            {/* Tests */}
            <div className='form-group'>
              <label htmlFor="tests">Tests</label>
              <input type="text" placeholder='Enter Tests' name='tests'
                value={values.tests} onChange={handleInputChange} className='form-control' />
              {errors.tests && <span className='text-danger'>{errors.tests}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('tests', 'Tests')}>Add Tests</button>

            <div className='spacer'></div>

            {/* Treatment Given */}
            <div className='form-group'>
              <label htmlFor="treatmentGiven">Treatment Given</label>
              <input type="text" placeholder='Enter TG' name='treatmentGiven'
                value={values.treatmentGiven} onChange={handleInputChange} className='form-control' />
              {errors.treatmentGiven && <span className='text-danger'>{errors.treatmentGiven}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('treatmentGiven', 'TreatmentGiven')}>Add TG</button>

            <div className='spacer'></div>

            {/* Drugs */}
            <div className='form-group'>
              <label htmlFor="drugs">Drugs</label>
              <input type="text" placeholder='Enter Drugs' name='drugs'
                value={values.drugs} onChange={handleInputChange} className='form-control' />
              {errors.drugs && <span className='text-danger'>{errors.drugs}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('drugs', 'Drugs')}>Add Drugs</button>

            <div className='spacer'></div>

            {/* Dosage */}
            <div className='form-group'>
              <label htmlFor="dosage">Dosage</label>
              <input type="text" placeholder='Enter Dosage' name='dosage'
                value={values.dosage} onChange={handleInputChange} className='form-control' />
              {errors.dosage && <span className='text-danger'>{errors.dosage}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('dosage', 'Dosage')}>Add Dosage</button>

            <div className='spacer'></div>

            {/* Timing */}
            <div className='form-group'>
              <label htmlFor="timing">Timing</label>
              <input type="text" placeholder='Enter Timing' name='timing'
                value={values.timing} onChange={handleInputChange} className='form-control' />
              {errors.timing && <span className='text-danger'>{errors.timing}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('timing', 'Timing')}>Add Timing</button>

            <div className='spacer'></div>

            {/* Duration */}
            <div className='form-group'>
              <label htmlFor="duration">Duration</label>
              <input type="text" placeholder='Enter Duration' name='duration'
                value={values.duration} onChange={handleInputChange} className='form-control' />
              {errors.duration && <span className='text-danger'>{errors.duration}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('duration', 'Duration')}>Add Duration</button>

            <div className='spacer'></div>

            {/* Advice Given */}
            <div className='form-group'>
              <label htmlFor="adviceGiven">Advice Given</label>
              <input type="text" placeholder='Enter Advice' name='adviceGiven'
                value={values.adviceGiven} onChange={handleInputChange} className='form-control' />
              {errors.adviceGiven && <span className='text-danger'>{errors.adviceGiven}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('adviceGiven', 'AdviceGiven')}>Add Advice</button>

            <div className='spacer'></div>

            {/* Vaccine */}
            <div className='form-group'>
              <label htmlFor="vaccine">Vaccine</label>
              <input type="text" placeholder='Enter Vaccine' name='vaccine'
                value={values.vaccine} onChange={handleInputChange} className='form-control' />
              {errors.vaccine && <span className='text-danger'>{errors.vaccine}</span>}
            </div>
            <button type='button' className='btngreen' onClick={() => handleSubmit('vaccine', 'Vaccine')}>Add Vaccine</button>

            <div className='spacer'></div>

            {successMessage && <div className='text-danger mt-1 notification'>{successMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add;
