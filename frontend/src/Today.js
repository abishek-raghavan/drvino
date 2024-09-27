import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import myImage from './Visual Planet.png';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';

import './Today.css'; // Import Today.css file

function BusinessList({ onBusinessClick, businesses }) {
  return (
    <div className="container-fluid">
      <h2 className='bus'>Businesses</h2>
      <div className="table-responsive">
        <table className="table business-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Next Meeting</th>
              <th>Date of Project</th>
              <th>Spanco</th>
              <th>Phone Number</th>
              <th>Mail ID</th>
              <th>Business ID</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business, index) => (
              <tr key={index} onClick={() => onBusinessClick(business)}>
                <td>{business.businessname}</td>
                <td>{formatDate(business.dateofnextmeeting)}</td>
                <td>{formatDate(business.dateofproject)}</td>
                <td>{business.spanco}</td>
                <td>{business.contactnumber}</td>
                <td>{business. email}</td>
                <td>{business.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return '-';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.log("Invalid date:", dateString);
    return 'Invalid date';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

function BusinessDetails({ selectedBusiness }) {
  return (
    <div className="centered">
      <h2 className='bus'>Business Details</h2>
      <table>
        <tbody>
          <tr>
            <td className='bus'>Business Name:</td>
            <td>{selectedBusiness}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Today() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  const navigate = useNavigate();
  const filterRef = useRef(null); // Ref for the filter

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [spanco, setSpanco] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [productCounts, setProductCounts] = useState({});

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [spancoCount, setSpancoCount] = useState({
    Suspect: 0,
    Prospect: 0,
    Approach: 0,
    Negotiation: 0,
    Close: 0,
    Order: 0,
    Omission: 0
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Initially displayed

  const handleBusinessClick = (business) => {
    const businessname = encodeURIComponent(business.businessname);
    const id = encodeURIComponent(business.id);
    navigate(`/form?loginlocation=${username}&businessname=${businessname}&id=${id}`);
    setSelectedBusiness(business);
  };

  const handleSpancoChange = (event) => {
    setSpanco(event.target.value);
  };

  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
  };

  const handleToday = () => {
    setSelectedFromDate(new Date());
    setSelectedToDate(new Date());
  };

  const handleSearch = async () => {
    try {
      const formattedFromDate = selectedFromDate ? `${selectedFromDate.getFullYear()}-${String(selectedFromDate.getMonth() + 1).padStart(2, '0')}-${String(selectedFromDate.getDate()).padStart(2, '0')}` : '';
      const formattedToDate = selectedToDate ? `${selectedToDate.getFullYear()}-${String(selectedToDate.getMonth() + 1).padStart(2, '0')}-${String(selectedToDate.getDate()).padStart(2, '0')}` : '';
      const response = await axios.get(`http://localhost:8081/today?loginlocation=${username}&spanco=${spanco}&fromDate=${formattedFromDate}&toDate=${formattedToDate}&businessname=${businessName}`);
      setBusinesses(response.data);
      updateSpancoCount(response.data);
    } catch (error) {
      console.error('Error fetching business names:', error);
    }
  };

  const updateSpancoCount = (businessData) => {
    const spancoCounts = { ...spancoCount };
    Object.keys(spancoCounts).forEach(key => {
      spancoCounts[key] = 0;
    });
    businessData.forEach(business => {
      spancoCounts[business.spanco]++;
    });
    setSpancoCount(spancoCounts);
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
    setShowFilters(false); // Set showFilters to false when modal opens
    const spancoCounts = {};
    businesses.forEach(business => {
      if (business.spanco in spancoCounts) {
        spancoCounts[business.spanco]++;
      } else {
        spancoCounts[business.spanco] = 1;
      }
    });
    setSpancoCount(spancoCounts);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setBusinessName(suggestion);
    setShowSuggestions(false);
  };

  const handleProductClick = async (productName) => {
    try {
      const queryParams = {
        productName,
        username
      };
      if (productName) {
        queryParams.productName = productName;
      }
      if(username){
        queryParams.username=username;
      }
      const queryString = new URLSearchParams(queryParams).toString();
  
      const response = await axios.get(`http://localhost:8081/adminfollowproducttoday?${queryString}`);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching business names:', error);
    }
  };

  const handleUpdateMeetingDate = async () => {
    try {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
      // Send a request to update the meeting date
      await axios.put('http://localhost:8081/updateMeetingDate', {
        date: formattedDate
      });
  
      // Optionally, you can update the local state or trigger a re-fetch of data
      // based on your application requirements.
  
      // For example, refetch the data after updating the meeting date
      handleSearch();
  
      // Show success message using SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Meeting Date Updated!',
        text: 'The meeting date has been successfully updated.',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error updating meeting date:', error);
      // Show error message using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while updating the meeting date. Please try again later.',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    setBusinessName(inputValue);
    setShowSuggestions(inputValue.length > 0);

    try {
      const response = await axios.get(`http://localhost:8081/suggestBusinessNames?loginlocation=${username}&businessname=${inputValue}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching business name suggestions:', error);
    }
  };

  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/adminproductcountstoday?loginlocation=${username}`);
        setProductCounts(response.data);
      } catch (error) {
        console.error('Error fetching product counts:', error);
      }
    };
    fetchProductCounts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    // Function to handle click outside of filter to close it
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target) && !event.target.closest('.Todayfilter-toggle')) {
        setShowFilters(false);
      }
    };

    // Adding event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="Today centered">
        <div>
          <div className='admin-header'>
            <img src={myImage} alt="My Image" className="admin-panel-image" />
          </div> 
          <div className="product-buttons">
            {Object.entries(productCounts).map(([productName, count]) => (
              <button className='Afollowbutton' key={productName} onClick={() =>  handleProductClick(productName)}>
                {productName} - {count}
              </button>
            ))}
          </div>
        </div>
        
        <div className={`Todayfilter-toggle ${showFilters ? 'expanded' : ''}`} onClick={() => setShowFilters(prevState => !prevState)}>
          <div className='bggreen'>
          <FontAwesomeIcon icon={faFilter} />
          <span className=''>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </div>
        </div>
        {showFilters && (
          <div ref={filterRef} className="Todayfilter-container">
            <div className='inbody'>
              <div className='inbtn'>
                <label className='intext'>From Date:</label>
                <DatePicker selected={selectedFromDate} onChange={handleFromDateChange} />
                <label className='intext'>To Date:</label>
                <DatePicker selected={selectedToDate} onChange={handleToDateChange} />
                <label className='intext'>Spanco:</label>
                <select onChange={handleSpancoChange}>
                  <option value="">All</option>
                  <option value="Suspect">Suspect</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Approach">Approach</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Close">Close</option>
                  <option value="Order">Order</option>
                  <option value="Omission">Omission</option>
                </select>
                <label className='intext'>Business Name:</label>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <input
                    type="text"
                    value={businessName}
                    onChange={handleInputChange}
                  />
                  <ul className={`suggestions ${showSuggestions ? 'show' : 'hide'}`}>
                    {suggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => handleSuggestionClick(suggestion)} className="suggestion-item">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={handleSearch} className='btngreen Mbtm'>Search</button>
                <button onClick={handleOpenModal} className='btnblue'>View Spanco Count</button>
                <button onClick={handleUpdateMeetingDate} className='btnblue'>Update Meeting Date</button>
              </div>
            </div>
          </div>
        )}
        <BusinessList onBusinessClick={handleBusinessClick} businesses={businesses} />
        {selectedBusiness && <BusinessDetails selectedBusiness={selectedBusiness} />}
        <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} className="Modal">
          <h2>Spanco Counts</h2>
          <div>
            {Object.entries(spancoCount).map(([spancoType, count]) => (
              <p key={spancoType}>
                {spancoType}: {count}
              </p>
            ))}
          </div>
          <button onClick={handleCloseModal}>Close</button>
        </Modal>
      </div>
    </>
  );
}

export default Today;
