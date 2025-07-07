const messaging = require("../firebase/fireBaseAdmin");
const Notification = require("../models/NotificationModel"); // Ensure this file exists

// 🔔 Send FCM Notification and save it to DB
exports.sendNotification = async (paramsOrReq, res = null) => {
  try {
    const isFromController = !paramsOrReq.body; // Check if direct call

    const title = isFromController ? paramsOrReq.title : paramsOrReq.body.title;
    const body = isFromController ? paramsOrReq.body : paramsOrReq.body.body;
    const token = isFromController ? paramsOrReq.token : paramsOrReq.body.token;
    const receiverId = isFromController ? paramsOrReq.receiverId : paramsOrReq.body.receiverId;
    const user = isFromController ? paramsOrReq.user : paramsOrReq.user;

    if (!token || !title || !body) {
      if (res) return res.status(400).json({ message: "Token, title, and body are required" });
      return;
    }

    const message = {
      notification: { title, body },
      token,
    };

    const response = await messaging.send(message);

    await Notification.create({
      title,
      body,
      sentBy: user._id,
      sentToToken: token,
      sentToUser: receiverId || null,
      createdAt: new Date(),
    });

    if (res) res.status(200).json({ message: "Notification sent", response });
  } catch (error) {
    console.error("FCM Error:", error);
    if (res) res.status(500).json({ message: "Failed to send notification", error: error.message });
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
