const express = require("express");
const router = express.Router();
const {
  sendNotification,
  getNotifications
} = require("../controllers/notificationController");

const auth = require("../middleware/authMiddleware");

router.post(
  "/send",
  auth,
  (req, res, next) => {
    const allowedRoles = ["admin", "employee"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  },
  sendNotification
);

router.get("/", auth, getNotifications);

module.exports = router;
