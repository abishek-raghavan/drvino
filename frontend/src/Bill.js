import React from 'react';
import { jsPDF } from 'jspdf';

function Bill({ orderData }) {
  const generateBill = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(20);
    doc.text('Order Bill', 105, yPos, { align: 'center' });
    yPos += 10;

    orderData.forEach((order, index) => {
      const { businessname, category, product, contactperson, position, productprice, discount, finalprice, description } = order;
      doc.setFontSize(12);
      doc.text(`Order ${index + 1} Details:`, 10, yPos);
      yPos += 10;
      doc.text(`Business Name: ${businessname}`, 10, yPos);
      doc.text(`Category: ${category}`, 10, yPos + 10);
      doc.text(`Product: ${product}`, 10, yPos + 20);
      doc.text(`Contact Person (${position}): ${contactperson}`, 10, yPos + 30);
      doc.text(`Product Price: ${productprice}`, 10, yPos + 40);
      doc.text(`Discount: ${discount}`, 10, yPos + 50);
      doc.text(`Final Price: ${finalprice}`, 10, yPos + 60);
      doc.text(`Description: ${description}`, 10, yPos + 70);
      yPos += 80;
    });

    doc.save('order_bill.pdf');
  };

  return (
    <div>
      <button onClick={generateBill}>Generate Order Bill</button>
    </div>
  );
}

export default Bill;
