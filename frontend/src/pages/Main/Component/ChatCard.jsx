import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/Message.css';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';

const ChatCard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [error, setError] = useState(null);

  // Check for token in localStorage
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view and send messages.');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` }, // Attach token
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (!receiverId) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user-chats/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Attach token
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [receiverId, token]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setReceiverId(user.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;

    const formData = new FormData();
    formData.append('receiver_id', receiverId);
    formData.append('content', newMessage);
    if (imageFile) formData.append('image', imageFile);

    try {
      await axios.post('http://localhost:8000/api/user-chats', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessages([...messages, { content: newMessage, sender: 'You', image: URL.createObjectURL(imageFile) }]);
      setNewMessage('');
      setImageFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (error) {
    return <div>{error}</div>; // Show error if no token
  }

  return (
    <div className="chat-card">
      <div className="chat-sidebar">
        <div className="user-search">
          <input type="text" className="user-search-input" placeholder="Search users..." />
        </div>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item" onClick={() => handleUserClick(user)}>
              <div className="user-avatar">
                <img src={user.profilePicture} alt={`${user.username}`} />
              </div>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="user-status">{ 'No Date yet'}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-content">
        {selectedUser && <div className="chat-header">Chatting with {selectedUser.username}</div>}
        <div className="message-container">
          <ul className="message-list">
            {messages.map((msg, index) => (
              <li key={index} className={`message-item ${msg.sender === 'You' ? 'message-right' : 'message-left'}`}>
                <div className="message-bubble">{msg.content}</div>
                {msg.image && <img src={msg.image} alt="Message Attachment" className="message-image" />}
              </li>
            ))}
          </ul>
          <div className="message-input-group">
            <textarea
              className="message-input"
              rows="2"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="send-button" onClick={handleSendMessage}>
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
