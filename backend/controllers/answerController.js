const { validationResult } = require('express-validator');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

exports.postAnswer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

    const { content } = req.body;
    const questionId = req.params.questionId;

    try {
        const question = await Question.findById(questionId);
        if (!question)
            return res.status(404).json({ success: false, error: 'Question not found' });

        const answer = new Answer({
            content,
            question: questionId,
            answeredBy: req.user.id,
        });

        await answer.save();

        question.answers.push(answer._id);
        await question.save();

        res.status(201).json({ success: true, answer });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.voteAnswer = async (req, res) => {
    const answerId = req.params.answerId;
    const { vote } = req.body; // +1 or -1

    try {
        const answer = await Answer.findById(answerId);
        if (!answer) return res.status(404).json({ success: false, error: 'Answer not found' });

        const existingVote = answer.voters.find(
            (v) => v.user.toString() === req.user.id
        );

        if (existingVote) {
            if (existingVote.vote === vote) {
                return res.status(400).json({ success: false, error: 'Already voted' });
            } else {
                answer.votes += vote * 2;
                existingVote.vote = vote;
            }
        } else {
            answer.votes += vote;
            answer.voters.push({ user: req.user.id, vote });
        }

        await answer.save();
        res.json({ success: true, votes: answer.votes });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.acceptAnswer = async (req, res) => {
    const answerId = req.params.answerId;

    try {
        const answer = await Answer.findById(answerId).populate('question');
        if (!answer) return res.status(404).json({ success: false, error: 'Answer not found' });

        const question = await Question.findById(answer.question._id);
        if (question.askedBy.toString() !== req.user.id)
            return res.status(403).json({ success: false, error: 'Unauthorized' });

        if (question.acceptedAnswer) {
            await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
        }

        question.acceptedAnswer = answerId;
        answer.isAccepted = true;

        await answer.save();
        await question.save();

        res.json({ success: true, message: 'Answer marked as accepted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};