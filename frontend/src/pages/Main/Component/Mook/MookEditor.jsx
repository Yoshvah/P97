import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../Style/Mook.css';

const MookEditor = ({ selectedMook, setSelectedMook, fetchMooks }) => {
  const [newTitle, setNewTitle] = useState(selectedMook ? selectedMook.title : '');
  const [isPrivate, setIsPrivate] = useState(selectedMook ? selectedMook.isPrivate : false);
  const [content, setContent] = useState(selectedMook ? selectedMook.contentData : ''); // Store content as a string
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username'); // Replace with actual username logic

  const handleSaveCard = async () => {
    if (!newTitle.trim()) {
      alert('Title cannot be empty!');
      return;
    }

    const newCard = {
      title: newTitle,
      isPrivate,
      contentData: content,
      creatorId: username,
      createdAt: new Date().toISOString()
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

      fetchMooks(); // Refresh the mook list
      setSelectedMook(null);
      setNewTitle('');
      setContent(''); // Reset content to an empty string
      alert(`Note saved successfully! Share Link: ${response.data.shareLink}`);
    } catch (error) {
      console.error('Error saving Mook:', error);
      alert('Error saving note. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mook-container">
      <Button
        variant="secondary"
        className="back-btn"
        onClick={() => {
          setSelectedMook(null);
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
        <Button variant="primary" onClick={handleSaveCard} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
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
    </div>
  );
};

export default MookEditor;
