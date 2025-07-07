const messaging = require("../firebase/fireBaseAdmin");
const Notification = require("../models/NotificationModel"); // Ensure this file exists

// 🔔 Send FCM Notification and save it to DB
exports.sendNotification = async (req, res) => {
  try {
    const { title, body, token, receiverId } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ message: "Token, title, and body are required" });
    }

    const message = {
      notification: { title, body },
      token,
    };

    const response = await messaging.send(message);

    // ✅ Save notification to DB
    await Notification.create({
      title,
      body,
      sentBy: req.user._id,
      sentToToken: token,
      sentToUser: receiverId || null,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Notification sent", response });
  } catch (error) {
    console.error("FCM Error:", error);
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
};

// 📥 Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { sentToToken: req.user.fcmToken },
        { sentToUser: req.user._id }
      ]
    })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
