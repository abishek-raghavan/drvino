// ProductTable.js

import React from 'react';

function ProductTable({ products, onProductEdit }) {
  return (
    <div className="centered product-table">
      <h2 className="center">Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
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
                <button onClick={() => onProductEdit(product)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
