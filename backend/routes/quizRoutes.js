const express = require('express');
const router = express.Router();
const { saveQuizResult, getQuizResults } = require('../controllers/quizController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.post('/results', saveQuizResult);
router.get('/results', getQuizResults);

module.exports = router;
