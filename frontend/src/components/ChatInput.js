import React, { useState } from 'react';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Send to LangChain API (placeholder)
    console.log("Sending:", message);
    setMessage('');
  };

  return (
    <div className="chat-input">
      <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask me anything..." />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;