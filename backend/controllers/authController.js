const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  let { name, email, password } = req.body;

  try {
    email = email.toLowerCase().trim(); // Normalize email

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Registering user:", email);
    console.log("🔐 Hashed Password:", hashedPassword);

    // Create the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

// Login user and return JWT
exports.login = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email.toLowerCase().trim(); // Normalize email

    console.log("🔑 Attempting login with:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("👤 User found:", user.email);
    console.log("🔐 Stored hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};
