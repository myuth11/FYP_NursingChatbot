const axios = require('axios');

// Remove all lines containing <<<<<<< HEAD, =======, and >>>>>>> ... markers
const handleChatbotMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    // Forward message to Python FastAPI LangChain backend
    const response = await axios.post('http://localhost:8000/chat', { question: message });
    const answer = response.data?.answer || "Sorry, I couldn't process your question.";
    res.json({ message: answer, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};

module.exports = {
  handleChatbotMessage,
};
