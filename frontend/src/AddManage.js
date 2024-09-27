import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ManagerUsers.css'; // Import your CSS file with the styles

function CategoryList({ categories, onCategoryClick }) {
  return (
    <div className="centered user-list">
      <h2>Categories</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index} onClick={() => onCategoryClick(category)}>
            <strong>Category Name:</strong> {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductList({ products, onProductClick }) {
  return (
    <div className="centered user-list">
      <h2>Products</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index} onClick={() => onProductClick(product)}>
            <strong>Product Name:</strong> {product.productname}, <strong>Category:</strong> {product.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddManage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/products?category=${selectedCategory.name}`);
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
      fetchProducts();
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedCategory(null);
  };

  const handleDelete = async () => {
    try {
      if (selectedCategory) {
        await axios.delete(`http://localhost:8081/categories/${selectedCategory.id}`);
        setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      } else if (selectedProduct) {
        await axios.delete(`http://localhost:8081/products/${selectedProduct.id}`);
        setProducts(products.filter(prod => prod.id !== selectedProduct.id));
      }
      console.log('Item deleted successfully');
      setSelectedCategory(null);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = () => {
    // Implement update logic
    console.log('Update clicked');
  };

  return (
    <div className="container">
      <div className="split left">
        <CategoryList categories={categories} onCategoryClick={handleCategoryClick} />
      </div>
      <div className="split right">
        <ProductList products={products} onProductClick={handleProductClick} />
      </div>
      {(selectedCategory || selectedProduct) && (
        <div className="details">
          <h2>Selected Item Details</h2>
          <button className="update-button" onClick={handleUpdate}>Update</button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default AddManage;
