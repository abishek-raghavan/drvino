import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import myImage from './Visual Planet.png';
import Swal from 'sweetalert2';

import './Signup.css';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

function Signup() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    district: '', // Changed from loginLocation to district
    password: '',
    state: '',
    country: '',
    area: ''
  });

  const [errors, setErrors] = useState({});
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [districtSuggestions, setDistrictSuggestions] = useState([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);
  
  const countryInputRef = useRef(null);
  const stateInputRef = useRef(null);
  const districtInputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      countryInputRef.current &&
      !countryInputRef.current.contains(event.target) &&
      !event.target.classList.contains('suggestions')
    ) {
      setShowCountrySuggestions(false);
    }
    if (
      stateInputRef.current &&
      !stateInputRef.current.contains(event.target) &&
      !event.target.classList.contains('suggestions')
    ) {
      setShowStateSuggestions(false);
    }
    if (
      districtInputRef.current &&
      !districtInputRef.current.contains(event.target) &&
      !event.target.classList.contains('suggestions')
    ) {
      setShowDistrictSuggestions(false);
    }
  };

  const fetchSuggestions = async (type, input) => {
    try {
      const response = await axios.get(`http://localhost:8081/suggestions/${type}`, {
        params: { input }
      });
  
      let filteredSuggestions = response.data;
  
      // Filter out "admin" from the suggestions if the type is country, state, or district
      if (type === 'countries' || type === 'states' || type === 'districts') {
        filteredSuggestions = filteredSuggestions.filter(suggestion => suggestion.toLowerCase() !== 'admin');
      }
  
      switch (type) {
        case 'countries':
          setCountrySuggestions(filteredSuggestions);
          setShowCountrySuggestions(true);
          break;
        case 'states':
          setStateSuggestions(filteredSuggestions);
          setShowStateSuggestions(true);
          break;
        case 'districts':
          setDistrictSuggestions(filteredSuggestions);
          setShowDistrictSuggestions(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${type} suggestions:`, error);
    }
  };



const handleSubmit = async (event) => {
  event.preventDefault();
  setErrors(Validation(values));
  
  try {
    const res = await axios.get(`http://localhost:8081/checkusername/${values.name}`);
    if (res.data.exists) {
      setErrors({ name: 'Username already exists' });
    } else {
      const formData = {
        ...values
      };
      const response = await axios.post('http://localhost:8081/signup', formData);
      // Show sweet alert after successful signup
      Swal.fire({
        icon: 'success',
        title: 'Created.!',
        text: 'You have successfully created a user.',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect or perform any other action after the user clicks OK
          navigate(`/admin?loginlocation=${values.name}`);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

  

  const handleInput = async (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (name === 'country' && value) {
      fetchSuggestions('countries', value);
    } else if (name === 'state' && value) {
      fetchSuggestions('states', value);
    } else if (name === 'district' && value) {
      fetchSuggestions('districts', value);
    }
  };

  const handleSuggestionClick = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    switch (name) {
      case 'country':
        setShowCountrySuggestions(false);
        break;
      case 'state':
        setShowStateSuggestions(false);
        break;
      case 'district':
        setShowDistrictSuggestions(false);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className='admin-container'>
        <div className='admin-header'>
        <img src={myImage} alt="My Image" className="admin-panel-image" />

        </div>
      </div>
      <div className=''>
        <div className='d-flex justify-content-center align-items-center vh-100'>
          <div className='bg-white p-3 rounded inbg'>
            <h1 className='cen bus'>Create User</h1>
            <form action='' onSubmit={handleSubmit} className='signup-form'>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='name'><strong>Name</strong></label>
                  <input
                    type='text'
                    placeholder='Enter Name'
                    name='name'
                    value={values.name}
                    onChange={handleInput}
                    className='form-control rounded-0'
                  />
                  {errors.name && <span className='text-danger'>{errors.name}</span>}
                </div>
                <div className='form-group'>
                  <label htmlFor='password'><strong>Password</strong></label>
                  <input
                    type='password'
                    placeholder='Enter Password'
                    name='password'
                    value={values.password}
                    onChange={handleInput}
                    className='form-control rounded-0'
                  />
                  {errors.password && <span className='text-danger'>{errors.password}</span>}
                </div>
                <div className='form-group'>
                  <label htmlFor='country'><strong>Country</strong></label>
                  <input
                    type='text'
                    placeholder='Enter Country'
                    name='country'
                    value={values.country}
                    onChange={handleInput}
                    className='form-control rounded-0'
                  />
                  {showCountrySuggestions && (
                    <ul className='suggestions'>
                      {countrySuggestions.map((country, index) => (
                        <li key={index} onClick={() => handleSuggestionClick('country', country)}>
                          {country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className='form-group'>
                  <label htmlFor='area'><strong>Area</strong></label>
                  <input
                    type='text'
                    placeholder='Enter Area'
                    name='area'
                    value={values.area}
                    onChange={handleInput}
                    className='form-control rounded-0'
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group'>
                  <label htmlFor='state'><strong>State</strong></label>
                  <input
                    type='text'
                    placeholder='Enter State'
                    name='state'
                    value={values.state}
                    onChange={handleInput}
                    className='form-control rounded-0'
                  />
                  {showStateSuggestions && (
                    <ul className='suggestions'>
                      {stateSuggestions.map((state, index) => (
                        <li key={index} onClick={() => handleSuggestionClick('state', state)}>
                          {state}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className='form-group'>
                  <label htmlFor='district'><strong>District</strong></label>
                  <input
                    type='text'
                    placeholder='Enter District'
                    name='district'
                    value={values.district}
                    onChange={handleInput}
                    className='form-control rounded-0'
                  />
                  {showDistrictSuggestions && (
                    <ul className='suggestions'>
                      {districtSuggestions.map((district, index) => (
                        <li key={index} onClick={() => handleSuggestionClick('district', district)}>
                          {district}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className='form-group'>
                <button type='submit' className='btn btn-success w-100 rounded-3 btn'>
                  Create
                </button>
              </div>
              <div className='form-group'>
                <Link to='/manageusers' type='submit' className='btn btn-danger rounded-3 w-100 lbtn'>
                  Manage
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
