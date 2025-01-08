import React, { useState } from 'react';
import '../Style/EditorComponent.css';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const EditorComponent = ({
  content,
  onSave,
  newTitle,
  setNewTitle,
  isPrivate,
  setIsPrivate,
  handleSaveCard,
  setSelectedMook,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  showChat,
  setShowChat,
  handleSendMessage,
  username // Add username prop
}) => {
  const [editorContent, setEditorContent] = useState(content || '');

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    onSave(newContent);
  };

  const handleSave = async () => {
    const createdAt = new Date().toISOString(); // Get the current timestamp
    await handleSaveCard(newTitle, isPrivate, editorContent, username, createdAt);
  };

  return (
    <div className="mook-container">
      <div className="mook-header">
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Form.Check
          type="checkbox"
          label="Private"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
      </div>
      <textarea
        className="mook-editor"
        value={editorContent}
        onChange={handleContentChange}
      />
      <div className="form-actions">
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedMook(null);
            setNewTitle('');
            setIsPrivate(false);
            onSave(''); // Reset content to an empty string
          }}
        >
          Cancel
        </Button>
      </div>
      <div className="floating-chat-container">
        <div className="floating-chat-button" onClick={() => setShowChat(!showChat)}>
          <i className="fas fa-robot"></i>
        </div>
        {showChat && (
          <div className="chat-box">
            <h3 className="chat-title">Chat with AI</h3>
            <hr />
            <ul className="chat-messages-list">
              {messages.map((msg, index) => (
                <li key={index} className={msg.sender === 'user' ? 'chat-user-message' : 'chat-ai-message'}>
                  <div className="chat-profile">
                    {msg.sender === 'user' ? (
                      <i className="fas fa-user chat-profile-icon"></i>
                    ) : (
                      <i className="fas fa-robot chat-profile-icon"></i>
                    )}
                  </div>
                  <div className="chat-message-content">
                    <span className="chat-message-text">{msg.text}</span>
                    <span className="chat-timestamp">{msg.timestamp}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Form className="chat-input-section">
              <Form.Control
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <Button variant="primary" onClick={handleSendMessage}>
                <i className="fas fa-paper-plane"></i>
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorComponent;
