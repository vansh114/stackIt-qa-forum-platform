const express = require('express');
const { body, param } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const checkAdmin = require('../middleware/checkAdmin');
const {
    getReportedContent,
    disableUser,
    deleteQuestion,
    deleteAnswer
} = require('../controllers/adminController');

const router = express.Router();

router.use(fetchUser, checkAdmin);

router.get('/reports', getReportedContent);

router.patch(
    '/disable/:userId',
    [param('userId', 'Invalid user ID').isMongoId()],
    disableUser
);

router.delete(
    '/question/:id',
    [param('id', 'Invalid question ID').isMongoId()],
    deleteQuestion
);

router.delete(
    '/answer/:id',
    [param('id', 'Invalid answer ID').isMongoId()],
    deleteAnswer
);

module.exports = router;