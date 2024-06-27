require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const errorHandler = require('./middleware/errorHandler');
const plaidRoutes = require('./routes/plaid');
const userRoutes = require('./routes/users');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/plaid', plaidRoutes);
app.use('/users', userRoutes);

// Use error handler middleware
app.use(errorHandler);

app.listen(8000, () => {
  console.log('Server is running on port 8000');
}); 