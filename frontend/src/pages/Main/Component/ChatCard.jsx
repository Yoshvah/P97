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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (receiverId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/user-chats/${receiverId}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
    fetchMessages();
  }, [receiverId]);

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
      await axios.post('http://localhost:3000/api/user-chats', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessages([...messages, { content: newMessage, sender: 'You', image: URL.createObjectURL(imageFile) }]);
      setNewMessage('');
      setImageFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

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
                <img src={user.Profilepic} alt={`${user.firstname} ${user.lastname}`} />
              </div>
              <div className="user-info">
                <span className="user-name">{user.firstname} {user.lastname}</span>
                <span className="user-status">{user.datebirth || 'No Date'}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-content">
        {selectedUser && <div className="chat-header">Chatting with {selectedUser.firstname} {selectedUser.lastname}</div>}
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
