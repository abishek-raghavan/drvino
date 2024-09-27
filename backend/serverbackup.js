const express = require("express")
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from uuid package
const uuid = require('uuid'); 
const multer = require('multer'); // Import multer
const path = require('path');// Import the uuid module to generate unique IDs

app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password: "",
  database: "VP"
})

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/images'); // Directory where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() +path.extname(file.originalname)); // Generate a unique filename
  }
});


const upload = multer({ storage: storage });
app.post('/upload', upload.single('image'), (req, res) => {
  const image = req.file.filename;
  const sql = " UPDATE seals SET image = ? WHERE id = 1";
  db.query(sql, [image],(err,result)=>{
    if(err) return res.json({Message:"Error"})
    return res.json({Status:"Success"});
  })
});


app.post('/sigupload', upload.single('image'), (req, res) => {
  const image = req.file.filename; // Use req.file.filename instead of req.sigfile.filename
  const sql = "UPDATE seals SET image = ? WHERE id = 2";
  db.query(sql, [image],(err,result)=>{
    if(err) return res.json({Message:"Error"})
    return res.json({Status:"Success"});
  })
});

app.get('/getseal', (req, res) => {
  const sql = 'SELECT * FROM seals WHERE id = 1';
  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching seal data:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }
      return res.json({ result });
  });
});

app.get('/getsig', (req, res) => {
  const sql = 'SELECT * FROM seals WHERE id = 2';
  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching seal data:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }
      return res.json({ result });
  });
});
app.post('/signup', (req, res) => {
  // Note: Removed the id field from the INSERT statement
  const sql = "INSERT INTO Users_Database (`UserName`, `Password`, `Country`, `State`, `District`, `Area`) VALUES (?, ?, ?, ?, ?, ?)";
  
  // Removed the UUID generation and the id from the values array
  const values = [
    req.body.name,
    req.body.password,
    req.body.country,
    req.body.state,
    req.body.district,
    req.body.area
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error occurred during insertion:", err);
      return res.status(500).json({ error: 'An error occurred during user creation.' });
    }
    // Note: Depending on your database driver, `data` might have a different structure
    // For MySQL with mysql package, you would likely need to use data.insertId to get the new ID
    return res.status(200).json({ message: 'User created successfully.', userId: data.insertId });
  });
});


app.get('/suggestions/:type', (req, res) => {
  const { type } = req.params;
  let sql = '';
  let fieldName = '';

  switch (type) {
    case 'countries':
      sql = "SELECT DISTINCT Country AS value FROM Users_Database";
      fieldName = 'value';
      break;
    case 'states':
      sql = "SELECT DISTINCT State AS value FROM Users_Database";
      fieldName = 'value';
      break;
    case 'districts':
      sql = "SELECT DISTINCT District AS value FROM Users_Database";
      fieldName = 'value';
      break;
    default:
      return res.status(400).json({ error: 'Invalid suggestion type' });
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error(`Error fetching ${type} suggestions:`, err);
      return res.status(500).json({ error: `An error occurred while fetching ${type} suggestions.` });
    }

    const suggestions = results.map(row => row[fieldName]);
    res.json(suggestions);
  });
});


app.get('/checkusername/:username', (req, res) => {
  const { username } = req.params;
  db.query('SELECT * FROM users_database WHERE UserName = ?', username, (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).json({ error: 'Failed to check username' });
    }
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});


app.get('/checkcategory/:category', (req, res) => {
  const { category } = req.params;
  db.query('SELECT * FROM categories WHERE Category = ?', category, (err, results) => {
    if (err) {
      console.error('Error checking category:', err);
      return res.status(500).json({ error: 'Failed to check category' });
    }
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

app.get('/checkposition/:position', (req, res) => {
  const { position } = req.params;
  db.query('SELECT * FROM positions WHERE Position= ?', position, (err, results) => {
    if (err) {
      console.error('Error checking position:', err);
      return res.status(500).json({ error: 'Failed to check position' });
    }
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

app.get('/checkproduct/:product', (req, res) => {
  const { product } = req.params;
  db.query('SELECT * FROM product_details WHERE Product_Name = ?', product, (err, results) => {
    if (err) {
      console.error('Error checking product:', err);
      return res.status(500).json({ error: 'Failed to check product' });
    }
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});
let categoryCount = 0; // Initialize category count
let positionCount = 0; // Initialize position count
app.post('/addcategory', (req, res) => {
  const { category } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  const id = generateUniqueId('category'); // Generate unique ID for category
  db.query('INSERT INTO categories (Id, Category) VALUES (?, ?)', [id, category], (err, results) => {
    if (err) {
      console.error('Error adding category:', err);
      return res.status(500).json({ error: 'Failed to add category' });
    }
    console.log('Category added successfully');
    res.json({ message: 'Category added successfully' });
  });
});
app.post('/addproduct', (req, res) => {
  const { product, productPrice, productDiscount, productNote } = req.body;
  if (!product || !productPrice || !productDiscount) {
    return res.status(400).json({ error: 'Product, Product Price, and Product Discount are required' });
  }

  const id = generateUniqueId('product'); // Generate unique ID for product
  db.query('INSERT INTO product_details (Product_Name, Product_Price, Product_Discount, id, Note) VALUES (?, ?, ?, ?, ?)', [product, productPrice, productDiscount, id, productNote], (err, results) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    console.log('Product added successfully');
    res.json({ message: 'Product added successfully' });
  });
});

app.post('/addposition', (req, res) => {
  const { position } = req.body;

  if (!position) {
    return res.status(400).json({ error: 'Position is required' });
  }

  const id = generateUniqueId('position'); // Generate unique ID for position
  db.query('INSERT INTO positions (id, position) VALUES (?, ?)', [id, position], (err, results) => {
    if (err) {
      console.error('Error adding position:', err);
      return res.status(500).json({ error: 'Failed to add position' });
    }
    console.log('Position added successfully');
    res.json({ message: 'Position added successfully' });
  });
});
function generateUniqueId(type) {
  switch (type) {
    case 'category':
      return ++categoryCount; // Increment and return category count
    case 'product':
      return ++productCount; // Increment and return product count
    case 'position':
      return ++positionCount; // Increment and return position count
    default:
      return null;
  }
}
let productCount = 0; // Initialize product count

app.post('/addproduct', (req, res) => {
  const { product, productPrice, productDiscount, productNote } = req.body;
  if (!product || !productPrice || !productDiscount) {
    return res.status(400).json({ error: 'Product, Product Price, and Product Discount are required' });
  }
  const id = generateUniqueId();
  db.query('INSERT INTO product_details (Product_Name, Product_Price, Product_Discount, id, Note) VALUES (?, ?, ?, ?, ?)', [product, productPrice, productDiscount, id, productNote], (err, results) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    console.log('Product added successfully');
    res.json({ message: 'Product added successfully', id: id }); // Return the generated ID
  });
});
function generateUniqueId() {
  return ++productCount; // Increment and return product count
}


app.get('/categories', (req, res) => {
  db.query('SELECT category FROM product details', (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.json(results);
  });
});
app.post('/addpositions', (req, res) => {
  const { position } = req.body;

  if (!position) {
    return res.status(400).json({ error: 'Position is required' });
  }

  const positionId = uuid.v4(); // Generate a unique ID for the position

  db.query('INSERT INTO positions (id, position) VALUES (?, ?)', [positionId, position], (err, results) => {
    if (err) {
      console.error('Error adding position:', err);
      return res.status(500).json({ error: 'Failed to add position' });
    }
    console.log('Position added successfully');
    res.json({ id: positionId, name: position }); // Send the new position along with its ID in the response
  });
});

app.post('/addcat', (req, res) => {
   if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }
  db.query('INSERT INTO categories (Category) VALUES (?)', [category], (err, results) => {
    if (err) {
      console.error('Error adding category:', err);
      return res.status(500).json({ error: 'Failed to add category' });
    }
    console.log('Category added successfully');
    res.json({ message: 'Category added successfully' });
  });
});

app.get('/positions', (req, res) => {
  db.query('SELECT position FROM positions', (err, results) => {
    if (err) {
      console.error('Error fetching positions:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    const positions = results.map((result) => result.position);
    res.json(positions);
  });
});

app.delete('/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  db.query('DELETE FROM categories WHERE id = ?', categoryId, (err, results) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    res.json({ message: 'Category deleted successfully.' });
  });
});

app.get('/today', (req, res) => {
  const { spanco, businessname, loginlocation, fromDate, toDate } = req.query;
  let sql = 'SELECT businessname, dateofnextmeeting, spanco, id, dateofproject,contactnumber, email FROM orders WHERE 1=1';
  let params = [];

  if (loginlocation) {
    sql += ' AND loginlocation = ?';
    params.push(loginlocation);
  }

  if (businessname) {
    sql += ' AND businessname = ?';
    params.push(businessname);
  }

  if (spanco) {
    sql += ' AND spanco = ?';
    params.push(spanco);
  }

  if (fromDate && toDate) {
    sql += ' AND dateofnextmeeting BETWEEN ? AND ?';
    params.push(fromDate, toDate);
  } else if (fromDate) {
    sql += ' AND dateofnextmeeting >= ?';
    params.push(fromDate);
  } else if (toDate) {
    sql += ' AND dateofnextmeeting <= ?';
    params.push(toDate);
  }

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching businesses:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const businesses = rows.map(row => ({
        businessname: row.businessname,
        dateofnextmeeting: row.dateofnextmeeting,
        dateOfProject: row.dateofproject,
        spanco: row.spanco,
        id: row.id,
        contactnumber:row.contactnumber,
        email:row.email
      }));
      res.json(businesses);
    }
  });
});

app.get('/suggestBusinessNames', (req, res) => {
  const { loginlocation, businessname } = req.query;
  const sql = 'SELECT DISTINCT businessname FROM orders WHERE loginlocation = ? AND businessname LIKE ?';
  const params = [loginlocation, `${businessname}%`]; // Use a wildcard for prefix matching

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching business name suggestions:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const suggestions = rows.map(row => row.businessname);
      res.json(suggestions);
    }
  });
});

app.delete('/categoriesde/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM categories WHERE id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Error deleting category' });
        return;
      }
      res.json({ message: 'Category deleted successfully' });
    }
  );
});

app.delete('/productsdel/:productName', (req, res) => {
  const { productName } = req.params;

  db.query(
    'DELETE FROM product_details WHERE Product_Name = ?',
    [productName],
    (err, results) => {
      if (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Error deleting product' });
        return;
      }
      res.json({ message: 'Product deleted successfully' });
    }
  );
});

app.get('/productDetails/:productName', (req, res) => {
  const { productName } = req.params;

  db.query(
    'SELECT Product_Price, Product_Discount, Note FROM product_details WHERE Product_Name = ?',
    [productName],
    (err, results) => {
      if (err) {
        console.error('Error fetching product details:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      const { Product_Price, Product_Discount, Note } = results[0];
      res.json({ Product_Price, Product_Discount, Note });
    }
  );
});
app.get('/adminloginlocations', (req, res) => {
  const sql = 'SELECT DISTINCT UserName FROM users_database'; // Assuming the table name is 'users'
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching login locations:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const loginLocations = rows.map(row => row.UserName);
      res.json(loginLocations);
    }
  });
});

// Backend route to handle fetching business names from orders table
app.get('/businessnames', (req, res) => {
  const sql = 'SELECT DISTINCT businessname FROM orders'; // Assuming the column name is 'BusinessName' in the orders table
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching business names:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const businessNames = rows.map(row => row.BusinessName);
      res.json(businessNames);
    }
  });
});


app.get('/admincountires', (req, res) => {
  const sql = 'SELECT DISTINCT Country FROM users_database'; // Assuming the table name is 'users'
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching login locations:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const country = rows.map(row => row.Country);
      res.json(country);
    }
  });
});

app.get('/adminstates', (req, res) => {
  const { country } = req.query;



  const sql = 'SELECT DISTINCT State FROM users_database WHERE country = ?'; 
  // Assuming the table name is 'users_database'
  db.query(sql, [country], (err, rows) => {
    if (err) {
      console.error('Error fetching states:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const states = rows.map(row => row.State);
      res.json(states);
    }
  });
});

app.get('/admindistricts', (req, res) => {
  const { state } = req.query;

  const sql = 'SELECT DISTINCT District FROM users_database WHERE state = ?'; // Assuming the table name is 'users'
  db.query(sql,[state], (err, rows) => {
    if (err) {
      console.error('Error fetching login locations:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const district = rows.map(row => row.District);
      res.json(district);
    }
  });
});

app.get('/admincompany', (req, res) => {
  const sql = 'SELECT DISTINCT businessname FROM orders'; // Assuming the table name is 'users'
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching login locations:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const businessname = rows.map(row => row.businessname);
      res.json(businessname);
    }
  });
});

app.get('/adminareas', (req, res) => {
  const { district } = req.query;

  const sql = 'SELECT DISTINCT Area FROM users_database WHERE district = ?'; // Assuming the table name is 'users'
  db.query(sql,[district] ,(err, rows) => {
    if (err) {
      console.error('Error fetching login locations:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const area = rows.map(row => row.Area);
      res.json(area);
    }
  });
});




app.get('/newcat', (req, res) => {
  db.query('SELECT  Category FROM categories', (err, results) => {
    if (err) {
      console.error('Error fetching positions:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    const categories = results.map((result) => result.Category);
    res.json(categories);
  });
});


app.get('/newp', (req, res) => {
  const sql = 'SELECT DISTINCT Product_Name FROM product_details'; // Assuming the column name is 'category'
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const products = rows.map(row => row.Product_Name);
      res.json(products);
    }
  });
});

app.get('/adminfollow', (req, res) => {
  let sql = 'SELECT businessname, dateofnextmeeting, product,dateofproject, spanco, contact_status,  id, Country, State, District, contactnumber, Area, email FROM orders WHERE 1=1';
  let params = [];

  const {
    spanco,
    fromDate,
    toDate,
    name,
    Country,
    State,
    District,
    Area,
    Location,
    PhoneNumber,
    BusinessID,
    selectedDate,
    BusinessName,
  } = req.query;

  if (BusinessName) {
    sql += ' AND businessname = ?';
    params.push(BusinessName);
  }

  if (spanco) {
    sql += ' AND spanco = ?';
    params.push(spanco);
  }

  if (selectedDate) { // Use selectedDate here
    sql += ' AND dateofnextmeeting = ?';
    params.push(selectedDate);
  }

  if (fromDate && toDate) {
    sql += ' AND dateofnextmeeting >= ? AND dateofnextmeeting <= ?';
    params.push(fromDate, toDate);
  }

  if (name) {
    sql += ' AND businessname = ?';
    params.push(name);
  }

  if (Country) {
    sql += ' AND Country = ?';
    params.push(Country);
  }

  if (State) {
    sql += ' AND State = ?';
    params.push(State);
  }

  if (District) {
    sql += ' AND District = ?';
    params.push(District);
  }

  if (Area) {
    sql += ' AND Area = ?';
    params.push(Area);
  }

  if (Location) {
    sql += ' AND loginlocation = ?';
    params.push(Location);
  }

  if (PhoneNumber) {
    sql += ' AND contactnumber = ?';
    params.push(PhoneNumber);
  }

  if (BusinessID) {
    sql += ' AND id = ?';
    params.push(BusinessID);
  }

  
db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching businesses:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const businesses = rows.map(row => ({
        businessname: row.businessname,
        dateofnextmeeting: row.dateofnextmeeting,
        spanco: row.spanco,
        id: row.id,
        Country: row.Country,
        State: row.State,
        District: row.District,
        Area: row.Area,
        contactnumber : row.contactnumber,
        email: row.email,
        dateofproject : row.dateofproject,
        contact_status: row.contact_status,
        
      }));
      res.json(businesses);
    }
  });
});



app.get('/admindistricts', (req, res) => {
  const { state } = req.query;

  const sql = 'SELECT DISTINCT District FROM users_database WHERE state = ?'; // Assuming the table name is 'users'
  db.query(sql,[state], (err, rows) => {
    if (err) {
      console.error('Error fetching login locations:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const district = rows.map(row => row.District);
      res.json(district);
    }
  });
});
app.put('/updateMeetingDate', (req, res) => {
  const { date } = req.body;

  // Update the dateofnextmeeting field in the orders table
  const query = `UPDATE orders SET dateofnextmeeting = ? WHERE (dateofnextmeeting IS NULL OR dateofnextmeeting < ?) AND spanco != 'Close'`;

  db.query(query, [date, date], (err, results) => {
    if (err) {
      console.error('Error updating meeting date:', err);
      res.status(500).send('Error updating meeting date');
      return;
    }
    console.log('Meeting date updated successfully');
    res.sendStatus(200); // Sending 200 OK status assuming the update was successful
  });
});

app.get('/adminproductcountstoday', (req, res) => {
  const { loginlocation } = req.query;
  let sql = 'SELECT product, COUNT(product) AS product_count FROM orders WHERE 1=1';
  let params = [];

  if (loginlocation) {
    sql += ' AND loginlocation = ?';
    params.push(loginlocation);
  }
  console.log(`Backend: ${loginlocation}`)

  sql += ' GROUP BY product';

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching product counts:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const productCounts = rows.reduce((acc, row) => {
        acc[row.product] = row.product_count;
        return acc;
      }, {});

      res.json(productCounts);
    }
  });
});


app.get('/adminproductcounts', (req, res) => {
  let sql = 'SELECT product, COUNT(product) AS product_count FROM orders WHERE 1=1';
  let params = [];

  const {
    Country,
    State,
    District,
    Area,
    Location
  } = req.query;

  if (Country) {
    sql += ' AND Country = ?';
    params.push(Country);
  }

  if (State) {
    sql += ' AND State = ?';
    params.push(State);
  }

  if (District) {
    sql += ' AND District = ?';
    params.push(District);
  }

  if (Area) {
    sql += ' AND Area = ?';
    params.push(Area);
  }

  if (Location) {
    sql += ' AND loginlocation = ?';
    params.push(Location);
  }

  sql += ' GROUP BY product'; // Group by product after applying filters

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching product counts:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const productCounts = rows.reduce((acc, row) => {
        acc[row.product] = row.product_count;
        return acc;
      }, {});

      res.json(productCounts);
    }
  });
});



app.get('/adminfollowproducttoday', (req, res) => {
  let sql = 'SELECT businessname, dateofnextmeeting, product,dateofproject, spanco, contact_status,  id, Country, State, District, contactnumber, Area, email FROM orders WHERE 1=1';
  let params = [];


  const {
    productName,
    username
  } = req.query;


  if (productName) {
    sql += ' AND product = ?'; // Added space before AND
    params.push(productName);
  }
  if(username){
    sql += ' AND loginlocation = ?'; // Added space before AND
    params.push(username);
  }
  
db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching businesses:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const businesses = rows.map(row => ({
        businessname: row.businessname,
        dateofnextmeeting: row.dateofnextmeeting,
        spanco: row.spanco,
        id: row.id,
        Country: row.Country,
        State: row.State,
        District: row.District,
        Area: row.Area,
        contactnumber : row.contactnumber,
        email: row.email,
        dateofproject : row.dateofproject,
        contact_status: row.contact_status,
        productName : row.product
        
      }));
      res.json(businesses);
    }
  });
});


app.get('/adminfollowproduct', (req, res) => {
  let sql = 'SELECT businessname, dateofnextmeeting, product,dateofproject, spanco, contact_status,  id, Country, State, District, contactnumber, Area, email FROM orders WHERE 1=1';
  let params = [];

  const {

    productName,
    Location,
    Country,
    State,
    District,
    Area
  } = req.query;


  if (productName) {
    sql += ' AND product = ?'; // Added space before AND
    params.push(productName);
  }
  if (Country) {
    sql += ' AND Country = ?';
    params.push(Country);
  }

  if (State) {
    sql += ' AND State = ?';
    params.push(State);
  }

  if (District) {
    sql += ' AND District = ?';
    params.push(District);
  }

  if (Area) {
    sql += ' AND Area = ?';
    params.push(Area);
  }

  if (Location) {
    sql += ' AND loginlocation = ?';
    params.push(Location);
  }
db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching businesses:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const businesses = rows.map(row => ({
        businessname: row.businessname,
        dateofnextmeeting: row.dateofnextmeeting,
        spanco: row.spanco,
        id: row.id,
        Country: row.Country,
        State: row.State,
        District: row.District,
        Area: row.Area,
        contactnumber : row.contactnumber,
        email: row.email,
        dateofproject : row.dateofproject,
        contact_status: row.contact_status,
        productName : row.product
        
      }));
      res.json(businesses);
    }
  });
});


app.get('/admin/positions', (req, res) => {
  const sql = 'SELECT id, position FROM positions';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching positions:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});
app.put('/admin/positions/:id', (req, res) => {
  const { id } = req.params;
  const { Position_Name } = req.body;

  db.query(
    'UPDATE positions SET position = ? WHERE id = ?',
    [Position_Name, id],
    (err, results) => {
      if (err) {
        console.error('Error updating position:', err);
        res.status(500).json({ error: 'Failed to update position' });
        return;
      }
      console.log('Position updated successfully');
      res.json({ message: 'Position updated successfully' });
    }
  );
});
app.delete('/admin/positions/:id', (req, res) => {
  const positionId = req.params.id;

  db.query(
    'DELETE FROM positions WHERE id = ?',
    [positionId],
    (err, result) => {
      if (err) {
        console.error('Error deleting position:', err);
        res.status(500).json({ error: 'Failed to delete position' });
        return;
      }
      console.log('Position deleted successfully');
      res.json({ message: 'Position deleted successfully' });
    }
  );
});
app.get('/admin/products', (req, res) => {
  const sql = 'SELECT id, Product_Name, Product_Price, Product_Discount, Note FROM product_details';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});
app.put('/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const { Product_Name, Product_Price, Product_Discount,Note } = req.body;

  db.query(
    'UPDATE product_details SET Product_Name = ?, Product_Price = ?, Product_Discount = ?,Note = ? WHERE id = ?',
    [Product_Name, Product_Price, Product_Discount, Note,id],
    (err, results) => {
      if (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Failed to update product' });
        return;
      }
      console.log('Product updated successfully');
      res.json({ message: 'Product updated successfully' });
    }
  );
});
app.delete('/admin/products/:id', (req, res) => {
  const productId = req.params.id;

  db.query(
    'DELETE FROM product_details WHERE id = ?',
    [productId],
    (err, result) => {
      if (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
        return;
      }
      console.log('Product deleted successfully');
      res.json({ message: 'Product deleted successfully' });
    }
  );
});
app.get('/admin/categories', (req, res) => {
  const sql = 'SELECT id, Category FROM categories';
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});
app.put('/admin/categories/:id', (req, res) => {
  const { id } = req.params;
  const { Category: newCategoryName } = req.body;

  db.query(
    'UPDATE categories SET Category = ? WHERE id = ?',
    [newCategoryName, id],
    (err, results) => {
      if (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Failed to update category' });
        return;
      }
      console.log('Category updated successfully');
      res.json({ message: 'Category updated successfully' });
    }
  );
});
app.delete('/admin/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  db.query(
    'DELETE FROM categories WHERE id = ?',
    [categoryId],
    (err, result) => {
      if (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Failed to delete category' });
        return;
      }
      console.log('Category deleted successfully');
      res.json({ message: 'Category deleted successfully' });
    }
  );
});

app.get('/admin/users', (req, res) => {
  const sql = 'SELECT id, UserName, Country,State,District,Area,Password FROM Users_Database'; // Include password field
  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});
app.put('/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const { username: newUsername,district: newDistrict, country:newCountry, state: newState, loginlocation: newLoginLocation, password: newPassword } = req.body;

  db.query(
    'UPDATE Users_Database SET UserName = ?, Password = ?, Country = ?, State = ?,District = ?, Area = ? WHERE id = ?',
    [newUsername,newPassword, newCountry,newState,newDistrict, newLoginLocation,  id],
    (err, results) => {
      if (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
        return;
      }
      console.log('User updated successfully');
      res.json({ message: 'User updated successfully' });
    }
  );
});
app.delete('/admin/users/:id', (req, res) => {
  const userId = req.params.id;
      db.query(
        'DELETE FROM Users_Database WHERE id = ?',
        [userId],
        (err, userDeleteResult) => {
          if (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ error: 'Failed to delete user' });
            return;
          }
          console.log('User deleted from users table successfully');
          res.json({ message: 'User and associated orders deleted successfully' });
        }
      );

});

app.use(bodyParser.json());

app.put('/update', (req, res) => {
  const { newData } = req.body;
  const { businessname } = req.query;

  db.query(
    'UPDATE orders SET ? WHERE businessname = ?',
    [newData, businessname],
    (err, results) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'Failed to update data' });
        return;
      }
      console.log('Data updated successfully');
      res.json({ message: 'Data updated successfully' });
    }
  );
});

app.get('/adminform', (req, res) => {
  const {id} = req.query; 
  const sql = 'SELECT * FROM orders WHERE id = ?';
  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error('Error fetching form data:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ error: 'Data not found' });
      } else {
        res.json(rows);
      }
    }
  });
});

app.delete('/admindelete', (req, res) => {
  const id = req.query.id;
  const loginlocation = req.query.loginlocation;

  if (!id || !loginlocation) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const deleteSQL = 'DELETE FROM orders WHERE id = ?';
  const decrementSQL = 'UPDATE users_database SET order_count = order_count - 1 WHERE username = ?';

  const deleteParams = [id];
  const decrementParams = [loginlocation];

  db.beginTransaction(function(err) {
    if (err) {
      console.error('Error beginning transaction:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    db.query(deleteSQL, deleteParams, (err, result) => {
      if (err) {
        console.error('Error deleting data:', err);
        return db.rollback(function() {
          res.status(500).json({ error: 'Internal server error' });
        });
      }

      db.query(decrementSQL, decrementParams, (err, result) => {
        if (err) {
          console.error('Error decrementing order_count:', err);
          return db.rollback(function() {
            res.status(500).json({ error: 'Internal server error' });
          });
        }

        db.commit(function(err) {
          if (err) {
            console.error('Error committing transaction:', err);
            return db.rollback(function() {
              res.status(500).json({ error: 'Internal server error' });
            });
          }
          res.json({ message: 'Data deleted successfully' });
        });
      });
    });
  });
});

app.use(bodyParser.json());



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

app.put('/adminupdate', (req, res) => {
  const { newData } = req.body;
  const { businessname } = req.query;
  const {id} = req.query;

  db.query(
    'UPDATE orders SET ? WHERE id = ?',
    [newData, id],
    (err, results) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'Failed to update data' });
        return;
      }
      console.log('Data updated successfully');
      res.json({ message: 'Data updated successfully' });
    }
  );
});

app.post('/new', (req, res) => {
  const loginLocation = req.query.loginlocation;
  const country = req.query.country;
  const state = req.query.state;
  const district = req.query.district;
  const area = req.query.area;
  const email = req.query.email;
  const payment = req.query.initialpayment;

  // Fetch order count for the login location from the database
  db.query('SELECT order_count FROM users_database WHERE username = ?', [loginLocation], (err, result) => {
    if (err) {
      console.error('Error fetching order count:', err);
      return res.status(500).json({ error: 'Failed to fetch order count' });
    }

    // Extract the order count from the result
    const orderCount = result && result.length > 0 ? result[0].order_count : 0;

    // Generate the unique order ID using the order count and specified format
    const orderId = `${getFirstLetter(country)}${getFirstLetter(state)}${getFirstLetter(district)}${getFirstLetterWithNumber(area)}-${(orderCount + 1).toString().padStart(0, '0')}`;

    // SQL query to insert the new order
    const sql = "INSERT INTO orders (`loginlocation`, `businessname`, `category`, `product`, `contactperson`, `position`, `contactnumber`, `whatsappnumber`, `spanco`, `dateofnextmeeting`, `dateofproject`,  `Country`, `State`, `District`, `Area`,`email`,`initialpayment`,`modeofpayment`,`id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

    // Values to be inserted into the database
    const values = [
      loginLocation,
      req.body.businessName,
      req.body.category,
      req.body.product,
      req.body.contactPerson,
      req.body.position,
      req.body.contactNumber,
      req.body.whatsappNumber,
      req.body.spanco,
      req.body.dateOfNextMeeting,
      req.body.dateOfProject,
      country,
      state,
      district,
      area,
      email,
      payment,
      req.body.modeOfPayment,
      orderId
    ];

    // Insert the new order into the database
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error adding order:', err);
        return res.status(500).json({ error: 'Failed to add order' });
      }
      
      // Increment the order count for the login location in the database
      db.query('UPDATE users_database SET order_count = order_count + 1 WHERE username = ?', [loginLocation], (err, result) => {
        if (err) {
          console.error('Error updating order count:', err);
          return res.status(500).json({ error: 'Failed to update order count' });
        }

        console.log('Order added successfully');
        res.json({ id: orderId, ...req.body }); // Send the new order along with its ID in the response
      });
    });
  });
});

// Function to extract the first letter from a string
function getFirstLetter(str) {
  return str.charAt(0).toUpperCase(); // Get the first letter and convert to uppercase
}

// Function to extract the first letter and any numbers from a string
function getFirstLetterWithNumber(str) {
  const match = str.match(/[a-zA-Z]/); // Match the first letter
  const numberMatch = str.match(/\d/); // Match the first number
  const letter = match ? match[0].toUpperCase() : ''; // Get the matched letter and convert to uppercase
  const number = numberMatch ? numberMatch[0] : ''; // Get the matched number
  return letter + number; // Combine the letter and number
}

// Assuming you're using Express.js for your backend

// Endpoint to fetch order count
app.get('/orderCount', (req, res) => {
  const { username } = req.query;
  // Fetch order count from the database
  const sql = 'SELECT order_count FROM users_database WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error fetching order count:', err);
      return res.status(500).json({ error: 'Failed to fetch order count' });
    }
    const orderCount = result && result.length > 0 ? result[0].order_count : 0;
    res.json({ orderCount });
  });
});
//drvino backend://////////////////////////////////////////////

// Add Data to Complaints
app.post('/addcomplaints', (req, res) => {
  const { complaint } = req.body;
  if (!complaint) {
    return res.status(400).json({ error: 'Complaint is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO complaints (id, complaint_text) VALUES (?, ?)';
  db.query(sql, [id, complaint], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add complaint');
    res.json({ message: 'Complaint added successfully', id });
  });
});

// Add Data to Vitals
app.post('/addvitals', (req, res) => {
  const { vital } = req.body;
  if (!vital) {
    return res.status(400).json({ error: 'Vital is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO vitals (id, vital_text) VALUES (?, ?)';
  db.query(sql, [id, vital], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add vital');
    res.json({ message: 'Vital added successfully', id });
  });
});

// Add Data to Examination
app.post('/addexamination', (req, res) => {
  const { examination } = req.body;
  if (!examination) {
    return res.status(400).json({ error: 'Examination is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO onexam (id, onexam_text) VALUES (?, ?)';
  db.query(sql, [id, examination], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add examination');
    res.json({ message: 'Examination added successfully', id });
  });
});

// Add Data to SystemicExamination
app.post('/addsystemicexamination', (req, res) => {
  const { systemicExamination } = req.body;
  if (!systemicExamination) {
    return res.status(400).json({ error: 'Systemic Examination is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO sysexam (id, eysexam_text) VALUES (?, ?)';
  db.query(sql, [id, systemicExamination], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add systemic examination');
    res.json({ message: 'Systemic Examination added successfully', id });
  });
});

// Add Data to Tests
app.post('/addtests', (req, res) => {
  const { test } = req.body;
  if (!test) {
    return res.status(400).json({ error: 'Test is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO tests (id, test_text) VALUES (?, ?)';
  db.query(sql, [id, test], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add test');
    res.json({ message: 'Test added successfully', id });
  });
});

// Add Data to TreatmentGiven
app.post('/addtreatmentgiven', (req, res) => {
  const { treatment } = req.body;
  if (!treatment) {
    return res.status(400).json({ error: 'Treatment is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO teatmentgiven (id, treatmentgiven_text) VALUES (?, ?)';
  db.query(sql, [id, treatment], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add treatment');
    res.json({ message: 'Treatment added successfully', id });
  });
});

// Add Data to Drugs
app.post('/adddrugs', (req, res) => {
  const { drug } = req.body;
  if (!drug) {
    return res.status(400).json({ error: 'Drug is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO drugs (id, drug_text) VALUES (?, ?)';
  db.query(sql, [id, drug], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add drug');
    res.json({ message: 'Drug added successfully', id });
  });
});

// Add Data to Dosage
app.post('/adddosage', (req, res) => {
  const { dosage } = req.body;
  if (!dosage) {
    return res.status(400).json({ error: 'Dosage is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO dosage (id, dosage_text) VALUES (?, ?)';
  db.query(sql, [id, dosage], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add dosage');
    res.json({ message: 'Dosage added successfully', id });
  });
});

// Add Data to Timing
app.post('/addtiming', (req, res) => {
  const { timing } = req.body;
  if (!timing) {
    return res.status(400).json({ error: 'Timing is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO timing (id, timing_text) VALUES (?, ?)';
  db.query(sql, [id, timing], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add timing');
    res.json({ message: 'Timing added successfully', id });
  });
});

// Add Data to Duration
app.post('/addduration', (req, res) => {
  const { duration } = req.body;
  if (!duration) {
    return res.status(400).json({ error: 'Duration is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO duration (id, duration_text) VALUES (?, ?)';
  db.query(sql, [id, duration], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add duration');
    res.json({ message: 'Duration added successfully', id });
  });
});

// Add Data to AdviceGiven
app.post('/addadvicegiven', (req, res) => {
  const { advice } = req.body;
  if (!advice) {
    return res.status(400).json({ error: 'Advice is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO advicegiven (id, advicegiven_text) VALUES (?, ?)';
  db.query(sql, [id, advice], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add advice');
    res.json({ message: 'Advice added successfully', id });
  });
});

// Add Data to Vaccine
app.post('/addvaccine', (req, res) => {
  const { vaccine } = req.body;
  if (!vaccine) {
    return res.status(400).json({ error: 'Vaccine is required' });
  }

  const id = uuidv4();
  const sql = 'INSERT INTO vaccine (id, vaccine_text) VALUES (?, ?)';
  db.query(sql, [id, vaccine], (err, results) => {
    if (err) return handleError(err, res, 'Failed to add vaccine');
    res.json({ message: 'Vaccine added successfully', id });
  });
});


app.listen(8081, ()=>{
  console.log("Listening")
})