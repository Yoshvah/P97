import React, { useState, useEffect } from 'react';
import '../Style/Mook.css';
import { Form, Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Mook = () => {
  const [mooks, setMooks] = useState([]);
  const [selectedMook, setSelectedMook] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [content, setContent] = useState(''); // Store content as a string
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddingMook, setIsAddingMook] = useState(false);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username'); // Replace with actual username logic

  useEffect(() => {
    const fetchMook = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mooks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMooks(response.data);
      } catch (error) {
        console.error('Error fetching mooks:', error);
      }
    };
    fetchMook();
  }, [token]);

  const handleSaveCard = async (newTitle, isPrivate, contentString, username, createdAt) => {
    if (!newTitle.trim()) {
      alert('Title cannot be empty!');
      return;
    }

    const newCard = {
      title: newTitle,
      isPrivate,
      contentData: contentString,
      creatorId: username,
      createdAt: createdAt
    };

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/register/mook', newCard, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status !== 201) {
        throw new Error('Failed to save Mook. Please try again.');
      }

      const data = response.data;

      setMooks((prevMooks) => [
        ...prevMooks,
        { ...newCard, id: data.id, shareLink: data.shareLink },
      ]);

      setSelectedMook(null);
      setNewTitle('');
      setContent(''); // Reset content to an empty string
      setIsAddingMook(false);
      alert(`Note saved successfully! Share Link: ${data.shareLink}`);
    } catch (error) {
      console.error('Error saving Mook:', error);
      alert('Error saving note. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMook = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/mooks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setMooks(mooks.filter(mook => mook.id !== id));
      }
    } catch (error) {
      console.error('Error deleting mook:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');

    try {
      const response = await axios.post('/api/AIchat', { message: newMessage }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status !== 200) throw new Error('Failed to fetch AI response');

      const data = response.data;
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
    <div className="main-container">
      {!selectedMook && !isAddingMook && (
        <Button
          variant="primary"
          className="add-new-note-btn"
          onClick={() => setIsAddingMook(true)}
        >
          Add New Note
        </Button>
      )}
      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

      {!selectedMook && !isAddingMook && mooks.length > 0 && (
        <Row className="mt-4 mook-cards">
          {mooks.map((mookItem, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card
                className="mook-card"
                onClick={() => {
                  setSelectedMook(mookItem);
                  setNewTitle(mookItem.title);
                  setIsPrivate(mookItem.isPrivate || false);
                  setContent(mookItem.contentData || ''); // Set content as a string
                }}
              >
                <Card.Img
                  variant="top"
                  src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg"
                  alt="mook"
                />
                <Card.Body>
                  <Card.Title>{mookItem.title}</Card.Title>
                  <Card.Text
                    dangerouslySetInnerHTML={{
                      __html: mookItem.contentData ? mookItem.contentData : 'No description available',
                    }}
                  />
                  <p><strong>Created At:</strong> {mookItem.createdAt}</p>
                  <p><strong>Updated At:</strong> {mookItem.updatedAt || 'N/A'}</p>
                  <p><strong>Creator ID:</strong> {mookItem.creatorId}</p>
                  <Button variant="primary" onClick={() => handleDeleteMook(mookItem.id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {(selectedMook || isAddingMook) && (
        <div className="mook-container">
          <Button
            variant="secondary"
            className="back-btn"
            onClick={() => {
              setSelectedMook(null);
              setIsAddingMook(false);
              setNewTitle('');
              setIsPrivate(false);
              setContent(''); // Reset content to an empty string
            }}
          >
            Back
          </Button>
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="form-actions">
            <Button variant="primary" onClick={() => handleSaveCard(newTitle, isPrivate, content, username, new Date().toISOString())}>
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedMook(null);
                setNewTitle('');
                setIsPrivate(false);
                setContent(''); // Reset content to an empty string
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
      )}
    </div>
  );
};

export default Mook;
