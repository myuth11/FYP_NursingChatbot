const express = require('express');
const router = express.Router();
const { saveChatMessage, getChatHistory } = require('../controllers/chatHistoryController');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.post('/save', saveChatMessage);
router.get('/history', getChatHistory);

module.exports = router;
