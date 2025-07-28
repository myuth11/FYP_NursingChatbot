const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: String },
  score: { type: Number, required: true },
  answers: [{ question: String, answer: String, correct: Boolean }],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
