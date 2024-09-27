import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { Modal, Button } from 'react-bootstrap';
import logoImage from './images/Visual-Planet-Letterpad.jpeg';
import Swal from 'sweetalert2';


const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

function Form() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  const selectedBusiness = searchParams.get('businessname');
  const selectedid = searchParams.get('id');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [positions, setPositions] = useState([]);
  const [pdfContent, setPdfContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [sealImage, setSealImage] = useState(null);
  const [sealImageUrl, setSealImageUrl] = useState('');
  const [idata, setIdata] = useState([]);


  useEffect(()=>{
    axios.get(`http://localhost:8081/getseal`)
    .then(res=>{
      setIdata(res.data[0])
    })
    .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:8081/adminform?loginlocation=${username}&businessname=${selectedBusiness}&id=${selectedid}`)
      .then(response => {
        const data = response.data;
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [username, selectedBusiness]);

  useEffect(() => {
    axios.get(`http://localhost:8081/newcat`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
      
    axios.get(`http://localhost:8081/newp`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    axios.get(`http://localhost:8081/positions`)
      .then(response => {
        setPositions(response.data);
      })
      .catch(error => {
        console.error('Error fetching positions:', error);
      });
  }, []);

  

  const handleInputChange = (index, fieldName, value) => {
    const updatedData = [...data];
    updatedData[index][fieldName] = value;
    setData(updatedData);
  };

  const handleUpdate = async () => {
    try {
      const isEmpty = data.some(row => Object.values(row).some(value => value === ''));
  
      if (isEmpty) {
        alert('Please fill in all fields before updating.');
        return;
      }
  
      await Promise.all(data.map(async (row) => {
        const newData = {
          businessname: row.businessname,
          category: row.category,
          product: row.product,
          contactperson: row.contactperson,
          position: row.position,
          contactnumber: row.contactnumber,
          whatsappnumber: row.whatsappnumber,
          spanco: row.spanco,
          dateofnextmeeting: row.dateofnextmeeting,
          dateofproject: row.dateofproject,
          modeofpayment: row.modeofpayment,
          email: row.email,
          initialpayment: row.initialpayment
        };
  
        await axios.put(`http://localhost:8081/adminupdate?loginlocation=${username}&businessname=${selectedBusiness}&id=${selectedid}`, { id: row.id, newData: newData });
      }));
  
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data updated successfully!',
      });
    } catch (error) {
      console.error('Error updating data:', error);
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update data. Please try again later.',
      });
    }
  };
  
  const handleDelete = async () => {
    // Show confirmation dialog before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/admindelete?loginlocation=${username}&businessname=${selectedBusiness}&id=${selectedid}`);
          // Show success alert
          Swal.fire('Deleted!', 'Data deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting data:', error);
          // Show error alert
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to delete data. Please try again later.',
          });
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const handleSetDefaultNote = () => {
    const defaultNote = [
      "01. Project will be Finished & Submited with 7 days once the form is filled",
      "02. 3 Free Updation (Change of Phone number, Content, email ID, No Change in Designs)",
      "03. 50% of Amount have to be dispersed on the day of Project",
      "04. No Change in the Website Template as it is totally free of Cost",
      "05. Drone Shots has to be checked on the date of Flying and add your shots on the day of flying & for no reasons we wilt do the drone shots will be taken on the fixed package"
    ].join('\n');
  
    setNoteText(defaultNote);
  };
  const generatePDF = async () => {
    try {
        const doc = new jsPDF();
        const lineSpacing = 10;
        const margin = 10;
        const maxWidth = doc.internal.pageSize.width - 2 * margin;

        // Load your background image
        const backgroundImageUrl = logoImage; // Replace 'url_to_your_background_image.jpg' with the URL of your background image
        const backgroundImage = await loadImage(backgroundImageUrl);

        // Iterate over each row in data array
        for (const [index, row] of data.entries()) {
            // Fetch product details from the backend based on the product name
            const productDetailsResponse = await axios.get(`http://localhost:8081/productDetails/${row.product}`);
            const productDetails = productDetailsResponse.data;
            const sealResponse = await axios.get('http://localhost:8081/getseal');
            const sealData = sealResponse.data.result;

            const sigResponse = await axios.get('http://localhost:8081/getsig');
            const sigData = sigResponse.data.result;

            // Calculate final price based on product price, discount, and initial payment
            const finalPrice = calculateFinalPrice(productDetails.Product_Price, productDetails.Product_Discount, row.initialpayment);
            const Note = productDetails.Note;

            // Add new page for each row
            if (index !== 0) {
                doc.addPage();
            }
            const defaultFontSize = doc.internal.getFontSize(); // Get the default font size
            // Add background image to the page
            doc.addImage(backgroundImage, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);
            doc.setFontSize(13);

            // Display details for each row in the PDF
            doc.setTextColor('black');
            doc.text(`Business Name: ${row.businessname} (${row.category})`, margin, margin + lineSpacing * 8.5);
            doc.text(`Business ID: ${selectedid}`, margin * 15.2, margin + lineSpacing * 8.5);
            doc.text(`Contact Person: ${row.contactperson} (${row.position})`, margin, margin + lineSpacing * 9);
            doc.text(`Product Name: ${row.product}`, margin, margin + lineSpacing * 10);
            doc.text(`Product Price: ${productDetails.Product_Price}/-`, margin, margin + lineSpacing * 10.5);
            doc.text(`Discount: ${productDetails.Product_Discount}% (Valid only for 7 days)`, margin, margin + lineSpacing * 11);
            
            // Conditionally display "Amount Paid" if it is not zero
            if (row.initialpayment !== 0) {
                doc.text(`Amount Paid: ${row.initialpayment}`, 10, margin + lineSpacing * 13);
            }
            
            doc.text(`Terms & Conditions`, 10, margin + lineSpacing * 19);
            // Display final price in red and centered
            const finalPriceText = `Final Price: ${finalPrice}/-`;

            const finalPriceWidth = doc.getStringUnitWidth(finalPriceText) * defaultFontSize / doc.internal.scaleFactor;
            const finalPriceX = (doc.internal.pageSize.width - finalPriceWidth) / 16;
            doc.setFontSize(13);

            // Set the font size
            doc.setTextColor(0, 20, 167); // Set text color to red
            doc.text(finalPriceText, finalPriceX, margin + lineSpacing * 11.5);
            doc.setFontSize(defaultFontSize); // Set the font size back to default
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            // Set text color back to default

            // Display note text below each row
            const noteLines = doc.splitTextToSize(Note, maxWidth); // Split note text into lines that fit within maxWidth
            doc.text(noteLines, margin, margin + lineSpacing * 20, { align: 'left' }); // Render note text with responsive wrapping
            // Add seal image at the bottom center of the page if available
            const sealImageX = 70;
            const sealImageY = 150;
            const sealImageWidth = 80;
            const sealImageHeight = 30;
            const sealRotationAngle = 20; // Adjust the rotation angle as needed
            
            doc.addImage(`http://localhost:8081/images/` + sealData[0].image, 'PNG', sealImageX, sealImageY, sealImageWidth, sealImageHeight, '', 'FAST', sealRotationAngle);            
            doc.addImage(`http://localhost:8081/images/` + sigData[0].image, 'PNG', 150, 160, 55, 20);

            // Add signature and seal text
            doc.setTextColor(0, 0, 0); // Set text color back to black
            doc.text(`Signature & Seal`, doc.internal.pageSize.width - margin - 30, doc.internal.pageSize.height - margin * 11.5);

            // Add date to the bottom right corner
            doc.setFontSize(13);

            const today = new Date();
            const dateString = `DATE: ${today.toLocaleDateString()}`;
            const dateWidth = doc.getStringUnitWidth(dateString) * defaultFontSize / doc.internal.scaleFactor;
            const dateX = doc.internal.pageSize.width - margin - dateWidth;
            doc.text(dateString, dateX, doc.internal.pageSize.height - margin *22);
            doc.setFontSize(13);

            // Move to the next page if there are more rows
            if (index !== data.length - 1) {
                doc.addPage();
            }
        }

        // Save PDF content and show modal
        const pdfContent = doc.output('datauristring');
        setPdfContent(pdfContent);
        setShowModal(true);
        handleDownload();
    } catch (error) {
      
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again later.');
    }
};

  
  
  

  const handleCloseModal = () => {
    setPdfContent('');
    setShowModal(false);
  };

  const handleDownload = () => {
    const byteCharacters = atob(pdfContent.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
  
    // Extract business name
    const businessName = data[0]?.businessname || 'order';
    const filename = `${businessName} order copy.pdf`;
  
    // Initiate download with specified filename
    saveAs(blob, filename);
  };
  

  // Define the base64toBlob function
const base64toBlob = (base64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};


const handleShare = () => {
  if (!pdfContent) {
    alert('Invalid PDF content. Please generate the PDF first.');
    return;
  }

  const pdfBase64 = pdfContent.split(',')[1];

  const pdfBlob = base64toBlob(pdfBase64, 'application/pdf');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const whatsappNumber = data[0]?.whatsappnumber;
  if (!whatsappNumber) {
    alert('Please provide a WhatsApp number in the form before sharing.');
    return;
  }

  let formattedWhatsAppNumber = whatsappNumber;
  if (!whatsappNumber.startsWith('+')) {
    formattedWhatsAppNumber = '+91' + whatsappNumber;
  }

  const whatsappUrl = `https://wa.me/${formattedWhatsAppNumber}?text=${encodeURIComponent('Please find the PDF attached.')}`;

  try {
    window.open(whatsappUrl);
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    alert('Failed to share PDF via WhatsApp. Please try again later.');
  }
};




const calculateFinalPrice = (productPrice, discountPercentage, initialPayment) => {
  const discountedPrice = productPrice * (1 - discountPercentage / 100);
  const finalPrice = discountedPrice - initialPayment;
  return finalPrice.toFixed(2); // Return the final price formatted to two decimal places
};


  const handleImageLoad = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  return (
    <div className='formbg'>
    <div className='d-flex justify-content-center align-items-center Box'>
      <div className="bg-white box">
      <h1 className='bus'>Business Form</h1>

        {data.map((row, index) => (
          <div className="input-container" key={index}>
            <div className="form-group">
              <label>Business Name:</label>
              <input type="text" className="form-control" value={row.businessname} onChange={e => handleInputChange(index, 'businessname', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <select className="form-control" value={row.category} onChange={e => handleInputChange(index, 'category', e.target.value)}>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Product:</label>
              <select className="form-control" value={row.product} onChange={e => handleInputChange(index, 'product', e.target.value)}>
                {products.map((product, index) => (
                  <option key={index} value={product}>{product}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Contact Person:</label>
              <input type="text" className="form-control" value={row.contactperson} onChange={e => handleInputChange(index, 'contactperson', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Position:</label>
              <select className="form-control" value={row.position} onChange={e => handleInputChange(index, 'position', e.target.value)}>
                {positions.map((position, index) => (
                  <option key={index} value={position}>{position}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Contact Number:</label>
              <div className="input-group">
                <input type="text" className="form-control" value={row.contactnumber} onChange={e => handleInputChange(index, 'contactnumber', e.target.value)} />
                <div className="input-group-append">
                  <a href={`tel:${row.contactnumber}`} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon className="phone-icon" icon={faPhone} />
                  </a>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>WhatsApp Number:</label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  value={row.whatsappnumber} 
                  onChange={e => handleInputChange(index, 'whatsappnumber', e.target.value)} 
                />
                <div className="input-group-append">
                  <a 
                    href={`https://wa.me/91${row.whatsappnumber}`} // Added "91" before the number
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon className="whatsapp-icon" icon={faWhatsapp} />
                  </a>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                className="form-control" 
                value={row.email} 
                onChange={e => handleInputChange(index, 'email', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Spanco:</label>
              <select className="form-control" value={row.spanco} onChange={e => handleInputChange(index, 'spanco', e.target.value)}>
                <option value="Suspect">Suspect</option>
                <option value="Prospect">Prospect</option>
                <option value="Approach">Approach</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Close">Close</option>
                <option value="Order">Order</option>
                <option value="Omission">Omission</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Next Meeting:</label>
              <DatePicker 
                className="form-control" 
                selected={row.dateofnextmeeting ? new Date(formatDate(row.dateofnextmeeting)) : null} 
                onChange={date => handleInputChange(index, 'dateofnextmeeting', date)} 
                dateFormat="dd/MM/yyyy" // Specify the date format
                placeholderText="Select Date"
              />
            </div>
            <div className="form-group">
              <label>Date of Project:</label>
              <DatePicker 
                className="form-control" 
                selected={row.dateofproject ? new Date(formatDate(row.dateofproject)) : null} 
                onChange={date => handleInputChange(index, 'dateofproject', date)} 
                dateFormat="dd/MM/yyyy" // Specify the date format
                placeholderText="Select Date"
              />
            </div>
                    <div className="form-group">
          <label htmlFor="modeOfPayment">Mode of Payment:</label>
          <select
            className="form-control"
            id="modeOfPayment"
            value={row.modeofpayment}
            onChange={(e) => handleInputChange(index, 'modeofpayment', e.target.value)}
          >
            <option value="">Select Mode of Payment</option>
            <option value="EMI">EMI</option>
            <option value="Full Cash">Full Cash</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
        <div className="form-group">
              <label>Amount Paid: </label>
              <input 
                type="text" 
                className="form-control" 
                value={row.initialpayment} 
                onChange={e => handleInputChange(index, 'initialpayment', e.target.value)} 
              />
            </div>

          </div>
        ))}
        <div className="button-container">
          <button className='btngreen'onClick={handleUpdate}>Update</button>
          <button className='sap btndelete btn-danger' onClick={handleDelete}>Delete</button>
          <button className='btngreen' onClick={generatePDF}>Generate Order PDF</button>
        </div>
      </div>
      
    </div>
    </div>
  );
}


export default Form;