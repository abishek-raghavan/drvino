import React from 'react';

function ModalPage({ isOpen, spancoCounts = {}, onClose }) {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Spanco Counts</h2>
        <ul>
          {Object.entries(spancoCounts).map(([spanco, count]) => (
            <li key={spanco}>{spanco}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ModalPage;
