import React from 'react';

const ChatBotIntroCard = () => (
  <div className="chatbot-intro-card">
    <h1>NurseAid Chatbot</h1>
    <p>“Ask me about protocols, medications, or nursing education”</p>
    <button>Start Chat</button>
    <div className="suggested-questions">
      <button>What are the signs of preeclampsia?</button>
      <button>How do I calculate pediatric medication dosages?</button>
    </div>
  </div>
);

export default ChatBotIntroCard;