const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Fetch full user object including fcmToken
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user; // ✅ Attach complete user to req
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token', details: err.message });
  }
};
