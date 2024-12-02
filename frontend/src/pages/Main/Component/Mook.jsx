import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'; // StarterKit includes Image, Link, Bold, Italic, etc.
import '../Style/Mook.css';

const EditorComponent = ({ editor }) => {
  return (
    <div id="editorjs">
      {editor ? (
        <EditorContent editor={editor} />
      ) : (
        <p>Loading editor...</p>
      )}
    </div>
  );
};

const Mook = () => {
  const [mooks, setMooks] = useState([]);
  const [selectedMook, setSelectedMook] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  // TipTap editor setup
  const editor = useEditor({
    extensions: [StarterKit], // Includes Link, Image, Bold, Italic, etc.
    content: '<p>Start writing your amazing story here...</p>',
    onUpdate: ({ editor }) => {
      const savedData = editor.getJSON();
      console.log('Editor data:', savedData);
    },
  });

  // Fetch Mooks on component mount
  useEffect(() => {
    const fetchMook = async () => {
      try {
        const response = await fetch('/api/mook');
        const data = await response.json();
        setMooks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchMook();
  }, []);

  // Handle saving a new Mook
  const handleSaveCard = async () => {
    if (!newTitle.trim()) return;

    const newCard = {
      title: newTitle,
      mooklink: 'https://example.com', // Placeholder for a link
      isPrivate,
      content,
    };

    try {
      const response = await fetch('/api/register/mook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) {
        throw new Error('Failed to save Mook');
      }

      const data = await response.json();
      setSelectedMook(null);
      setMooks((prevMooks) => [...prevMooks, { ...newCard, mid: data.mook_id }]);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle sending a message to AI
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');

    try {
      const response = await fetch('/api/AIchat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const aiResponse = {
        sender: 'ai',
        text: data.message,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="main">
      <div className="button-container">
        <Button variant="outline-dark" id="new-item" onClick={() => setSelectedMook({})}>
          Add New Item
        </Button>
      </div>

      {/* Display Mooks */}
      {mooks.length > 0 ? (
        <div className="cards">
          {mooks.map((mookItem, index) => (
            <div className="card" key={index} onClick={() => setSelectedMook(mookItem)}>
              <img src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg" alt="mook" />
              <div className="card-content">
                <h2>{mookItem.title}</h2>
                <p dangerouslySetInnerHTML={{ __html: mookItem.content || 'No description available' }}></p>
                <a href="#" className="button">
                  Find out more
                  <span className="material-symbols-outlined">arrow_right_alt</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No cards available</p>
      )}

      {/* Mook Editing Form */}
      {selectedMook && (
        <div className="cardform">
          <div className="form-containerr">
            <div className="form-actions">
              <button className="btn primary" onClick={handleSaveCard}>Save</button>
              <button className="btn secondary" onClick={() => setSelectedMook(null)}>Cancel</button>
            </div>
            <h2 className="form-title">Editing: {newTitle}</h2>
            <label htmlFor="formTitle">Title:</label>
            <input
              type="text"
              id="formTitle"
              className="form-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter title"
            />
            <div className="form-group">
              <input
                type="checkbox"
                id="formPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor="formPrivate" className="checkbox-label">Private</label>
            </div>
            <div className="form-group">
              <label htmlFor="formContent">Content:</label>
              <EditorComponent editor={editor} />
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Button and Chat Interface */}
      <div className="floating-container">
        <div className="floating-button" onClick={() => setShowChat(!showChat)}>
          <i className="fas fa-robot"></i>
        </div>
        {showChat && (
          <div className="chat-container">
            <h3 className='AItitle'>Chat with AI</h3>
            <hr />
            <ul className="chat-messages">
              {messages.map((msg, index) => (
                <li key={index} className={msg.sender === 'user' ? 'chat-user' : 'chat-ai'}>
                  <div className="chat-profile">
                    {msg.sender === 'user' ? (
                      <i className="fas fa-user chat-profile-icon"></i>
                    ) : (
                      <i className="fas fa-robot chat-profile-icon"></i>
                    )}
                  </div>
                  <div className="chat-message">
                    <span className="chat-message-text">{msg.text}</span>
                    <span className="chat-timestamp">{msg.timestamp}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="chat-input-section">
              <input
                type="text"
                className="chat-input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={handleSendMessage} className="send-button">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mook;
