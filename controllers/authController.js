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
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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


    console.log("✅ Login success:", {
      token,
      role: user.role,
      username: user.username
    });

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

