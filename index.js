
var express = require('express');
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');
var app = express();
var port = 5000;

// To parse JSON requests
app.use(bodyParser.json());

// Create SQLite database connection
var db = new sqlite3.Database('gateways.db');

// Create 'gateways' table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS gateways (
    serialNumber TEXT PRIMARY KEY,
    name TEXT,
    ipAddress TEXT,
    devices TEXT
  )
`);

// Validation function for IP address
function isValidIpAddress(ipAddress) {
/** Implement your validation logic here
For simplicity, let's assume any non-empty string is valid **/
  return ipAddress && typeof ipAddress === 'string';
}

// Routes

// Get all gateways from the database
app.get('/gateways', (req, res) => {
  db.all('SELECT * FROM gateways', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

// Get a specific gateway by serial number
app.get('/gateways/:serialNumber', (req, res) => {
  const serialNumber = req.params.serialNumber;
  db.get('SELECT * FROM gateways WHERE serialNumber = ?', [serialNumber], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Gateway not found' });
    }
  });
});

// Create a new gateway and store it in the database
app.post('/gateways', (req, res) => {
  const { serialNumber, name, ipAddress, devices } = req.body;

  // Validate fields
  if (!serialNumber || !name || !isValidIpAddress(ipAddress) || (devices && devices.length > 10)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  // Insert new gateway into the database
  db.run('INSERT INTO gateways VALUES (?, ?, ?, ?)', [serialNumber, name, ipAddress, JSON.stringify(devices || [])], (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ serialNumber, name, ipAddress, devices: devices || [] });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
