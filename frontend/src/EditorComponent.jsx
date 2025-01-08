// EditorComponent.js
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import ImageTool from '@editorjs/image';

const EditorComponent = ({ content, onSave }) => {
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
          embed: Embed,
          image: ImageTool,
        },
        data: content,
        onChange: async () => {
          const savedData = await editorInstance.current.save();
          onSave(savedData);
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [content, onSave]);

  return <div id="editorjs" />;
};

export default EditorComponent;
