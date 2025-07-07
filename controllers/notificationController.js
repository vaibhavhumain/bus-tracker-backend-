const messaging = require("../firebase/fireBaseAdmin");

exports.sendNotification = async (req, res) => {
  try {
    const { title, body, token } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ message: "Token, title, and body are required" });
    }

    const message = {
      notification: { title, body },
      token,
    };

    const response = await messaging.send(message);
    res.status(200).json({ message: "Notification sent", response });
  } catch (error) {
    console.error("FCM Error:", error);
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
};
