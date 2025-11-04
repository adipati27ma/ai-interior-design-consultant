
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Role } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === Role.USER;
  
  const formattedContent = message.content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">$1</a>');

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          AI
        </div>
      )}
      <div 
        className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${
          isUser 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-800'
        }`}
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  );
};


export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-100 rounded-lg shadow-md flex flex-col h-[60vh]">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">AI</div>
            <div className="bg-white text-gray-800 p-3 rounded-lg shadow-sm flex items-center space-x-2">
              <span className="block w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="block w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="block w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Make the walls light blue..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-indigo-600 focus:text-white focus:placeholder-gray-300 transition-colors duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 w-10 h-10 bg-indigo-600 text-white rounded-full disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
