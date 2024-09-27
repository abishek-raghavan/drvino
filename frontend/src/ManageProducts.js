import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert'; // Import SweetAlert
import './ManagerUsers.css';
import myImage from './Visual Planet.png';

import Modal from 'react-modal'; // Import the Modal component


function ProductList({ products, onProductClick, onDeleteProduct }) {
  return (
    <div className="container-fluid">
      <h2 className="bus">Products</h2>
      <div className='table-responsive'>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.Product_Name}</td>
              <td>{product.Product_Price}</td>
              <td>{product.Product_Discount}</td>
              <td>
                <button onClick={() => onProductClick(product)} className='btngreen'>Edit</button>
                <button onClick={() => onDeleteProduct(product.id)} className='btndelete'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductNote, setNewProductNote] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDiscount, setNewProductDiscount] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setNewProductName(product.Product_Name);
    setNewProductPrice(product.Product_Price);
    setNewProductDiscount(product.Product_Discount);
    setNewProductNote(product.Note);
    setEditMode(true);
    setModalIsOpen(true); // Open the modal when clicking "Edit"

  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:8081/admin/products/${selectedProduct.id}`, {
        Product_Name: newProductName,
        Product_Price: newProductPrice,
        Product_Discount: newProductDiscount,
        Note: newProductNote,
      });
      console.log('Product updated successfully');
      // Show sweet alert on success
      swal("Updated!", "Product updated successfully!", "success");
      setSelectedProduct(null);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductDiscount('');
      setNewProductNote('');
      setEditMode(false);
      // Refresh products
      refreshProducts();
      setModalIsOpen(false); // Close the modal after updating

    } catch (error) {
      console.error('Error updating product:', error);
      // Show sweet alert for error
      swal("Error!", "Something went wrong!", "error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Show confirmation dialog before deleting
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`http://localhost:8081/admin/products/${productId}`);
          console.log('Product deleted successfully');
          // Show sweet alert on success
          swal("Deleted!", "Product deleted successfully!", "success");
          // Refresh products
          refreshProducts();
        } catch (error) {
          console.error('Error deleting product:', error);
          // Show sweet alert for error
          swal("Error!", "Something went wrong!", "error");
        }
      } else {
        // Show cancel message if user cancels delete operation
        swal("Cancelled!", "Product deletion cancelled!", "info");
      }
    });
  };

  const refreshProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <>
              <div className='admin-container'>

    <div className='admin-header'>
    <img src={myImage} alt="My Image" className="admin-panel-image" />
    </div>
    <div className="container">
      <ProductList products={products} onProductClick={handleProductClick} onDeleteProduct={handleDeleteProduct} />
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="custom-modal" overlayClassName="custom-overlay">

      {selectedProduct && editMode && (
        <div className="details">
          <h2 className="center bus">Edit Product</h2>
          <div className="input-field">
            <label>Product Name:</label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>Price:</label>
            <input
              type="text"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>Discount:</label>
            <input
              type="text"
              value={newProductDiscount}
              onChange={(e) => setNewProductDiscount(e.target.value)}
            />
          </div>
          <div className="input-field">
            <label>Note:</label>
            <textarea
              value={newProductNote}
              onChange={(e) => setNewProductNote(e.target.value)}
            />
          </div>
          <button className="update-button" onClick={handleUpdateProduct}>Update Product</button>
        </div>
      )}
      </Modal>
    </div>
    </div>
    </>
  );
}

export default ManageProducts;
