// PDFPreviewModal.js

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';

const PDFPreviewModal = ({ show, handleClose, handleDownload, handleShare, pdfContent, noteText }) => {
  const renderNoteText = () => {
    const maxWidth = 300; // Maximum width for the note text
    const doc = new jsPDF();
    const textLines = doc.splitTextToSize(noteText, maxWidth);

    return textLines.map((line, index) => (
      <p key={index} style={{ marginBottom: '5px', wordWrap: 'break-word' }}>{line}</p>
    ));
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>PDF Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display the PDF preview using an iframe */}
        <iframe src={pdfContent} title="PDF Preview" style={{ width: '100%', height: '500px', border: 'none' }} />

        {/* Render the note text */}
        <div style={{ marginTop: '20px', maxWidth: '100%', overflowWrap: 'break-word' }}>
          <strong>Note:</strong>
          {renderNoteText()}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* Buttons to download, share, and close the modal */}
        <Button variant="secondary" onClick={handleDownload}>
          Download
        </Button>
        <Button variant="primary" onClick={handleShare}>
          Share
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PDFPreviewModal;
