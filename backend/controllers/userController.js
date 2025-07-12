const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || user.isDeleted)
      return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user || user.isDeleted)
      return res.status(404).json({ success: false, error: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated', user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, error: 'User not found' });

    user.isDeleted = true;
    await user.save();

    res.json({ success: true, message: 'Account deactivated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};