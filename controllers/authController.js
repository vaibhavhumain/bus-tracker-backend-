const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.register = async (req, res) => {
  try {
    const { name, phone, username, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, phone, username, password: hashed, role: role || 'customer' }); 
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    const token = jwt.sign(
  {
    userId: user._id,
    role: user.role,
    username: user.username,
    name: user.name,
    phone: user.phone
  },
  JWT_SECRET,
  { expiresIn: '1d' }
);
    res.json({
  token,
  role: user.role,
  username: user.username,
  name: user.name,      
  phone: user.phone   
});

  } catch (err) {
    console.error("💥 Login error:", err.message);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};


// controllers/authController.js
exports.saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { fcmToken } = req.body;

    if (!fcmToken) return res.status(400).json({ message: "FCM token is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fcmToken = fcmToken;
    await user.save();

    res.status(200).json({ message: "FCM token saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
