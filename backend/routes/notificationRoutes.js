const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const {
  getNotifications,
  markAllAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', fetchUser, getNotifications);
router.patch('/read', fetchUser, markAllAsRead);

module.exports = router;