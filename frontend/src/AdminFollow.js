import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import './AdminFollow.css';
import myImage from './Visual Planet.png';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function BusinessList({ onBusinessClick, businesses }) {
  return (
    <div className="container-fluid">
      <h2 className='bus'></h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age / Gender</th>
              <th>City / Town</th>
              <th>Father's Name</th>
              <th>Complaint</th>
              <th>Phone Number</th>
              <th>Visit</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business, index) => (
              <tr key={index} onClick={() => onBusinessClick(business)}>
                <td className="hoverable" style={{ position: 'relative' }}>
                  <div className="business-name">{business.businessname}</div>
                  <div className="hover-info">
                    Next Meeting: {formatDate(business.dateofnextmeeting)}<br />
                    Spanco: {business.spanco}<br />
                    Contact Status: <span style={{ color: business.contact_status === 'Not Contacted' ? 'red' : 'rgb(54, 233, 4)' }}>{business.contact_status}</span>
                  </div>
                </td>
                <td>{formatDate(business.dateofnextmeeting)}</td>
                <td>{formatDate(business.dateofproject)}</td>
                <td>{business.spanco}</td>
                <td>{business.contactnumber}</td>
                <td>{business.email}</td>
                <td style={{ color: business.contact_status === 'Not Contacted' ? 'red' : 'rgb(54, 233, 4)' }}>
                  {business.contact_status}
                </td>
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

function BusinessDetails({ selectedBusiness }) {
  return (
    <div className="business-details">
      <h2>Business Details</h2>
      <p><strong>Name:</strong> {selectedBusiness.businessname}</p>
      <p><strong>Next Meeting:</strong> {formatDate(selectedBusiness.dateofnextmeeting)}</p>
      <p><strong>Spanco Stage:</strong> {selectedBusiness.spanco}</p>
      <p><strong>Phone Number:</strong> {selectedBusiness.email}</p>
      <p><strong>Business ID:</strong> {selectedBusiness.id}</p>
      {/* Add more details as needed */}
    </div>
  );
}

function AdminFollow() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  const id = searchParams.get('id');

  const navigate = useNavigate();

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [spanco, setSpanco] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [Location, setLocation] = useState('');
  const [Country, setCountry] = useState('');
  const [State, setState] = useState('');
  const [District, setDistrict] = useState('');
  const [Area, setArea] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [BusinessID, setBusinessID] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [BusinessName, setBusinessName] = useState('');
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

  const [filterClicked, setFilterClicked] = useState(false);
  const [inputFieldsVisible, setInputFieldsVisible] = useState(false);

  const filterRef = useRef(null);

  const handleBusinessClick = (business) => {
    const businessname = encodeURIComponent(business.businessname);
    const id = encodeURIComponent(business.id);
    navigate(`/adminform?loginlocation=${username}&businessname=${businessname}&id=${id}`);
    setSelectedBusiness(business);
  };

  const handleSpancoChange = (newValue) => {
    setSpanco(newValue); // Assuming you're using React state to manage the selected value
  };
  

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };


  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    // Reset state and district options when country changes
    setState('');
    setDistrict('');
        setArea('');

    // Fetch states based on selected country
    fetchStates(selectedCountry);
  };

  // const handleStateChange = (event) => {
  //   setState(event.target.value);
  // };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setState(selectedState);
    // Reset state and district options when country changes
    setDistrict('');
    setArea('');
    // Fetch states based on selected country
    fetchDistrict(selectedState);
  };

  

  // const handleDistrictChange = (event) => {
  //   setDistrict(event.target.value);
  // };

  const handleDistrictChange = (event) => {
    const selectedDistrict = event.target.value;
    setDistrict(selectedDistrict);
    // Reset state and district options when country changes
   
    setArea('');
    // Fetch states based on selected country
    fetchArea(selectedDistrict);
  };

  const handleCompanyChange = (event) => {
    setBusinessName(event.target.value);
  };

  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleBusinessIDChange = (event) => {
    setBusinessID(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };



  const filterBusinessesByToday = () => {
    const today = new Date();
    const filteredBusinesses = businesses.filter(business => {
      const businessDate = new Date(business.dateofnextmeeting);
      return businessDate.getDate() === today.getDate() &&
             businessDate.getMonth() === today.getMonth() &&
             businessDate.getFullYear() === today.getFullYear();
    });
    return filteredBusinesses;
  };

  const handleSearch = async () => {
    try {
      const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      const formattedFromDate = fromDate ? fromDate.toISOString().split('T')[0] : '';
      const formattedToDate = toDate ? toDate.toISOString().split('T')[0] : '';
  
      const queryParams = {
        loginlocation: username,
        spanco,
        Location,
        selectedDate: formattedDate,
        id,
        Country,
        State,
        District,
        Area,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        PhoneNumber,
        BusinessID,
        BusinessName
      };
  
      // Conditionally add productName to queryParams if it is defined
      const queryParamsCount = {
        Country,
        State,
        District,
        Area,
        Location // Include only relevant parameters for fetching product counts
      };
  
      const queryString = new URLSearchParams(queryParams).toString();
      const queryStringCount = new URLSearchParams(queryParamsCount).toString(); // Use queryParamsCount here
  
  
      const response = await axios.get(`http://localhost:8081/adminfollow?${queryString}`);
      setBusinesses(response.data);
  
      const productCounts = await fetchProductCounts(queryParamsCount);
      setProductCounts(productCounts);
    } catch (error) {
      console.error('Error fetching business names:', error);
    }
  };
  
  const handleOpenModal = () => {
    setModalIsOpen(true);
    
    const spancoCounts = {
      Suspect: 0,
      Prospect: 0,
      Approach: 0,
      Negotiation: 0,
      Close: 0,
      Order: 0,
      Omission: 0
    };
  
    businesses.forEach(business => {
      spancoCounts[business.spanco]++;
    });
  
    setSpancoCount(spancoCounts);
  };
  
  const handleCloseModal = () => {
    setModalIsOpen(false);
    setInputFieldsVisible();

  };

  const toggleInputFields = () => {
    setInputFieldsVisible(!inputFieldsVisible);
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

const handleFilterClick = () => {
    setFilterClicked(true);
    setInputFieldsVisible(true);
    handleSearch();
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setInputFieldsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchLoginLocations = async () => {
      try {
        const response = await axios.get('http://localhost:8081/adminloginlocations');
        setLocationOptions(response.data);
      } catch (error) {
        console.error('Error fetching login locations:', error);
      }
    };
    fetchLoginLocations();
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admincountires');
        setCountryOptions(response.data);
      } catch (error) {
        console.error('Error fetching login locations:', error);
      }
    };
    fetchCountry();
  }, []);


  
  // useEffect(() => {
  //   const fetchState = async (selectedCountry) => {
  //     try {
  //       const response = await axios.get(`http://localhost:8081/adminstates?country=${selectedCountry}`);
  //       setStateOptions(response.data);
  //     } catch (error) {
  //       console.error('Error fetching login locations:', error);
  //     }
  //   };
  //   fetchState();
  // }, []);


  const fetchStates = async (selectedCountry) => {
    try {
      const response = await axios.get(`http://localhost:8081/adminstates?country=${selectedCountry}`);
      setStateOptions(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };


  const fetchDistrict = async (selectedState) => {
    try {
      const response = await axios.get(`http://localhost:8081/admindistricts?state=${selectedState}`);
      setDistrictOptions(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  // useEffect(() => {
  //   const fetchDistrict = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8081/admindistricts');
  //       setDistrictOptions(response.data);
  //     } catch (error) {
  //       console.error('Error fetching login locations:', error);
  //     }
  //   };
  //   fetchDistrict();
  // }, []);

  

  

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admincompany');
        setCompanyOptions(response.data);
      } catch (error) {
        console.error('Error fetching login locations:', error);
      }
    };
    fetchCompany();
  }, []);




  const fetchArea = async (selectedDistrict) => {
    try {
      const response = await axios.get(`http://localhost:8081/adminareas?district=${selectedDistrict}`);
      setAreaOptions(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);


  const fetchProductCounts = async (queryParamsCount) => {
    try {
      const queryStringCount = new URLSearchParams(queryParamsCount).toString();
      const response = await axios.get(`http://localhost:8081/adminproductcounts?${queryStringCount}`);
      return response.data; // Return the response data to be handled in handleSearch
    } catch (error) {
      console.error('Error fetching product counts:', error);
      throw error; // Rethrow the error to be handled in handleSearch
    }
  };

  const handleProductClick = async (productName) => {
    try {
      const queryParams = {
        productName,
        Location,
        Country,
        State,
        District,
        Area
      }
      if (productName) {
        queryParams.productName = productName;
      }
      const queryString = new URLSearchParams(queryParams).toString();
  
  
      const response = await axios.get(`http://localhost:8081/adminfollowproduct?${queryString}`);
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching business names:', error);
    }
  };

  const handleExportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const fileName = 'business_data_detailed_summary';
  
    const spancoCounts = {};
    businesses.forEach(business => {
      spancoCounts[business.spanco] = (spancoCounts[business.spanco] || 0) + 1;
    });
  
    const summaryItems = businesses.map(business => ({
      ...business,
      'Spanco Count': spancoCounts[business.spanco] > 1 ? `${business.spanco} (${spancoCounts[business.spanco]})` : business.spanco
    }));
  
    const ws = XLSX.utils.json_to_sheet(summaryItems);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, fileName + fileExtension);
  };

  return (
    <>
    <div className='admin-header'>
    <img src={myImage} alt="My Image" className="admin-panel-image" />
    </div>
    <div className="centered">
      <h1 className='vp'>
          <span>
          </span>
        </h1>
      <div className="product-buttons">
        {Object.entries(productCounts).map(([productName, count]) => (
          <button className='AfollowbuttonP' key={productName} onClick={() =>  handleProductClick(productName)}>
            {productName} - {count}
          </button>
        ))}
      </div>
      <div className='inbody'>
        <div className='inbtn'>
          <Modal isOpen={inputFieldsVisible} onRequestClose={() => setInputFieldsVisible(false)} className="Modal_AdminFollow">
          <div ref={filterRef} className="label-input-container-wrapper">

            <div ref={filterRef} className="label-input-container">

            <label className='intext'>From Date:</label>
              <DatePicker selected={fromDate} onChange={handleFromDateChange} />
              <label className='intext'>To Date:</label>
              <DatePicker selected={toDate} onChange={handleToDateChange} />
              <label className='intext'>Date of Next Meeting:</label>
              <DatePicker selected={selectedDate} onChange={handleDateChange} />

              <label className='intext'>Country</label>
              <select value={Country}className="input_AdminFollow" onChange={handleCountryChange}>
                <option value="">All</option>
                {countryOptions
                  .filter(option => option !== 'admin')
                  .map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
              </select>

              <label className='intext'>State</label>
              <select className="input_AdminFollow" value={State} onChange={handleStateChange}>
                <option value="">All</option>
                {stateOptions
                  .filter(option => option !== 'admin')
                  .map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
              </select>
              <label className='intext'>District</label>
              <select className="input_AdminFollow" value={District} onChange={handleDistrictChange}>
                <option value="">All</option>
                {districtOptions
                  .filter(option => option !== 'admin')
                  .map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
              </select>

              <label className='intext'>Area</label>
              <select className="input_AdminFollow" value={Area} onChange={handleAreaChange}>
                <option value="">All</option>
                {areaOptions
                  .filter(option => option !== 'admin')
                  .map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
              </select>

              

              <div className='intext'>Spanco:</div>
<div className="input_AdminFollow">
  <button className={spanco === "" ? "selected" : ""} onClick={() => handleSpancoChange("")}>
    All {spancoCount[""] === undefined ? "- 0" : `${spancoCount[""]}`}
  </button>
  <button className={spanco === "Suspect" ? "selected" : ""} onClick={() => handleSpancoChange("Suspect")}>
    Suspect {spancoCount["Suspect"] === undefined ? "- 0" : `- ${spancoCount["Suspect"]}`}
  </button>
  <button className={spanco === "Prospect" ? "selected" : ""} onClick={() => handleSpancoChange("Prospect")}>
    Prospect {spancoCount["Prospect"] === undefined ? "- 0" : `- ${spancoCount["Prospect"]}`}
  </button>
  <button className={spanco === "Approach" ? "selected" : ""} onClick={() => handleSpancoChange("Approach")}>
    Approach {spancoCount["Approach"] === undefined ? "- 0" : `- ${spancoCount["Approach"]}`}
  </button>
  <button className={spanco === "Negotiation" ? "selected" : ""} onClick={() => handleSpancoChange("Negotiation")}>
    Negotiation {spancoCount["Negotiation"] === undefined ? "- 0" : `- ${spancoCount["Negotiation"]}`}
  </button>
  <button className={spanco === "Close" ? "selected" : ""} onClick={() => handleSpancoChange("Close")}>
    Close {spancoCount["Close"] === undefined ? "- 0" : `- ${spancoCount["Close"]} `}
  </button>
  <button className={spanco === "Order" ? "selected" : ""} onClick={() => handleSpancoChange("Order")}>
    Order {spancoCount["Order"] === undefined ? "- 0" : `- ${spancoCount["Order"]}`}
  </button>
  <button className={spanco === "Omission" ? "selected" : ""} onClick={() => handleSpancoChange("Omission")}>
    Omission {spancoCount["Omission"] === undefined ? "- 0" : `- ${spancoCount["Omission"]}`}
  </button>
</div>



            <label className='intext'>LoginLocation</label>
              <select value={Location} className="input_AdminFollow" onChange={handleLocationChange}>
                <option value="">All</option>
                {locationOptions
                  .filter(option => option !== 'admin')
                  .map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
              </select>





              <label className='intext'>Business Name</label>
              <select className="input_AdminFollow" value={BusinessName} onChange={handleCompanyChange}>
                <option value="">All</option>
                {companyOptions
                  .filter(option => option !== 'admin')
                  .map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
              </select>

              <label className='intext'>Phone Number:</label>
              <input className="input_AdminFollow" type="text" value={PhoneNumber} onChange={handlePhoneNumberChange} />

              <label className='intext'>Business ID:</label>
              <input className="input_AdminFollow" type="text" value={BusinessID} onChange={handleBusinessIDChange} />

              <button className='inlabel Afollowbuttonsearch' onClick={() => {handleSearch();handleCloseModal();}}>Apply  </button>

              {/* View Spanco Count button */}
              <button className='inlabel Afollowbuttonspanco' onClick={handleOpenModal}>View Spanco Count</button>

              {/* Export to Excel button */}
              <button className='inlabel Afollowbuttonexcel' onClick={handleExportToExcel}>Export to Excel</button>

              <button className='inlabel btndelete' onClick={handleCloseModal}>close</button>

            </div>
            </div>
            {filterClicked && <button className='inlabel Afollowbutton' onClick={() => setInputFieldsVisible(false)}>Filter</button>}
          </Modal>
          <button className='Afollowbuttonsearch' onClick={toggleInputFields}>
          <FontAwesomeIcon icon={faFilter} />

            Show Filters
          </button>
          <button className='inlabel Afollowbuttonspanco' onClick={handleOpenModal}>View Spanco Count</button>


        </div>
      </div>
      <BusinessList onBusinessClick={handleBusinessClick} businesses={businesses} />
      {selectedBusiness && <BusinessDetails selectedBusiness={selectedBusiness} />}
      {/* Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} className="SpancoModal">
  <h2>Spanco Counts</h2>
  <div>
    {Object.entries(spancoCount).map(([spancoStage, count]) => (
      <p key={spancoStage}>{spancoStage}: {count}</p>
    ))}
  </div>
  <button className="close-btn" onClick={handleCloseModal}>Close</button>
</Modal>


    </div>
    </>
  );
}


export default AdminFollow;