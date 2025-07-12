const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};