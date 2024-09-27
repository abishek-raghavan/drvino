import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BusinessList({ onBusinessClick }) {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetchBusinessNames();
  }, []);

  const fetchBusinessNames = async () => {
    try {
      // Retrieve the loginlocation from URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const loginLocation = urlParams.get('loginlocation');
      
      // Make the request with the loginlocation parameter
      const response = await axios.get(`http://localhost:8081/today?loginlocation=${loginLocation}`);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching business names:', error);
    }
  };

  return (
    <div>
      <h2>Businesses</h2>
      <ul>
        {businesses.map((business, index) => (
          <li key={index} onClick={() => onBusinessClick(business)}>
            {business}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BusinessDetails({ selectedBusiness }) {
  return (
    <div>
      <h2>Business Details</h2>
      <table>
        <tbody>
          <tr>
            <td>Business Name:</td>
            <td>{selectedBusiness}</td>
          </tr>
          {/* Add more rows for other details */}
        </tbody>
      </table>
    </div>
  );
}

function Spanco() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
  };

  return (
    <div>
      <BusinessList onBusinessClick={handleBusinessClick} />
      {selectedBusiness && <BusinessDetails selectedBusiness={selectedBusiness} />}
    </div>
  );
}

export default Spanco;
