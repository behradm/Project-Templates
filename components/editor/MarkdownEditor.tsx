import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

// Declare the window object with hljs property for TypeScript
declare global {
  interface Window {
    hljs: any;
  }
}

// Import the editor component dynamically to avoid SSR issues
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});

// Initialize markdown parser
const mdParser = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder, id }: MarkdownEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorKey, setEditorKey] = useState(0); // Used to force re-rendering
  
  // Handle client-side only rendering
  useEffect(() => {
    setIsMounted(true);
    
    // Import CSS only on client-side
    if (typeof window !== 'undefined') {
      require('react-markdown-editor-lite/lib/index.css');
      window.hljs = hljs;
    }
  }, []);

  // Create a custom paste handler to replace the editor's default one
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    // Function to handle paste events
    const handlePaste = (e: ClipboardEvent) => {
      // Only handle pastes that occur within our editor
      const target = e.target as HTMLElement;
      if (!containerRef.current?.contains(target)) return;
      
      // Check if it's a textarea - this is where we want to capture paste events
      if (target.tagName === 'TEXTAREA') {
        const textarea = target as HTMLTextAreaElement;
        const pastedText = e.clipboardData?.getData('text/plain');
        
        if (pastedText) {
          e.preventDefault();
          
          // Get selection
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          
          // Create new text with paste inserted
          const currentValue = textarea.value;
          const newValue = currentValue.substring(0, start) + 
                          pastedText + 
                          currentValue.substring(end);
          
          // Update the textarea value directly
          textarea.value = newValue;
          
          // Also trigger the onChange for the component
          onChange(newValue);
          
          // Set cursor position after pasted text
          setTimeout(() => {
            textarea.selectionStart = start + pastedText.length;
            textarea.selectionEnd = start + pastedText.length;
          }, 10);
        }
      }
    };
    
    // Add paste handler to the container
    const container = containerRef.current;
    container.addEventListener('paste', handlePaste);
    
    return () => {
      container.removeEventListener('paste', handlePaste);
    };
  }, [isMounted, onChange]);

  // Simple wrapper for handling editor changes
  const handleEditorChange = ({ text }: { text: string }) => {
    onChange(text);
  };
  
  // Add keyboard shortcut for paste that bypasses default handling
  useEffect(() => {
    if (!isMounted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+V or Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        // Let our paste handler take over
        // Don't prevent default here - we'll do that in the paste handler
      }
    };
    
    if (containerRef.current) {
      containerRef.current.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isMounted]);

  if (!isMounted) {
    // Fallback for SSR
    return (
      <textarea
        className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-secondary text-white h-64"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id={id}
      />
    );
  }

  return (
    <div className="markdown-editor-wrapper dark-theme" ref={containerRef}>
      <MdEditor
        key={editorKey}
        id={id}
        value={value}
        style={{ height: '350px' }}
        placeholder={placeholder}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        config={{
          view: {
            menu: true,
            md: true,
            html: false
          },
          canView: {
            menu: true,
            md: true,
            html: true,
            fullScreen: true,
            hideMenu: true
          },
          table: {
            maxRow: 5,
            maxCol: 6
          },
          syncScrollMode: ['leftFollowRight', 'rightFollowLeft']
        }}
        plugins={[
          'header',
          'font-bold',
          'font-italic',
          'list-unordered',
          'list-ordered',
          'block-quote',
          'block-code-inline',
          'block-code-block',
          'table',
          'image',
          'link',
          'clear',
          'logger',
          'mode-toggle',
          'full-screen'
        ]}
      />
      <button 
        className="hidden"
        onClick={() => setEditorKey(k => k + 1)} // Force re-render if needed
      />
      <div className="mt-1 text-xs text-gray-400">
        <p>Tip: Use markdown to format your prompt. Surround code with triple backticks (```) for code blocks.</p>
      </div>
    </div>
  );
}
