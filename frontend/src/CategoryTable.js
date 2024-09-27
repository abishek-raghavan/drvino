// CategoryTable.js

import React from 'react';

function CategoryTable({ categories, onCategoryEdit }) {
  return (
    <div className="centered category-table">
      <h2 className="center">Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td>{category.Category}</td>
              <td>
                <button onClick={() => onCategoryEdit(category)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryTable;
