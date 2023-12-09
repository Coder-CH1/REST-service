var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 5000;

//To parse JSON requests
app.use(bodyParser.json());

//Sample in-memory data for gateways and peripheral devices
let gateways = [
  {
    serialNumber: 'GW123',
    name: 'Gateway 1',
    ipAddress: '192.168.1.1',
    devices: [
      { uid: 1, vendor: 'Vendor A', dateCreated: new Date(), status: 'online' },
      { uid: 2, vendor: 'Vendor B', dateCreated: new Date(), status: 'offline' },
    ],
  },
];

//Validation function for IP address
function isValidIpAddress(ipAddress) {
// Implement your validation logic here
// For simplicity, let's assume any non-empty string is valid
  return ipAddress && typeof ipAddress === 'string';
}

// Routes

// Get all gateways
app.get('/gateways', (req, res) => {
  res.json(gateways);
});

// Get a specific gateway by serial number
app.get('/gateways/:serialNumber', (req, res) => {
  const serialNumber = req.params.serialNumber;
  const gateway = gateways.find((g) => g.serialNumber === serialNumber);

  if (gateway) {
    res.json(gateway);
  } else {
    res.status(404).json({ error: 'Gateway not found' });
  }
});

//Create a new gateway
app.post('/gateways', (req, res) => {
  const { serialNumber, name, ipAddress, devices } = req.body;

//Validate fields
  if (!serialNumber || !name || !isValidIpAddress(ipAddress) || (devices && devices.length > 10)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const newGateway = { serialNumber, name, ipAddress, devices: devices || [] };
  gateways.push(newGateway);
  res.status(201).json(newGateway);
});

//Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});  