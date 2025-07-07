const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: String,
  phone: String,
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'employee', 'customer'], default: 'customer' } ,
   fcmToken: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
