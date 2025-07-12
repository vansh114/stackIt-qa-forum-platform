const express = require('express');
const router = express.Router();

const {
    askQuestion,
    getAllQuestions,
    getQuestionById,
    deleteQuestion,
} = require('../controllers/questionController');

const fetchUser = require('../middleware/fetchUser');

router.post('/', fetchUser, askQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.delete('/:id', fetchUser, deleteQuestion);

module.exports = router;
