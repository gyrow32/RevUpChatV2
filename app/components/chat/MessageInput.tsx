'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { cn } from '@/app/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false,
  isLoading = false,
  placeholder = "Ask about cars..."
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = () => {
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };
  
  // Handler for input that adjusts height
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };
  
  return (
    <div className="flex items-end bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 gap-2 backdrop-blur-sm">
      <textarea
        ref={textareaRef}
        id="chat-message-input"
        name="chat-message"
        value={message}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "flex-1 max-h-[200px] p-2 resize-none bg-transparent outline-none",
          "text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled || isLoading}
        rows={1}
      />
      
      <button
        id="chat-send-button"
        name="chat-send"
        onClick={handleSubmit}
        disabled={!message.trim() || disabled || isLoading}
        className={cn(
          "p-2 rounded-lg",
          "bg-gradient-to-r from-blue-600 to-blue-500",
          "text-white font-semibold",
          "transition-all duration-200",
          (!message.trim() || disabled || isLoading) && "opacity-50 cursor-not-allowed",
          message.trim() && !disabled && !isLoading && "hover:from-blue-700 hover:to-blue-600"
        )}
        aria-label="Send message"
      >
        {isLoading ? "..." : "→"}
      </button>
    </div>
  );
}