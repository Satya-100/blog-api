const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Connecting to MongoDB
const mongoose = require('mongoose');
const dbURI = process.env.MONGO_DB_URI;

if (!dbURI) {
  console.error('MONGO_DB_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(dbURI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
const userRoutes = require('./routes/user.routes');
app.use('/api/v1/user', userRoutes);


app.listen(port, () => console.log(`Server is running on port ${port}`));