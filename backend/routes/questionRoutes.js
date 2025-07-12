const express = require('express');
const { body } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const {
    askQuestion,
    getAllQuestions,
    getQuestionById,
    deleteQuestion,
} = require('../controllers/questionController');

const router = express.Router();
router.post(
    '/',
    fetchUser,
    [
        body('title', 'Title must be at least 5 characters').isLength({ min: 5 }),
        body('description', 'Description is required').notEmpty(),
        body('tags', 'Tags must be an array').isArray(),
    ],
    askQuestion
);

router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.delete('/:id', fetchUser, deleteQuestion);

module.exports = router;