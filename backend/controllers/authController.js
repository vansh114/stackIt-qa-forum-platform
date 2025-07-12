const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "v@n$hi$m@k!ngth3w3b$!t3";

exports.register = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success, errors: errors.array() });

  const { username, email, password, role } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success, error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const authToken = jwt.sign(payload, JWT_SECRET);
    success = true;
    res.json({
      success,
      authToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};

exports.login = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success, errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.isDeleted) {
      return res.status(403).json({
        success: false,
        error: 'Invalid credentials or account deactivated',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(403).json({ success: false, error: 'Invalid credentials' });

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const authToken = jwt.sign(payload, JWT_SECRET);
    success = true;
    res.json({
      success,
      authToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};