const { validationResult } = require('express-validator');
const Question = require('../models/Question');

exports.askQuestion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

    const { title, description, tags } = req.body;

    try {
        const question = new Question({
            title,
            description,
            tags,
            askedBy: req.user.id,
        });

        await question.save();

        res.status(201).json({ success: true, question });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('askedBy', 'username')
            .sort({ createdAt: -1 });

        res.json({ success: true, questions });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('askedBy', 'username')
            .populate({
                path: 'answers',
                populate: { path: 'answeredBy', select: 'username' },
            });

        if (!question) {
            return res.status(404).json({ success: false, error: 'Question not found' });
        }

        res.json({ success: true, question });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, error: 'Question not found' });
        }

        if (question.askedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        await question.deleteOne();

        res.json({ success: true, message: 'Question deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};