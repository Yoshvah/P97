import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import '../Style/Mook.css';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const Mook = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [mook, setMook] = useState([]);
  const [selectedMook, setSelectedMook] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
    ],
    content: selectedMook?.content || '',
    onUpdate: ({ editor }) => {
      setSelectedMook((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  // Fetch Mooks from the server
  useEffect(() => {
    const fetchMook = async () => {
      try {
        const response = await fetch('/api/mook');
        const data = await response.json();
        setMook(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchMook();
  }, []);

  const handleCardClick = (mookItem) => {
    setSelectedMook(mookItem);
    setNewTitle(mookItem.title || '');
  };

  const handleSaveCard = async () => {
    if (!newTitle.trim()) return;

    const newCard = {
      title: newTitle,
      mooklink: 'https://example.com',
      isPrivate,
      content: editor.getHTML(),
    };

    try {
      const response = await fetch('/api/register/mook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCard),
      });
      if (!response.ok) throw new Error('Failed to save mook');
      const data = await response.json();
      setSelectedMook(null);
      setMook((prevMooks) => [...prevMooks, { ...newCard, mid: data.mook_id }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { sender: 'user', text: newMessage, timestamp: new Date().toLocaleTimeString() };
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
    <>
      {selectedMook ? (
        <div className="editor-container">
          {/* <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter title"
          /> */}
          {/* <div className="form-group d-flex">
          <label>Private</label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
        </div> */}
          <EditorContent editor={editor} className="custom-editor" />
          <div className="form-actions">
            <Button onClick={handleSaveCard}>Save</Button>
            <Button variant="secondary" onClick={() => setSelectedMook(null)}>
              Cancel
            </Button>
          </div>
          
        </div>
        
      ) : (
        <div className="main">
          <div className="button-container">
            <Button variant="outline-dark" onClick={() => setSelectedMook({})}>
              Add New Item
            </Button>
          </div>

          {mook.length > 0 ? (
            <div className="cards">
              {mook.map((mookItem, index) => (
                <div key={index} className="card" onClick={() => handleCardClick(mookItem)}>
                  <img
                    src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg"
                    alt="mook"
                  />
                  <div className="card-content">
                    <h2>{mookItem.title}</h2>
                    <p dangerouslySetInnerHTML={{ __html: mookItem.content || 'No description available' }}></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No cards available</p>
          )}


        </div>
      )}
    </>
  );
};

export default Mook;
















































// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from 'react-bootstrap';
// import EditorJS from '@editorjs/editorjs';
// import Header from '@editorjs/header';
// import List from '@editorjs/list';
// import ImageTool from '@editorjs/image';
// import Quote from '@editorjs/quote';
// import Checklist from '@editorjs/checklist';
// import Embed from '@editorjs/embed';
// import Table from '@editorjs/table';
// import Delimiter from '@editorjs/delimiter';
// import InlineCode from '@editorjs/inline-code';
// import '../Style/Mook.css';

// const EditorComponent = () => {
//   const editorInstance = useRef(null);

//   useEffect(() => {
//     // Initialize Editor.js
//     editorInstance.current = new EditorJS({
//       holder: 'editorjs',
//       tools: {
//         header: { class: Header, inlineToolbar: ['link'] },
//         list: { class: List, inlineToolbar: true },
//         image: { 
//           class: ImageTool,
//           config: {
//             endpoints: {
//               byFile: '',
//               byUrl: '',
//             },
//           },
//         },
//         quote: { class: Quote, inlineToolbar: true, config: { quotePlaceholder: 'Enter a quote', captionPlaceholder: "Quote's author" } },
//         checklist: { class: Checklist, inlineToolbar: true },
//         embed: { class: Embed, config: { services: { youtube: true, twitter: true } } },
//         table: { class: Table, inlineToolbar: true },
//         delimiter: { class: Delimiter },
//         inlineCode: { class: InlineCode },
//       },
//       placeholder: 'Start writing your amazing story here...',
//       onChange: async () => {
//         const savedData = await editorInstance.current.save();
//         console.log('Editor data:', savedData);
//       },
//     });

//     // Cleanup function to destroy the editor instance when the component is unmounted
//     return () => {
//       if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
//         editorInstance.current.destroy();
//       }
//       editorInstance.current = null;
//     };
//   }, []);

//   return <div id="editorjs" style={{ border: '1px solid #ddd', padding: '20px' }}></div>;
// };

// const Mook = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [showChat, setShowChat] = useState(false);
//   const [mook, setMook] = useState([]);
//   const [selectedMook, setSelectedMook] = useState(null);
//   const [newTitle, setNewTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [isPrivate, setIsPrivate] = useState(false);

//   useEffect(() => {
//     const fetchMook = async () => {
//       try {
//         const response = await fetch('/api/mook');
//         const data = await response.json();
//         setMook(data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchMook();
//   }, []);

//   // const handleSendMessage = (e) => {
//   //   e.preventDefault();
//   //   if (!newMessage.trim()) return;

//   //   const userMessage = { sender: 'user', text: newMessage, timestamp: new Date().toLocaleTimeString() };
//   //   setMessages((prevMessages) => [...prevMessages, userMessage]);
//   //   setNewMessage('');

//   //   setTimeout(() => {
//   //     const aiResponse = {
//   //       sender: 'ai',
//   //       text: `AI says: You said "${userMessage.text}"`,
//   //       timestamp: new Date().toLocaleTimeString(),
//   //     };
//   //     setMessages((prevMessages) => [...prevMessages, aiResponse]);
//   //   }, 1000);
//   // };


//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim()) return;
  
//     const userMessage = { sender: 'user', text: newMessage, timestamp: new Date().toLocaleTimeString() };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setNewMessage('');
  
//     try {
//       const response = await fetch('/api/AIchat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: newMessage }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to fetch AI response');
//       }
  
//       const data = await response.json();
//       const aiResponse = {
//         sender: 'ai',
//         text: data.message,
//         timestamp: new Date().toLocaleTimeString(),
//       };
  
//       setMessages((prevMessages) => [...prevMessages, aiResponse]);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
  




//   const handleCardClick = (mookItem) => {
//     setSelectedMook(mookItem);
//     setNewTitle(mookItem.title || '');
//     setContent(mookItem.content || '');
//   };

//   const handleSaveCard = async () => {
//     if (!newTitle.trim()) return;

//     const newCard = {
//       title: newTitle,
//       mooklink: 'https://example.com',
//       isPrivate,
//       content,
//     };

//     try {
//       const response = await fetch('/api/register/mook', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newCard),
//       });
//       if (!response.ok) throw new Error('Failed to save mook');
//       const data = await response.json();
//       setSelectedMook(null);
//       setMook((prevMooks) => [...prevMooks, { ...newCard, mid: data.mook_id }]);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="main">
//       <div className="button-container">
//         <Button variant="outline-dark" id="new-item" onClick={() => setSelectedMook({})}>
//           Add New Item
//         </Button>
//       </div>

//       {mook.length > 0 ? (
//         <div className="cards">
//           {mook.map((mookItem, index) => (
//             <div className="card" key={index} onClick={() => handleCardClick(mookItem)}>
//               <img src="https://img.freepik.com/free-photo/nature-design-with-bokeh-effect_1048-1882.jpg" alt="mook" />
//               <div className="card-content">
//                 <h2>{mookItem.title}</h2>
//                 <p dangerouslySetInnerHTML={{ __html: mookItem.content?.[0]?.text || 'No description available' }}></p>
//                 <a href="#" className="button">
//                   Find out more
//                   <span className="material-symbols-outlined">arrow_right_alt</span>
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No cards available</p>
//       )}

//       {selectedMook && (
//         <div className="cardform">
//           <div className="form-containerr">
//             <div className="form-actions">
//               <button className="btn primary" onClick={handleSaveCard}>Save</button>
//               <button className="btn secondary" onClick={() => setSelectedMook(null)}>Cancel</button>
//             </div>
//             <h2 className="form-title">Editing: {newTitle}</h2>
//             <label htmlFor="formTitle">Title:</label>
//             <input
//               type="text"
//               id="formTitle"
//               className="form-input"
//               value={newTitle}
//               onChange={(e) => setNewTitle(e.target.value)}
//               placeholder="Enter title"
//             />
//             <div className="form-group">
//               <input
//                 type="checkbox"
//                 id="formPrivate"
//                 checked={isPrivate}
//                 onChange={(e) => setIsPrivate(e.target.checked)}
//                 className="checkbox-input"
//               />
//               <label htmlFor="formPrivate" className="checkbox-label">Private</label>
//             </div>
//             <div className="form-group">
//               <label htmlFor="formContent">Content:</label>
//               <EditorComponent />
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="floating-container">
//         <div className="floating-button" onClick={() => setShowChat(!showChat)}>
//           <i className="fas fa-robot"></i>
//         </div>
//         {showChat && (
//           <div className="chat-container">
//             <h3 className='AItitle'>Chat to AI</h3>
//             <hr/>
//             <ul className="chat-messages">
//               {messages.map((msg, index) => (
//                 <li key={index} className={msg.sender === 'user' ? 'chat-user' : 'chat-ai'}>
//                   <div className="chat-profile">
//                     {msg.sender === 'user' ? (
//                       <i class="fas fa-user chat-profile-icon"></i>                    ) : (
//                       <i className="fas fa-robot chat-profile-icon"></i>
//                     )}
//                   </div>
//                   <div className="chat-message">
//                     <span className="chat-message-text">{msg.text}</span>
//                     <span className="chat-timestamp">{msg.timestamp}</span>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             <div className="chat-input-section">
//               <input
//                 type="text"
//                 className="chat-input"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type a message"
//               />
//               <button onClick={handleSendMessage} className="send-button">
//                 <i className="fas fa-paper-plane"></i>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Mook;
