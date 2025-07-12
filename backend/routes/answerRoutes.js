const express = require('express');
const { body } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const {
    postAnswer,
    voteAnswer,
    acceptAnswer,
} = require('../controllers/answerController');

const router = express.Router();

router.post(
    '/:questionId',
    fetchUser,
    [body('content', 'Answer content is required').notEmpty()],
    postAnswer
);

router.patch(
    '/vote/:answerId',
    fetchUser,
    [body('vote', 'Vote must be +1 or -1').isIn([1, -1])],
    voteAnswer
);

router.patch('/accept/:answerId', fetchUser, acceptAnswer);

module.exports = router;