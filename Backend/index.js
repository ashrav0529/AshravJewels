const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (MongoDB or JSON Fallback)
connectDB().then(() => {
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders', require('./routes/orders'));

  // Serve Static Frontend Files
  app.use(express.static(path.join(__dirname, 'public')));

  // For any other route, redirect to homepage or serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Start Server
  app.listen(PORT, () => {
    console.log(`===============================================================`);
    console.log(`  ASHRAV JEWELS SERVER IS RUNNING`);
    console.log(`  Local Address: http://localhost:${PORT}`);
    console.log(`  Date: ${new Date().toLocaleString()}`);
    console.log(`===============================================================`);
  });
});