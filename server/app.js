const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const cors = require('cors');
const app = express();
const connectDB = require('./utils/db');
const checkRoutes = require('./routes/check');

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}));
app.use(express.json());


connectDB();

app.use('/api/check', checkRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'ScamShield API', version: '0.1.0' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
