import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import myImage from './Visual Planet.png';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import './Admin.css';

function Choosecatpo() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  const [file, setFile] = useState();
  const [sigfile, setSigFile] = useState();

  const handleUpload = () => {
    const formdata = new FormData();
    formdata.append('image', file);
    axios.post('http://localhost:8081/upload', formdata)
      .then(res => {
        if (res.data.Status === "Success") {
          console.log("Succeeded");
          // Show sweet alert on success
          Swal.fire({
            icon: 'success',
            title: 'Seal Changed',
            text: 'Seal has been changed successfully!',
          });
        } else {
          console.log("Failed");
        }
      })
      .catch(err => console.log(err))
  };

  const handleSigUpload = () => {
    const sigformdata = new FormData();
    sigformdata.append('image', sigfile);
    axios.post('http://localhost:8081/sigupload', sigformdata)
      .then(res => {
        if (res.data.Status === "Success") {
          console.log("Succeeded");
          // Show sweet alert on success
          Swal.fire({
            icon: 'success',
            title: 'Signature Changed',
            text: 'Signature has been changed successfully!',
          });
        } else {
          console.log("Failed");
        }
      })
      .catch(err => console.log(err))
  };

  const handlesigFile = (e) => {
    setSigFile(e.target.files[0])
  };
  const handleFile = (e) => {
    setFile(e.target.files[0])
  };

  return (
    <>
   
      <div className='admin-container2'>
        <div className='admin-panel'>
          <div className='admin-buttons'>
          <Link to={`/managecatpo?loginlocation=${username}`} className='btn-default'>Complaints</Link>
              <Link to={`/managecatpo1?loginlocation=${username}`} className='btn-default'> Vitals</Link>
              <Link to={`/managecatpo2?loginlocation=${username}`} className='btn-default'> On Examination</Link>
              <Link to={`/managecatpo3?loginlocation=${username}`} className='btn-default'> Systematic Examination</Link>
              <Link to={`/managecatpo4?loginlocation=${username}`} className='btn-default'> Tests</Link>
              <Link to={`/managecatpo5?loginlocation=${username}`} className='btn-default'> Treatment Given</Link>
              <Link to={`/managecatpo6?loginlocation=${username}`} className='btn-default'> Drugs</Link>
              <Link to={`/managecatpo7?loginlocation=${username}`} className='btn-default'> Dosage</Link>
              <Link to={`/managecatpo8?loginlocation=${username}`} className='btn-default'> Timing</Link>
              <Link to={`/managecatpo9?loginlocation=${username}`} className='btn-default'> Duration</Link>
              <Link to={`/managecatpo10?loginlocation=${username}`} className='btn-default'> Advice Given</Link>
              <Link to={`/managecatpo11?loginlocation=${username}`} className='btn-default'> Vaccine</Link>

            <div className='file-input-container'>
              <input type="file" name="image" onChange={handleFile} />
              <button type="button" className="btn btn-primary" onClick={handleUpload}>
                Change Seal
              </button>
            </div>
            <div className='file-input-container'>
              <input type="file" name="image" onChange={handlesigFile} />
              <button type="button" className="btn btn-primary" onClick={handleSigUpload}>
                Change Signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Choosecatpo;
