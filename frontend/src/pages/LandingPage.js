import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate
import '../index.css'; // Global styles

const LandingPage = () => {
  const navigate = useNavigate(); // ✅ Define navigate

  return (
    <div className="landing-page">
      <header className="landing-header">
        <img
          src="/logo.jpg" // ✅ Make sure logo.jpg is in /public
          alt="KK Women's and Children's Hospital"
          className="logo"
        />
      </header>

      <main className="landing-main">
        <h2 className="chatbot-title">NurseAid</h2>
        <img
          src="/robot.png" // ✅ Make sure robot.png is in /public
          alt="Chatbot"
          className="robot-image"
        />
        <h3 className="chatbot-subtitle">NurseAid Chatbot</h3>
        <p className="chatbot-tagline">
          "Ask me about protocols, medications, or nursing education"
        </p>
        <button className="start-chat-button" onClick={() => navigate('/chat')}>
          Start Chat
        </button>
      </main>

      <footer className="suggested-questions">
        <button>“What are the signs of preeclampsia?”</button>
        <button>“How do I calculate pediatric medication dosages?”</button>
        <button>“Show me neonatal resuscitation steps.”</button>
        <button>“What’s the latest guideline for postpartum care?”</button>
      </footer>
    </div>
  );
};

export default LandingPage;
