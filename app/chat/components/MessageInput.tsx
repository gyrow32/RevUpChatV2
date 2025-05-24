'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Ask about cars, inventory, or get recommendations...",
  className = '' 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 1000;
  
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled && !isLoading) {
      onSendMessage(trimmedMessage);
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
      handleSend();
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of ~3 lines
    textarea.style.height = `${newHeight}px`;
  };
  
  const canSend = message.trim().length > 0 && !disabled && !isLoading;
  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  
  return (
    <div className={cn(
      "border-t border-white/10 bg-black/20 backdrop-blur-xl",
      className
    )}>
      <div className="p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              className={cn(
                "min-h-[44px] max-h-[120px] resize-none w-full",
                "border border-white/20 rounded-lg bg-black/30 backdrop-blur-sm",
                "focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30",
                "p-2 pr-16",
                "transition-colors duration-200",
                "text-white placeholder-gray-400"
              )}
              style={{ 
                height: 'auto',
                overflowY: 'hidden'
              }}
            />
            
            {/* Character counter */}
            <div className={cn(
              "absolute bottom-2 right-2 text-xs",
              isNearLimit 
                ? "text-orange-400" 
                : "text-gray-400"
            )}>
              {characterCount}/{maxLength}
            </div>
          </div>
          
          {/* Premium Glass Send Button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              "shrink-0 h-[44px] w-[44px] p-0 rounded-full",
              "flex items-center justify-center",
              "backdrop-blur-sm border transition-all duration-200",
              canSend 
                ? "bg-blue-600/70 hover:bg-blue-700/80 text-white border-blue-400/50 hover:border-blue-300/70 shadow-lg hover:shadow-blue-500/25" 
                : "bg-black/30 border-white/20 text-gray-500 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <span>➤</span>
            )}
          </button>
        </div>
        
        <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {isLoading && (
            <span className="text-blue-400 flex items-center gap-1">
              <span className="animate-spin">⟳</span>
              Sending message...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}