const { validationResult } = require('express-validator');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');


exports.getReportedContent = async (req, res) => {
  try {
    const flaggedQuestions = await Question.find({ isFlagged: true }).populate('askedBy', 'username email');
    const flaggedAnswers = await Answer.find({ isFlagged: true }).populate('answeredBy', 'username email');

    res.json({
      success: true,
      flaggedQuestions,
      flaggedAnswers,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.disableUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, error: 'User not found' });

    user.isDeleted = true;
    await user.save();

    res.json({ success: true, message: 'User account has been disabled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.deleteQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const questionId = req.params.id;

  try {
    const question = await Question.findById(questionId);
    if (!question)
      return res.status(404).json({ success: false, error: 'Question not found' });

    await question.deleteOne();

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



exports.deleteAnswer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const answerId = req.params.id;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer)
      return res.status(404).json({ success: false, error: 'Answer not found' });

    await answer.deleteOne();

    res.json({ success: true, message: 'Answer deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};