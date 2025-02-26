import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [starterTopics, setStarterTopics] = useState([]);

  // Fetch starter topics on component mount
  useEffect(() => {
    const fetchStarterTopics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/starter-topics');
        setStarterTopics(response.data);
      } catch (error) {
        console.error('Error fetching starter topics:', error);
      }
    };

    fetchStarterTopics();
  }, []);

  const handleSendMessage = async (message = inputText) => {
    if (!message.trim()) return;
  
    // Add user's message to the chat
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setInputText('');
  
    try {
      // Call the backend /chat endpoint
      const response = await axios.post('http://localhost:5000/chat', {
        message,
      });
  
      // Extract slok and translation from the response
      const { slok, translation } = response.data.response;
  
      // Add the bot's response to the chat
      setMessages((prev) => [
        ...prev,
        { text: `Shlok: ${slok}`, sender: 'bot' },
        { text: `Translation: ${translation}`, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, something went wrong.', sender: 'bot' },
      ]);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-primary text-white">Vedic Chatbot</div>
        <div className="card-body" style={{ height: '400px', overflowY: 'scroll' }}>
        {
  messages.map((msg, index) => (
    <div
      key={index}
      className={`d-flex justify-content-${
        msg.sender === 'user' ? 'end' : 'start'
      } mb-2`}
    >
      <div
        className={`p-3 rounded ${
          msg.sender === 'user' ? 'bg-success text-white' : 'bg-light'
        }`}
      >
        {msg.text.includes('Shlok:') ? (
          <div>
            <strong>Shlok:</strong>
            <p>{msg.text.replace('Shlok: ', '')}</p>
          </div>
        ) : msg.text.includes('Translation:') ? (
          <div>
            <strong>Translation:</strong>
            <p>{msg.text.replace('Translation: ', '')}</p>
          </div>
        ) : (
          msg.text
        )}
      </div>
    </div>
  ))
}
        </div>
        <div className="card-footer">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="btn btn-primary" onClick={() => handleSendMessage()}>
              Send
            </button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {starterTopics.map((topic) => (
              <button
                key={topic.id}
                className="btn btn-outline-primary"
                onClick={() => handleSendMessage(topic.query)}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;