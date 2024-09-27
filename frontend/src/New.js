import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Validation from './NewValidation';
import axios from 'axios';
import './New.css';
import myImage from './logo.png';
import AddCategoryModal from './AddCategoryModal';
import AddPositionModal from './AddPositionModal';
import Swal from 'sweetalert2';

function New() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [addCategoryModalIsOpen, setAddCategoryModalIsOpen] = useState(false);
  const [addPositionModalIsOpen, setAddPositionModalIsOpen] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  const country = searchParams.get('country');
  const state = searchParams.get('state');
  const district = searchParams.get('district');
  const area = searchParams.get('area');

  const [values, setValues] = useState({
    businessName: '',
    category: '',
    product: '',
    contactPerson: '',
    position: '',
    contactNumber: '',
    whatsappNumber: '',
    email: '',
    spanco: '',
    dateOfNextMeeting: null,
    dateOfProject: null,
    modeOfPayment: null,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://localhost:8081/positions');
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };
    fetchPositions();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8081/newcat');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/newp');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handlePositionAdd = (newPosition) => {
    setPositions([...positions, newPosition]);
  };

  const handleCategoryAdd = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));

    // Check if there are any errors in the form fields
    if (Object.values(errors).some((error) => error !== '')) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
      });
      return; // Exit early if there are errors
    }

    // Check if any of the fields except Date of Next Meeting, Date of Project, and Mode of Payment are left empty
    const emptyFields = Object.entries(values).filter(([key, value]) => {
      return !['dateOfNextMeeting', 'dateOfProject', 'modeOfPayment'].includes(key) && value === '';
    });

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(([key]) => key).join(', ');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Please fill in the following fields: ${fieldNames}`,
      });
      return; // Exit early if there are empty fields
    }

    // If all conditions are met, proceed with form submission
    axios
      .post(`http://localhost:8081/new?loginlocation=${username}&country=${country}&state=${state}&district=${district}&area=${area}&email=${values.email}&initialpayment=${values.initialPayment}`, values)
      .then((res) => {
        setPositions([...positions, values.position]);
        setCategories([...categories, values.category]); // Update local state with the new position
        navigate(`/home?loginlocation=${username}&country=${country}&state=${state}&district=${district}&area=${area}`);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Form submitted successfully!',
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      });
  };

  const handleContactNumberBlur = (event) => {
    setValues((prev) => ({ ...prev, contactNumber: event.target.value }));
    if (values.whatsappNumber === '') {
      setValues((prev) => ({ ...prev, whatsappNumber: event.target.value }));
    }
  };

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setValues((prev) => ({ ...prev, category: event.target.value }));
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    setValues((prev) => ({ ...prev, product: event.target.value }));
  };

  const handlePositionChange = (event) => {
    setValues((prev) => ({ ...prev, position: event.target.value }));
  };

  const openAddCategoryModal = () => {
    setAddCategoryModalIsOpen(true);
  };

  const closeAddCategoryModal = () => {
    setAddCategoryModalIsOpen(false);
  };

  const openAddPositionModal = () => {
    setAddPositionModalIsOpen(true);
  };

  const closeAddPositionModal = () => {
    setAddPositionModalIsOpen(false);
  };

  return (
    <>
        <div className='newbg'>
        <div className='d-flex justify-content-center align-items-center Box'>
          <div className='box'>
            <h1 className='bus'>ADD A NEW CUSTOMER</h1>
            <form action='' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='businessName'>Business Name</label>
                <input
                  type='text'
                  className='form-control'
                  id='businessName'
                  name='businessName'
                  placeholder='Business Name'
                  value={values.businessName}
                  onChange={handleInput}
                />
                {errors.businessName && (
                  <div className='text-danger'>{errors.businessName}</div>
                )}
              </div>
                        <div className='form-group'>
            <label htmlFor='category'>Category</label>
            <div className='d-flex align-items-center'>
              <select
                value={values.category}
                onChange={handleCategoryChange}
                className='form-control mr-2' // Add margin to the right side
                id='category'
                name='category'
              >
                <option value=''>Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button type='button' className='plusbtn' onClick={openAddCategoryModal}>
                +
              </button>
            </div>
            {errors.category && (
              <div className='text-danger'>{errors.category}</div>
            )}
          </div>

              <div className='form-group'>
                <label htmlFor='product'>Product</label>
                <select
                  value={values.selectedProduct}
                  onChange={handleProductChange}
                  className='form-control'
                  id='product'
                  name='product'
                >
                  <option value=''>All</option>
                  {products
                    .filter((product) => product !== '')
                    .map((product, index) => (
                      <option key={index} value={product}>
                        {product}
                      </option>
                    ))}
                </select>
                {errors.product && (
                  <div className='text-danger'>{errors.product}</div>
                )}
              </div>
              <div className='form-group'>
                <label htmlFor='contactPerson'>Contact Person</label>
                <input
                  type='text'
                  className='form-control'
                  id='contactPerson'
                  name='contactPerson'
                  placeholder='Contact Person'
                  value={values.contactPerson}
                  onChange={handleInput}
                />
                {errors.contactPerson && (
                  <div className='text-danger'>{errors.contactPerson}</div>
                )}
              </div>
<div className='form-group'>
  <label htmlFor='position'>Position</label>
  <div className='d-flex align-items-center'>
    <select
      value={values.position}
      onChange={handlePositionChange}
      className='form-control mr-2' // Add margin to the right side
      id='position'
      name='position'
    >
      <option value=''>Select Position</option>
      {positions.map((position, index) => (
        <option key={index} value={position}>
          {position}
        </option>
      ))}
    </select>
    <button type='button' className='plusbtn' onClick={openAddPositionModal}>
      +
    </button>
  </div>
  {errors.position && (
    <div className='text-danger'>{errors.position}</div>
  )}
</div>

              <div className='form-group'>
                <label htmlFor='contactNumber'>Contact Number</label>
                <input
                  type='text'
                  className='form-control'
                  id='contactNumber'
                  name='contactNumber'
                  placeholder='Contact Number'
                  value={values.contactNumber}
                  onChange={handleInput}
                  onBlur={handleContactNumberBlur}
                />
                {errors.contactNumber && (
                  <div className='text-danger'>{errors.contactNumber}</div>
                )}
              </div>
              <div className='form-group'>
                <label htmlFor='whatsappNumber'>WhatsApp Number</label>
                <input
                  type='text'
                  className='form-control'
                  id='whatsappNumber'
                  name='whatsappNumber'
                  placeholder='WhatsApp Number'
                  value={values.whatsappNumber}
                  onChange={handleInput}
                />
                {errors.whatsappNumber && (
                  <div className='text-danger'>{errors.whatsappNumber}</div>
                )}
              </div>
              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  name='email'
                  placeholder='Email'
                  value={values.email}
                  onChange={handleInput}
                />
                {errors.email && (
                  <div className='text-danger'>{errors.email}</div>
                )}
              </div>
              <div className='form-group'>
                <label htmlFor='spanco'>Spanco</label>
                <select
                  className='form-control'
                  id='spanco'
                  name='spanco'
                  value={values.spanco}
                  onChange={handleInput}
                >
                  <option value=''>Select Spanco</option>
                  <option value='Suspect'>Suspect</option>
                  <option value='Prospect'>Prospect</option>
                  <option value='Approach'>Approach</option>
                  <option value='Negotiation'>Negotiation</option>
                  <option value='Close'>Close</option>
                  <option value='Order'>Order</option>
                  <option value='Omission'>Omission</option>
                </select>
                {errors.spanco && (
                  <div className='text-danger'>{errors.spanco}</div>
                )}
              </div>
              <div className='form-group'>
                <label htmlFor='dateOfNextMeeting'>Date of Next Meeting</label>
                <input
                  type='date'
                  className='form-control'
                  id='dateOfNextMeeting'
                  name='dateOfNextMeeting'
                  value={values.dateOfNextMeeting || ''}
                  onChange={handleInput}
                />
                {errors.dateOfNextMeeting && (
                  <div className='text-danger'>{errors.dateOfNextMeeting}</div>
                )}
              </div>
              <div className='form-group'>
                <label htmlFor='dateOfProject'>Date of Project</label>
                <input
                  type='date'
                  className='form-control'
                  id='dateOfProject'
                  name='dateOfProject'
                  value={values.dateOfProject || ''}
                  onChange={handleInput}
                />
                {errors.dateOfProject && (
                  <div className='text-danger'>{errors.dateOfProject}</div>
                )}
              </div>
              <div className='form-group'>
                <label htmlFor='modeOfPayment'>Mode of Payment</label>
                <select
                  className='form-control'
                  id='modeOfPayment'
                  name='modeOfPayment'
                  value={values.modeOfPayment}
                  onChange={handleInput}
                >
                  <option value='Null'>Null</option>
                  <option value='EMI'>EMI</option>
                  <option value='Full Cash'>Full Cash</option>
                  <option value='Partial'>Partial</option>
                </select>
                {errors.modeOfPayment && (
                  <div className='text-danger'>{errors.modeOfPayment}</div>
                )}
              </div>
              <div className='form-group text-center'> {/* Wrap the button in a div with text-center class */}
  <button type='submit' className='plusbtn'>
    Submit
  </button>
</div>

            </form>
          </div>
      </div>
      </div>
      <AddCategoryModal
        isOpen={addCategoryModalIsOpen}
        onRequestClose={closeAddCategoryModal}
        onCategoryAdd={handleCategoryAdd} // Pass the function here
      />

      <AddPositionModal
        isOpen={addPositionModalIsOpen}
        onRequestClose={closeAddPositionModal}
        onPositionAdd={handlePositionAdd}
      />
    </>
  );
}

export default New;
