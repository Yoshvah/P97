import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import axios from 'axios';
import '../Style/Mook.css';

const EditorComponent = ({ editor }) => (
  <div id="editorjs" className="editor-container">
    {editor ? <EditorContent editor={editor} /> : <p>Loading editor...</p>}
  </div>
);

const Mook = () => {
  const [mooks, setMooks] = useState([]);
  const [selectedMook, setSelectedMook] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Start writing your note here...',
      }),
    ],
    content: selectedMook?.content || '<p>Start writing your note...</p>',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    const fetchMook = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mooks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMooks(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchMook();
  }, [token]);

  const handleSaveCard = async () => {
    if (!newTitle.trim()) {
      alert('Title cannot be empty!');
      return;
    }

    const newCard = {
      title: newTitle,
      isPrivate,
      contentData: content,
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/register/mook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) {
        throw new Error('Failed to save Mook. Please try again.');
      }

      const data = await response.json();

      setMooks((prevMooks) => [
        ...prevMooks,
        { ...newCard, id: data.mook_id, shareLink: data.shareLink },
      ]);

      setSelectedMook(null);
      setNewTitle('');
      setContent('');
      alert(`Note saved successfully! Share Link: ${data.shareLink}`);
    } catch (error) {
      console.error('Error saving Mook:', error);
      alert('Error saving note. Please check your connection and try again.');
    } finally {
      setLoading(false);
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
      const response = await fetch('/api/AIchat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

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
      {!selectedMook && (
        <div className="button-container">
          <Button
            variant="outline-dark"
            id="new-item"
            onClick={() => {
              setSelectedMook({});
              setNewTitle('');
              setIsPrivate(false);
              editor?.commands.clearContent();
            }}
          >
            Add New Note
          </Button>
        </div>
      )}
      {loading && <div className="loader">Loading...</div>}

      {!selectedMook && mooks.length > 0 && (
        <div className="container-fluid mt-4">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {mooks.map((mookItem, index) => (
              <div className="col" key={index}>
                <div
                  className="card shadow-sm"
                  onClick={() => {
                    setSelectedMook(mookItem);
                    setNewTitle(mookItem.title);
                    setIsPrivate(mookItem.isPrivate || false);
                    editor?.commands.setContent(mookItem.content || '');
                  }}
                >
                  <img
                    src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg"
                    alt="mook"
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h2>{mookItem.title}</h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: mookItem.content || 'No description available',
                      }}
                    ></div>
                    <a href="#" className="btn btn-primary">
                      Find out more
                      <span className="material-icons">arrow_right_alt</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMook && (
        <div className="editor-form">
          <div className="form-actions">
            <button className="btn primary" onClick={handleSaveCard}>
              Save
            </button>
            <button
              className="btn secondary"
              onClick={() => {
                setSelectedMook(null);
                setNewTitle('');
                editor?.commands.clearContent();
              }}
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            id="note-title"
            className="note-title-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter title"
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />{' '}
              Private
            </label>
          </div>
          <EditorComponent editor={editor} />
        </div>
      )}

      <div className="floating-container">
        <div className="floating-button" onClick={() => setShowChat(!showChat)}>
          <i className="fas fa-robot"></i>
        </div>
        {showChat && (
          <div className="chat-container">
            <h3 className="AItitle">Chat with AI</h3>
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
