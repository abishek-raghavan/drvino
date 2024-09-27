const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "drvino"
});
app.post('/login', (req, res) => {
  const { loginLocation, password } = req.body;
  const sql = "SELECT * FROM users_database WHERE UserName = ? AND Password = ?";

  db.query(sql, [loginLocation, password], (err, results) => {
    if (err) {
      console.error('Error executing login query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      // Send 'INVALID_PASSWORD' error if no user found
      res.status(401).json({ error: 'INVALID_PASSWORD' });
      return;
    }

    // Assuming these are the column names in your users table
    const { Country, State, District, Area } = results[0];
    res.json({
      success: true,
      country: Country,
      state: State,
      district: District,
      area: Area
    });
  });
});
// Error handler middleware
function handleError(err, res, message) {
  console.error(message, err);
  return res.status(500).json({ error: message });
}

// Add Data to Complaints
app.post('/addComplaints', (req, res) => {
  const { complaint } = req.body;
  console.log('Request body:', req.body);  // Log the request body

  if (!complaint) {
    return res.status(400).json({ error: 'Complaint is required' });
  }

  const sql = 'INSERT INTO complaints (complaint_text) VALUES (?)';
  db.query(sql, [complaint], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add complaint');
    res.json({ message: 'Complaint added successfully', id: results.insertId });
  });
});

// Add Data to Vitals
app.post('/addVitals', (req, res) => {
  const { vital } = req.body;
  if (!vital) {
    return res.status(400).json({ error: 'Vital is required' });
  }

  const sql = 'INSERT INTO vitals (vitals_text) VALUES (?)';
  db.query(sql, [vital], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add vital');
    res.json({ message: 'Vital added successfully', id: results.insertId });
  });
});

// Add Data to Examination
app.post('/addExamination', (req, res) => {
  const { examination } = req.body;
  if (!examination) {
    return res.status(400).json({ error: 'Examination is required' });
  }

  const sql = 'INSERT INTO onexam (onexam_text) VALUES (?)';
  db.query(sql, [examination], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add examination');
    res.json({ message: 'Examination added successfully', id: results.insertId });
  });
});

// Add Data to SystemicExamination
app.post('/addSystemicExamination', (req, res) => {
  const { systemicExamination } = req.body;
  if (!systemicExamination) {
    return res.status(400).json({ error: 'Systemic Examination is required' });
  }

  const sql = 'INSERT INTO sysexam (sysexam_text) VALUES (?)';
  db.query(sql, [systemicExamination], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add systemic examination');
    res.json({ message: 'Systemic Examination added successfully', id: results.insertId });
  });
});

// Add Data to Tests
app.post('/addTests', (req, res) => {
  const { test } = req.body;
  if (!test) {
    return res.status(400).json({ error: 'Test is required' });
  }

  const sql = 'INSERT INTO tests (tests_text) VALUES (?)';
  db.query(sql, [test], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add test');
    res.json({ message: 'Test added successfully', id: results.insertId });
  });
});

// Add Data to TreatmentGiven
app.post('/addTreatmentGiven', (req, res) => {
  const { treatment } = req.body;
  if (!treatment) {
    return res.status(400).json({ error: 'Treatment is required' });
  }

  const sql = 'INSERT INTO treatmentgiven (treatmentgiven_text) VALUES (?)';
  db.query(sql, [treatment], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add treatment');
    res.json({ message: 'Treatment added successfully', id: results.insertId });
  });
});

// Add Data to Drugs
app.post('/addDrugs', (req, res) => {
  const { drug } = req.body;
  if (!drug) {
    return res.status(400).json({ error: 'Drug is required' });
  }

  const sql = 'INSERT INTO drugs (drugs_text) VALUES (?)';
  db.query(sql, [drug], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add drug');
    res.json({ message: 'Drug added successfully', id: results.insertId });
  });
});

// Add Data to Dosage
app.post('/addDosage', (req, res) => {
  const { dosage } = req.body;
  if (!dosage) {
    return res.status(400).json({ error: 'Dosage is required' });
  }

  const sql = 'INSERT INTO dosage (dosage_text) VALUES (?)';
  db.query(sql, [dosage], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add dosage');
    res.json({ message: 'Dosage added successfully', id: results.insertId });
  });
});

// Add Data to Timing
app.post('/addTiming', (req, res) => {
  const { timing } = req.body;
  if (!timing) {
    return res.status(400).json({ error: 'Timing is required' });
  }

  const sql = 'INSERT INTO timing (timing_text) VALUES (?)';
  db.query(sql, [timing], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add timing');
    res.json({ message: 'Timing added successfully', id: results.insertId });
  });
});

// Add Data to Duration
app.post('/addDuration', (req, res) => {
  const { duration } = req.body;
  if (!duration) {
    return res.status(400).json({ error: 'Duration is required' });
  }

  const sql = 'INSERT INTO duration (duration_text) VALUES (?)';
  db.query(sql, [duration], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add duration');
    res.json({ message: 'Duration added successfully', id: results.insertId });
  });
});

// Add Data to AdviceGiven
app.post('/addAdviceGiven', (req, res) => {
  const { advice } = req.body;
  if (!advice) {
    return res.status(400).json({ error: 'Advice is required' });
  }

  const sql = 'INSERT INTO advicegiven (advicegiven_text) VALUES (?)';
  db.query(sql, [advice], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add advice');
    res.json({ message: 'Advice added successfully', id: results.insertId });
  });
});

// Add Data to Vaccine
app.post('/addVaccine', (req, res) => {
  const { vaccine } = req.body;
  if (!vaccine) {
    return res.status(400).json({ error: 'Vaccine is required' });
  }

  const sql = 'INSERT INTO vaccine (vaccine_text) VALUES (?)';
  db.query(sql, [vaccine], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add vaccine');
    res.json({ message: 'Vaccine added successfully', id: results.insertId });
  });
});
/////////////////////////////////////////MANAGING THE THINGS///////////////////////////////////////////////////

// Fetch all complaints
app.get('/complaints', (req, res) => {
  const sql = 'SELECT * FROM complaints';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch complaints');
    res.json(results);
  });
});

// Update a complaint
app.put('/complaints/:id', (req, res) => {
  const { id } = req.params;
  const { complaint_text } = req.body;

  if (!complaint_text) {
    return res.status(400).json({ error: 'Complaint text is required' });
  }

  const sql = 'UPDATE complaints SET complaint_text = ? WHERE id = ?';
  db.query(sql, [complaint_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update complaint');
    res.json({ message: 'Complaint updated successfully' });
  });
});

// Delete a complaint
app.delete('/complaints/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM complaints WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete complaint');
    res.json({ message: 'Complaint deleted successfully' });
  });
});



// Fetch all vitals
app.get('/vitals', (req, res) => {
  const sql = 'SELECT * FROM vitals';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch vitals');
    console.log('Vitals fetched from database:', results); // Add this line to debug
    res.json(results);
  });
});

// Update a vital
// Update a vital
app.put('/vitals/:id', (req, res) => {
  const { id } = req.params;
  const { vital_text } = req.body;

  console.log('Received request body:', req.body); // Log the request body for debugging

  if (!vital_text) {
    return res.status(400).json({ error: 'Vital text is required' });
  }

  const sql = 'UPDATE vitals SET vitals_text = ? WHERE id = ?';
  db.query(sql, [vital_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update vital');
    res.json({ message: 'Vital updated successfully' });
  });
});

// Delete a vital
app.delete('/vitals/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM vitals WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete vital');
    res.json({ message: 'Vital deleted successfully' });
  });
});

app.get('/examinations', (req, res) => {
  const sql = 'SELECT * FROM onexam';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch examinations');
    console.log('Examinations fetched from database:', results); // Debugging line
    res.json(results);
  });
});

// Update an examination
app.put('/examinations/:id', (req, res) => {
  const { id } = req.params;
  const { examination_text } = req.body;

  console.log('Received request body:', req.body); // Debugging line

  if (!examination_text) {
    return res.status(400).json({ error: 'Examination text is required' });
  }

  const sql = 'UPDATE onexam SET onexam_text = ? WHERE id = ?';
  db.query(sql, [examination_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update examination');
    res.json({ message: 'Examination updated successfully' });
  });
});

// Delete an examination
app.delete('/examinations/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM onexam WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete examination');
    res.json({ message: 'Examination deleted successfully' });
  });
});

app.get('/sysexaminations', (req, res) => {
  const sql = 'SELECT * FROM sysexam';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch systematic examinations');
    console.log('Systematic examinations fetched from database:', results); // Debugging line
    res.json(results);
  });
});

// Update a systematic examination
app.put('/sysexaminations/:id', (req, res) => {
  const { id } = req.params;
  const { sysexam_text } = req.body;

  if (!sysexam_text) {
    return res.status(400).json({ error: 'Systematic examination text is required' });
  }

  const sql = 'UPDATE sysexam SET sysexam_text = ? WHERE id = ?';
  db.query(sql, [sysexam_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update systematic examination');
    res.json({ message: 'Systematic examination updated successfully' });
  });
});

// Delete a systematic examination
app.delete('/sysexaminations/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM sysexam WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete systematic examination');
    res.json({ message: 'Systematic examination deleted successfully' });
  });
});


// Fetch all tests
app.get('/tests', (req, res) => {
  const sql = 'SELECT * FROM tests';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch tests');
    console.log('Tests fetched from database:', results);
    res.json(results);
  });
});

// Update a test
app.put('/tests/:id', (req, res) => {
  const { id } = req.params;
  const { tests_text } = req.body;

  if (!tests_text) {
    return res.status(400).json({ error: 'Test text is required' });
  }

  const sql = 'UPDATE tests SET tests_text = ? WHERE id = ?';
  db.query(sql, [tests_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update test');
    res.json({ message: 'Test updated successfully' });
  });
});

// Delete a test
app.delete('/tests/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM tests WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete test');
    res.json({ message: 'Test deleted successfully' });
  });
});


// Fetch all treatments
app.get('/treatmentgiven', (req, res) => {
  const sql = 'SELECT * FROM treatmentgiven';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch treatments');
    console.log('Treatments fetched from database:', results);
    res.json(results);
  });
});

// Update a treatment
app.put('/treatmentgiven/:id', (req, res) => {
  const { id } = req.params;
  const { treatmentgiven_text } = req.body;

  if (!treatmentgiven_text) {
    return res.status(400).json({ error: 'Treatment text is required' });
  }

  const sql = 'UPDATE treatmentgiven SET treatmentgiven_text = ? WHERE id = ?';
  db.query(sql, [treatmentgiven_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update treatment');
    res.json({ message: 'Treatment updated successfully' });
  });
});

// Delete a treatment
app.delete('/treatmentgiven/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM treatmentgiven WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete treatment');
    res.json({ message: 'Treatment deleted successfully' });
  });
});

// Fetch all drugs
app.get('/drugs', (req, res) => {
  const sql = 'SELECT * FROM drugs';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch drugs');
    console.log('Drugs fetched from database:', results);
    res.json(results);
  });
});

// Update a drug
app.put('/drugs/:id', (req, res) => {
  const { id } = req.params;
  const { drugs_text } = req.body;

  if (!drugs_text) {
    return res.status(400).json({ error: 'Drug text is required' });
  }

  const sql = 'UPDATE drugs SET drugs_text = ? WHERE id = ?';
  db.query(sql, [drugs_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update drug');
    res.json({ message: 'Drug updated successfully' });
  });
});

// Delete a drug
app.delete('/drugs/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM drugs WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete drug');
    res.json({ message: 'Drug deleted successfully' });
  });
});

// Fetch all dosages
app.get('/dosage', (req, res) => {
  const sql = 'SELECT * FROM dosage';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch dosage');
    console.log('Dosage fetched from database:', results);
    res.json(results);
  });
});

// Update a dosage
app.put('/dosage/:id', (req, res) => {
  const { id } = req.params;
  const { dosage_text } = req.body;

  if (!dosage_text) {
    return res.status(400).json({ error: 'Dosage text is required' });
  }

  const sql = 'UPDATE dosage SET dosage_text = ? WHERE id = ?';
  db.query(sql, [dosage_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update dosage');
    res.json({ message: 'Dosage updated successfully' });
  });
});

// Delete a dosage
app.delete('/dosage/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM dosage WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete dosage');
    res.json({ message: 'Dosage deleted successfully' });
  });
});

// Fetch all timings
app.get('/timing', (req, res) => {
  const sql = 'SELECT * FROM timing';
  db.query(sql, (err, results) => {
    if (err) return handleError(err, res, 'Failed to fetch timings');
    console.log('Timings fetched from database:', results);
    res.json(results);
  });
});

// Update a timing
app.put('/timing/:id', (req, res) => {
  const { id } = req.params;
  const { timing_text } = req.body;

  if (!timing_text) {
    return res.status(400).json({ error: 'Timing text is required' });
  }

  const sql = 'UPDATE timing SET timing_text = ? WHERE id = ?';
  db.query(sql, [timing_text, id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to update timing');
    res.json({ message: 'Timing updated successfully' });
  });
});

// Delete a timing
app.delete('/timing/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM timing WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return handleError(err, res, 'Failed to delete timing');
    res.json({ message: 'Timing deleted successfully' });
  });
});
app.get('/timing', (req, res) => {
  const sql = 'SELECT * FROM timing';
  db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch timings' });
      res.json(results);
  });
});

// Update a timing
app.put('/timing/:id', (req, res) => {
  const { id } = req.params;
  const { timing_text } = req.body;

  if (!timing_text) {
      return res.status(400).json({ error: 'Timing text is required' });
  }

  const sql = 'UPDATE timing SET timing_text = ? WHERE id = ?';
  db.query(sql, [timing_text, id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to update timing' });
      res.json({ message: 'Timing updated successfully' });
  });
});

// Delete a timing
app.delete('/timing/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM timing WHERE id = ?';
  db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to delete timing' });
      res.json({ message: 'Timing deleted successfully' });
  });
});


// Get all durations
app.get('/duration', (req, res) => {
  const sql = 'SELECT * FROM duration';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch durations' });
    res.json(results);
  });
});

// Add a new duration
app.post('/duration', (req, res) => {
  const { duration_text } = req.body;

  if (!duration_text) {
    return res.status(400).json({ error: 'Duration text is required' });
  }

  const sql = 'INSERT INTO duration (duration_text) VALUES (?)';
  db.query(sql, [duration_text], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to add duration' });
    res.json({ message: 'Duration added successfully', id: results.insertId });
  });
});

// Update an existing duration
app.put('/duration/:id', (req, res) => {
  const { id } = req.params;
  const { duration_text } = req.body;

  if (!duration_text) {
    return res.status(400).json({ error: 'Duration text is required' });
  }

  const sql = 'UPDATE duration SET duration_text = ? WHERE id = ?';
  db.query(sql, [duration_text, id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to update duration' });
    res.json({ message: 'Duration updated successfully' });
  });
});

// Delete a duration
app.delete('/duration/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM duration WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to delete duration' });
    res.json({ message: 'Duration deleted successfully' });
  });
});

// Get all advice given entries
app.get('/advicegiven', (req, res) => {
  const sql = 'SELECT * FROM advicegiven';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch advice given' });
    res.json(results);
  });
});

// Add a new advice entry
app.post('/advicegiven', (req, res) => {
  const { advicegiven_text } = req.body;

  if (!advicegiven_text) {
    return res.status(400).json({ error: 'Advice text is required' });
  }

  const sql = 'INSERT INTO advicegiven (advicegiven_text) VALUES (?)';
  db.query(sql, [advicegiven_text], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to add advice' });
    res.json({ message: 'Advice added successfully', id: results.insertId });
  });
});

// Update an existing advice entry
app.put('/advicegiven/:id', (req, res) => {
  const { id } = req.params;
  const { advicegiven_text } = req.body;

  if (!advicegiven_text) {
    return res.status(400).json({ error: 'Advice text is required' });
  }

  const sql = 'UPDATE advicegiven SET advicegiven_text = ? WHERE id = ?';
  db.query(sql, [advicegiven_text, id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to update advice' });
    res.json({ message: 'Advice updated successfully' });
  });
});

// Delete an advice entry
app.delete('/advicegiven/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM advicegiven WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to delete advice' });
    res.json({ message: 'Advice deleted successfully' });
  });
});
// Get all vaccine entries
app.get('/vaccine', (req, res) => {
  const sql = 'SELECT * FROM vaccine';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch vaccines' });
    res.json(results);
  });
});

// Add a new vaccine entry
app.post('/vaccine', (req, res) => {
  const { vaccine_text } = req.body;

  if (!vaccine_text) {
    return res.status(400).json({ error: 'Vaccine text is required' });
  }

  const sql = 'INSERT INTO vaccine (vaccine_text) VALUES (?)';
  db.query(sql, [vaccine_text], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to add vaccine' });
    res.json({ message: 'Vaccine added successfully', id: results.insertId });
  });
});

// Update an existing vaccine entry
app.put('/vaccine/:id', (req, res) => {
  const { id } = req.params;
  const { vaccine_text } = req.body;

  if (!vaccine_text) {
    return res.status(400).json({ error: 'Vaccine text is required' });
  }

  const sql = 'UPDATE vaccine SET vaccine_text = ? WHERE id = ?';
  db.query(sql, [vaccine_text, id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to update vaccine' });
    res.json({ message: 'Vaccine updated successfully' });
  });
});

// Delete a vaccine entry
app.delete('/vaccine/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM vaccine WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to delete vaccine' });
    res.json({ message: 'Vaccine deleted successfully' });
  });
});
app.post('/api/patients', (req, res) => {
  const {
    fullName,
    fathersName,
    age,
    gender,
    city,
    phoneNumber,
    appointmentDate,
    appointmentTime,
    services,
  } = req.body;

  const servicesStr = services.join(','); // Convert services array to a comma-separated string

  const sql = `
    INSERT INTO patients (full_name, fathers_name, age, gender, city, phone_number, appointment_date, appointment_time, services)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    fullName,
    fathersName,
    age,
    gender,
    city,
    phoneNumber,
    appointmentDate,
    appointmentTime,
    servicesStr,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Failed to save patient data' });
    } else {
      res.status(200).json({ message: 'Patient data saved successfully' });
    }
  });
});
//////////////////////////////get the patinet from the table for patient follow up/////////////////////

app.get('/api/patients', (req, res) => {
  const query = "SELECT * FROM patients WHERE status = 'not completed'";
  
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
