import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Login.css';
import myImage from './Visual Planet.png';
import Validation from './LoginValidation';

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    loginLocation: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [fullSuggestions, setFullSuggestions] = useState([]);  // Store full list of suggestions
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8081/adminloginlocations')
      .then(res => {
        setFullSuggestions(res.data);  // Set full list of suggestions on fetch
      })
      .catch(err => console.log(err));
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  
    if (name === 'loginLocation') {
      setShowSuggestions(true);
      if (value.trim() === '') {
        setCountrySuggestions([]);
      } else {
        setCountrySuggestions(
          fullSuggestions.filter(location => 
            location.toLowerCase().includes(value.toLowerCase())
          )
        );
      }
    }
  };
  

  const handleSuggestionClick = (suggestion) => {
    setValues(prev => ({ ...prev, loginLocation: suggestion }));
    setShowSuggestions(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));

    axios.post('http://localhost:5000/login', values)
      .then(res => {
        if (res.data.success) {
          const { id, country, state, district, area, sessionId } = res.data;
          document.cookie = `sessionId=${sessionId}; path=/`;
          if (values.loginLocation === 'admin') {
            navigate(`/admin?loginlocation=${values.loginLocation}&id=${id}&country=${country}&state=${state}&district=${district}&area=${area}`);
          } else {
            navigate(`/home?loginlocation=${values.loginLocation}&id=${id}&country=${country}&state=${state}&district=${district}&area=${area}`);
          }
          Swal.fire({
            icon: 'success',
            title: 'Logged In Successfully!',
            text: 'Welcome to Virtual Planet!',
          });
        } else {
          handleErrorResponse(res);
        }
      })
      .catch(err => {
        if (err.response) {
          handleErrorResponse(err.response);
        } else {
          console.log('Error:', err.message);
        }
      });
  };

  function handleErrorResponse(response) {
    const { status, data } = response;
    if (status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'Please check your password!',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred, please try again.',
      });
    }
  }

  return (
    <div className='head'>
      <div className='d-flex justify-content-center align-items-center '>
        <div className='bg-white p-3 rounded inbg'>
          <div className='admin-header'>
            <img src={myImage} alt="My Image" className="admin-panel-image" />
          </div> 
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor="loginLocation"><strong>Login Location</strong></label>
              <input
                type='text'
                name='loginLocation'
                value={values.loginLocation}
                onChange={handleInput}
                className='form-control rounded-0'
                placeholder='Enter Login Location'
              />
              {showSuggestions && countrySuggestions.length > 0 && (
                <ul className="suggestions">
                  {countrySuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</li>
                  ))}
                </ul>
              )}
              {errors.loginLocation && <span className='text-danger'>{errors.loginLocation}</span>}
            </div>
            <div className='mb-3'>
              <label htmlFor="password"><strong>Password</strong></label>
              <input type="password" placeholder='Enter Password' name='password' onChange={handleInput} className='form-control rounded-0' />
              {errors.password && <span className='text-danger'>{errors.password}</span>}
            </div>
            <button type='submit' className='w-100  login-btn'>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
