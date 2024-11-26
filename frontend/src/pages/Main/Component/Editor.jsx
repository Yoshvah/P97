import React, { useEffect, useRef } from 'react';

const Editor = () => {
  const editorRef = useRef(null); // Reference to the editor container

  useEffect(() => {
    // Dynamically add the Editor.js script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest';
    script.async = true;

    script.onload = () => {
      // Initialize Editor.js after the script is loaded
      if (window.EditorJS) {
        new window.EditorJS({
          holder: editorRef.current,
          tools: {
            header: {
              class: window.Header,
              inlineToolbar: true,
            },
          },
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup the script and destroy the editor instance on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div ref={editorRef} style={{ border: '1px solid #ccc', padding: '10px' }} />;
};

export default Editor;
