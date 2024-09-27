const Validation = (values) => {
  let errors = {};

  // Check for empty fields
  if (!values.businessName.trim()) {
    errors.businessName = "Business Name is required";
  }
  if (!values.category.trim()) {
    errors.category = "Category is required";
  }
  // Add similar checks for other required fields

  // Validate contact number
  if (values.contactNumber.trim() && values.contactNumber.length !== 10) {
    errors.contactNumber = "Contact Number must be 10 digits";
  }

  // Validate WhatsApp number
  if (values.whatsappNumber.trim() && values.whatsappNumber.length !== 10) {
    errors.whatsappNumber = "WhatsApp Number must be 10 digits";
  }

  // Validate initial payment if provided
  if (values.initialPayment && isNaN(values.initialPayment)) {
    errors.initialPayment = "Initial Payment must be a valid number";
  }

  return errors;
};

export default Validation;
