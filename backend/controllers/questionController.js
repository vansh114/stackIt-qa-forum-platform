const Question = require('../models/Question');
const User = require('../models/User');

const askQuestion = async (req, res) => {
    const { title, description, tags } = req.body;

    if (!title || !description || !tags || tags.length === 0) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const question = await Question.create({
            title,
            description,
            tags,
            author: req.user._id,
        });

        res.status(201).json(question);
    } catch (err) {
        console.error('Ask Question Error:', err.message);
        res.status(500).json({ error: 'Server error while asking question' });
    }
};

const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('author', 'username email')
            .sort({ createdAt: -1 });

        res.json(questions);
    } catch (err) {
        console.error('Fetch Questions Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};

const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('author', 'username email')
            .populate({
                path: 'answers',
                populate: {
                    path: 'author',
                    select: 'username email',
                },
            });

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json(question);
    } catch (err) {
        console.error('Get Question Error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (
            question.author.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ error: 'Not authorized to delete this question' });
        }

        await question.deleteOne();

        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        console.error('Delete Question Error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    askQuestion,
    getAllQuestions,
    getQuestionById,
    deleteQuestion,
};
