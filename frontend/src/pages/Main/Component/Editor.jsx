// import React, { useRef, useEffect } from 'react';
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

// const Editor = ({ data, onSave }) => {
//   const editorInstance = useRef(null);

//   useEffect(() => {
//     editorInstance.current = new EditorJS({
//       holder: 'editorjs',
//       tools: {
//         header: { class: Header, inlineToolbar: ['link'] },
//         list: { class: List, inlineToolbar: true },
//         image: { 
//           class: ImageTool, 
//           config: { endpoints: { byFile: '', byUrl: '' } },
//         },
//         quote: { class: Quote, inlineToolbar: true, config: { quotePlaceholder: 'Enter a quote', captionPlaceholder: 'Quote author' } },
//         checklist: { class: Checklist, inlineToolbar: true },
//         embed: { class: Embed, config: { services: { youtube: true, twitter: true } } },
//         table: { class: Table, inlineToolbar: true },
//         delimiter: { class: Delimiter },
//         inlineCode: { class: InlineCode },
//       },
//       placeholder: 'Start writing here...',
//       data,
//       onChange: async () => {
//         const savedData = await editorInstance.current.save();
//         onSave(savedData);
//       },
//     });

//     return () => {
//       if (editorInstance.current) {
//         editorInstance.current.destroy();
//         editorInstance.current = null;
//       }
//     };
//   }, [data, onSave]);

//   return <div id="editorjs" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }} />;
// };

// export default Editor;
