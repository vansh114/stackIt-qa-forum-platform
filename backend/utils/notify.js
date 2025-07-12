const Notification = require('../models/Notification');

exports.createNotification = async ({ recipientId, senderId, type, content, link }) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
      link,
    });
    await notification.save();
  } catch (err) {
    console.error('Notification Error:', err.message);
  }
};