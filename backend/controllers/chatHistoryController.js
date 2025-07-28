const ChatHistory = require('../models/chatHistory');
const User = require('../models/userModel');

// Save a chat message
exports.saveChatMessage = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const userId = req.user._id;
    let history = await ChatHistory.findOne({ user: userId });
    if (!history) {
      history = await ChatHistory.create({ user: userId, messages: [{ question, answer }] });
    } else {
      history.messages.push({ question, answer });
      history.lastUpdated = Date.now();
      await history.save();
    }
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await ChatHistory.findOne({ user: userId });
    res.json(history ? history.messages : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
