const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

// Load environment variables
dotenv.config();

console.log('Client ID:', process.env.CLIENT_ID);
console.log('Client Secret:', process.env.CLIENT_SECRET);
console.log('Redirect URI:', process.env.REDIRECT_URI);

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
