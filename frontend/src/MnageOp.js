import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageOp() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDiscount, setNewProductDiscount] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/categoriesmanage')
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
    
    axios.get('http://localhost:8081/productsmanage')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const updateCategory = (id, newName) => {
    axios.put(`http://localhost:8081/categoriesup/${encodeURIComponent(id)}`, { category: newName })
      .then(res => {
        const updatedCategories = categories.map(category => {
          if (category.id === id) {
            return { ...category, category: newName };
          }
          return category;
        });
        setCategories(updatedCategories);
      })
      .catch(err => console.log(err));
  };

  const deleteCategory = (id) => {
    axios.delete(`http://localhost:8081/categoriesdel/${encodeURIComponent(id)}`)
      .then(res => {
        const updatedCategories = categories.filter(category => category.id !== id);
        setCategories(updatedCategories);
      })
      .catch(err => console.log(err));
  };

  const updateProduct = (id, field, value) => {
    axios.put(`http://localhost:8081/productsup/${encodeURIComponent(id)}`, { [field]: value })
      .then(res => {
        const updatedProducts = products.map(product => {
          if (product.id === id) {
            return { ...product, [field]: value };
          }
          return product;
        });
        setProducts(updatedProducts);
      })
      .catch(err => console.log(err));
  };

  const deleteProduct = (id) => {
    axios.delete(`http://localhost:8081/productsdel/${encodeURIComponent(id)}`)
      .then(res => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
      })
      .catch(err => console.log(err));
  };

  const addCategory = () => {
    const newId = Math.floor(Math.random() * 1000);
    axios.post('http://localhost:8081/categories', { id: newId, category: newCategory })
      .then(res => {
        setCategories([...categories, { id: newId, category: newCategory }]);
        setNewCategory('');
      })
      .catch(err => console.log(err));
  };

  const addProduct = () => {
    const newId = Math.floor(Math.random() * 1000);
    axios.post('http://localhost:8081/products', { id: newId, product_name: newProduct, product_price: newProductPrice, product_discount: newProductDiscount })
      .then(res => {
        setProducts([...products, { id: newId, product_name: newProduct, product_price: newProductPrice, product_discount: newProductDiscount }]);
        setNewProduct('');
        setNewProductPrice('');
        setNewProductDiscount('');
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Categories</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>ID</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.id}</td>
              <td>
                <input
                  type="text"
                  value={category.category}
                  onChange={(e) => updateCategory(category.id, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => deleteCategory(category.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h2>Add Category</h2>
        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        <button onClick={addCategory}>Add Category</button>
      </div>

      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.id}</td>
              <td>
                <input
                  type="text"
                  value={product.product_name || ''}
                  onChange={(e) => updateProduct(product.id, 'product_name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={product.product_price || ''}
                  onChange={(e) => updateProduct(product.id, 'product_price', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={product.product_discount || ''}
                  onChange={(e) => updateProduct(product.id, 'product_discount', e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h2>Add Product</h2>
        <input type="text" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} placeholder="Name" />
        <input type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} placeholder="Price" />
        <input type="number" value={newProductDiscount} onChange={(e) => setNewProductDiscount(e.target.value)} placeholder="Discount" />
        <button onClick={addProduct}>Add Product</button>
      </div>
    </div>
  );
}

export default ManageOp;
