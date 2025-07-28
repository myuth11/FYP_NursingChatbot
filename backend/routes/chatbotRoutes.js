const express = require('express');
const router = express.Router();
const { handleChatbotMessage } = require('../controllers/chatbotController');

// POST /chatbot
router.post('/', handleChatbotMessage);

module.exports = router;
