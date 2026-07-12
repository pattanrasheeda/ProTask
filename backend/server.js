const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // ✅ Import Task Routes
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ➕ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));

// 🔐 Routes
app.use('/api/auth', authRoutes);     // ✅ Auth routes
app.use('/api/tasks', taskRoutes);    // ✅ Task routes (Protected using authMiddleware inside taskRoutes.js)

// 🌐 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
