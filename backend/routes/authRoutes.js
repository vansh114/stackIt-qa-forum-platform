const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');

router.post(
  '/register',
  [
    body('username', 'Username must be at least 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'admin']),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  authController.login
);

module.exports = router;