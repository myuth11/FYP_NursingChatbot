import React, { useState, useRef, useEffect, useCallback } from 'react'; // Added useRef, useEffect, and useCallback
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Hi there, Nurse! Welcome to NurseAid, your trusted clinical assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  // Ref for the chat message area to enable auto-scrolling
  const messagesEndRef = useRef(null);

  // Scrolls to the bottom of the chat area whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getHistoryKey = useCallback(() => 
    user?.email ? `chatHistory_${user.email}` : 'chatHistory_guest',
    [user]
  );

  // Load chat history for this user from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(getHistoryKey());
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
      setHasInteracted(true);
    }
  }, [getHistoryKey]);

  // Save chat history for this user to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(getHistoryKey(), JSON.stringify(messages));
  }, [messages, getHistoryKey]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setHasInteracted(true);
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear input immediately after sending

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_CHAT_API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ question: text })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorData.detail || 'Unknown error'}`);
      }

      const data = await response.json();
      const botReply = { sender: 'bot', text: data.answer || "Sorry, I couldn't find an answer for that." };
      if (data.video_urls) {
        botReply.video_urls = data.video_urls;
      }
      if (data.answer) {
        botReply.answer = data.answer;
      }
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error("Failed to fetch bot response:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${error.message}. Please try again.` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!loading && input.trim()) { // Added input.trim() check here too
      sendMessage(input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault(); // Prevents default Enter behavior (e.g., new line in textarea if it were one)
      handleSend();
    }
  };

  const handleSuggestedClick = (question) => {
    if (!loading) sendMessage(question);
  };

  const handleClearHistory = () => {
    setMessages([{ sender: 'bot', text: '👋 Hi there, Nurse! Welcome to NurseAid, your trusted clinical assistant. \nYou can start by chatting with me here, or tap one of the options below to explore:' }]);
    localStorage.removeItem(getHistoryKey());
    setHasInteracted(false);
  };

  return (
    <div className="chat-wrapper">
      <aside className="sidebar-left">
        <div className="sidebar-header">
          <img src="/logo.jpg" alt="NurseAid" className="sidebar-logo" />
          <h2>NurseAid</h2>
        </div>
        {/* <input type="text" placeholder="Search" className="search-bar" /> */}
        <ul className="menu-list">
          <li onClick={() => navigate('/protocols')}>📋 Clinical Protocols</li>
          <li onClick={() => navigate('/calculator')}>💧 Fluid Calculator</li>
          <li onClick={() => navigate('/modules')}>📚 Learning Modules</li>
        </ul>
        <div className="sidebar-footer-bottom">
          <ul className="menu-list">
            <li onClick={() => navigate('/help')}>❓ Help center</li>
            <li onClick={() => navigate('/settings')}>⚙️ Settings</li>
            <li onClick={() => { logout(); navigate('/'); }}>🚪 Logout</li>
          </ul>
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-message-area">
          {messages.map((msg, index) => {
            if (
              index === 0 &&
              msg.sender === 'bot' &&
              !hasInteracted
            ) {
              return (
                <div key={index} className={`chat-bubble bot-bubble`} style={{ whiteSpace: 'pre-line' }}>
                  {msg.answer || msg.text}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center', width: '100%' }}>
                    <button onClick={() => navigate('/modules')} className="responsive-chat-btn" style={{ background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>Education</button>
                    <button onClick={() => navigate('/calculator')} className="responsive-chat-btn" style={{ background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}>Calculator</button>
                  </div>
                </div>
              );
            }
            // Show multiple YouTube video links if present (from backend video_urls)
            if (
              msg.sender === 'bot' &&
              msg.video_urls &&
              Array.isArray(msg.video_urls) &&
              msg.video_urls.length > 0
            ) {
              return (
                <div key={index} className="chat-bubble bot-bubble">
                  <div>
                    {msg.answer && <div style={{ marginBottom: 8 }}>{msg.answer}</div>}
                    {msg.video_urls.map((url, i) => {
                      // Extract YouTube video ID
                      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                      const videoId = ytMatch ? ytMatch[1] : null;
                      return (
                        <div key={i} style={{ marginBottom: 12 }}>
                          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', fontWeight: 'bold', textDecoration: 'underline' }}>
                            ▶️ Watch Video {i + 1}
                          </a>
                          {videoId && (
                            <div style={{ marginTop: 6 }}>
                              <iframe
                                width="320"
                                height="180"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={`YouTube video player ${i + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ borderRadius: '8px', marginTop: '8px' }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            // Check if bot message contains a YouTube video URL (single)
            if (
              msg.sender === 'bot' &&
              typeof (msg.answer || msg.text) === 'string' &&
              (msg.answer || msg.text).match(/https:\/\/www\.youtube\.com\/watch\?v=/)
            ) {
              // Extract YouTube video URL
              const ytMatch = (msg.answer || msg.text).match(/https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)/);
              const videoId = ytMatch ? ytMatch[1] : null;
              return (
                <div key={index} className="chat-bubble bot-bubble">
                  <div>
                    Here is the YouTube video for this procedure:
                    {videoId && (
                      <div style={{ marginTop: '8px' }}>
                        <iframe
                          width="320"
                          height="180"
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ borderRadius: '8px', marginTop: '8px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            // Check if bot message contains a Google Drive video URL
            if (
              msg.sender === 'bot' &&
              typeof (msg.answer || msg.text) === 'string' &&
              (msg.answer || msg.text).match(/https:\/\/drive\.google\.com\/file\/d\//)
            ) {
              // Extract video URL from message
              const urlMatch = (msg.answer || msg.text).match(/(https:\/\/drive\.google\.com\/file\/d\/[\w-]+\/view)/);
              const videoUrl = urlMatch ? urlMatch[1] : null;
              return (
                <div key={index} className="chat-bubble bot-bubble">
                  <div>
                    Here is the video for this procedure: {' '}
                    {videoUrl && (
                      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="video-link" style={{ display: 'inline-block', marginTop: '8px', color: '#1976d2', fontWeight: 'bold', textDecoration: 'underline' }}>
                        ▶️ Watch Video
                      </a>
                    )}
                  </div>
                </div>
              );
            }
            // Default rendering
            return (
              <div key={index} className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                {msg.answer || msg.text}
              </div>
            );
          })}
          {loading && <div className="chat-bubble bot-bubble typing-indicator">Typing...</div>}
          <div ref={messagesEndRef} /> {/* Element to scroll to */}
        </div>

        {!hasInteracted && (
          <div className="quick-buttons">
            <button onClick={() => handleSuggestedClick("How should a pediatric nurse assess severity of dehydration?")}>
              How should a pediatric nurse assess severity of dehydration?
            </button>
            <button onClick={() => handleSuggestedClick("Show me the protocol when a child presents with a foreign body aspiration")}>
              Show me the protocol when a child presents with a foreign body aspiration.
            </button>
            <button onClick={() => handleSuggestedClick("When should a chest X-ray be considered for a child with suspected pneumonia?")}>
              When should a chest X-ray be considered for a child with suspected pneumonia?
            </button>
            {/* <button onClick={() => handleSuggestedClick("What's the latest guideline for postpartum care?")}>
              What's the latest guideline for postpartum care?
            </button> */}
          </div>
        )}

        <div className="chat-box">
          <input
            type="text"
            placeholder="Ask NurseAid..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <button onClick={handleSend} className="send-icon" disabled={loading || !input.trim()}>⬆</button> {/* Disabled if loading or input is empty */}
        </div>
      </main>

      <aside className="sidebar-right">
        <h4>Chat History</h4>
        <ul className="chat-history">
          {/* Mapping messages for chat history, consider trimming for brevity if messages get long */}
          {messages.map((msg, idx) => {
            const displayText = (msg.answer || msg.text || '').toString();
            return (
              <li key={idx} className="history-item">
                <strong>{msg.sender === 'user' ? 'You:' : 'NurseAid:'}</strong> {displayText.substring(0, 50)}{displayText.length > 50 ? '...' : ''}
              </li>
            );
          })}
        </ul>
        <button className="clear-history" onClick={handleClearHistory} disabled={loading}>🗑️ Clear History</button>
      </aside>
    </div>
  );
};

export default ChatPage;
