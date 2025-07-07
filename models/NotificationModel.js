const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  body: String,
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  sentToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  sentToToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
