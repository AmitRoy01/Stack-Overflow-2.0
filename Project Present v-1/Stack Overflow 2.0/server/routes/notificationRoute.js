const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/notification', authMiddleware, async (req, res) => {
  try {
    // Find notifications specific to the logged-in user
    const notifications = await Notification.find({ userId: req.user._id });
    
    if (notifications.length) {
      res.status(200).json(notifications);
      console.log(notifications);
    } else {
      res.status(404).json({ message: 'No notifications found' });
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = router;
