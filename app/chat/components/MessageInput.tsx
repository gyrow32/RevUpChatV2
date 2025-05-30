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
    const newHeight = Math.min(textarea.scrollHeight, 100); // Reduced max height for mobile
    textarea.style.height = `${newHeight}px`;
  };
  
  const canSend = message.trim().length > 0 && !disabled && !isLoading;
  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  
  return (
    <div className={cn(
      "border-t border-gray-200/50 dark:border-white/10 bg-white/90 dark:bg-black/20 backdrop-blur-xl pb-safe-bottom shadow-md",
      className
    )}>
      <div className="p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              className={cn(
                "min-h-[44px] max-h-[100px] resize-none w-full",
                "border border-gray-300 dark:border-white/20 rounded-xl sm:rounded-lg bg-white/90 dark:bg-black/30 backdrop-blur-sm",
                "focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 shadow-sm",
                "p-3 pr-12 sm:pr-16 text-base sm:text-sm",
                "transition-all duration-200",
                "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                "mobile-scroll"
              )}
              style={{ 
                height: 'auto',
                overflowY: 'hidden',
                fontSize: '16px' // Prevents zoom on iOS
              }}
            />
            
            {/* Character counter - Mobile Optimized */}
            <div className={cn(
              "absolute bottom-2 right-2 text-xs",
              "hidden sm:block", // Hide on mobile to save space
              isNearLimit 
                ? "text-orange-400" 
                : "text-gray-400"
            )}>
              {characterCount}/{maxLength}
            </div>
            
            {/* Mobile character warning only when near limit */}
            {isNearLimit && (
              <div className="absolute -top-6 right-0 text-xs text-orange-400 sm:hidden">
                {maxLength - characterCount} left
              </div>
            )}
          </div>
          
          {/* Premium Glass Send Button - Mobile Optimized */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              "shrink-0 touch-target w-11 h-11 sm:w-12 sm:h-12 p-0 rounded-full",
              "flex items-center justify-center",
              "backdrop-blur-sm border transition-all duration-200",
              "active:scale-95", // Mobile touch feedback
              canSend 
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-400/50 hover:border-blue-300/70 shadow-lg hover:shadow-blue-500/25" 
                : "bg-gray-200 border-gray-300 dark:bg-black/30 dark:border-white/20 text-gray-500 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <span className="animate-spin text-lg">⟳</span>
            ) : (
              <span className="text-lg">➤</span>
            )}
          </button>
        </div>
        
        {/* Mobile-optimized help text */}
        <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
          <span className="hidden sm:block">Press Enter to send, Shift+Enter for new line</span>
          <span className="block sm:hidden">Tap send or press Enter</span>
          {isLoading && (
            <span className="text-blue-400 flex items-center gap-1">
              <span className="animate-spin">⟳</span>
              <span className="hidden sm:inline">Sending message...</span>
              <span className="sm:hidden">Sending...</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}