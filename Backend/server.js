const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const authRoutes = require('./routes/auth');

if (process.env.VERCEL) {
  app.use('/', authRoutes);
} else {
  app.use('/api/auth', authRoutes);
}
app.get('/', (req, res) => {
  res.send('Welcome! Your app is working 🚀');
});

// For Vercel deployment
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}