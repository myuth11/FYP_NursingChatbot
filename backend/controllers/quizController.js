const QuizResult = require('../models/quizResult');
const User = require('../models/userModel');

// Save quiz result
exports.saveQuizResult = async (req, res) => {
  try {
    const { quizId, score, answers } = req.body;
    const userId = req.user._id;
    const result = await QuizResult.create({ user: userId, quizId, score, answers });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all quiz results for a user
exports.getQuizResults = async (req, res) => {
  try {
    const userId = req.user._id;
    const results = await QuizResult.find({ user: userId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
