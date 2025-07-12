const express = require('express');
const { body } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const {
  getProfile,
  updateProfile,
  deactivateAccount,
} = require('../controllers/userController');

const router = express.Router();

router.get('/me', fetchUser, getProfile);

router.put(
  '/update',
  fetchUser,
  [
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').optional().isEmail().withMessage('Provide a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  updateProfile
);

router.delete('/deactivate', fetchUser, deactivateAccount);

module.exports = router;