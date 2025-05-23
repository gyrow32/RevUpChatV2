'use client';

import { useEffect, useRef } from 'react';
import Message from './Message';
import type { Message as MessageType } from '@/types';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
  onRetry?: (messageId: string) => void;
  onQuestionClick?: (question: string) => void;
  className?: string;
}

export default function MessageList({ 
  messages, 
  isLoading = false,
  onRetry,
  onQuestionClick,
  className = '' 
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);
  
  // Scroll to bottom when loading state changes
  useEffect(() => {
    if (!isLoading && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isLoading]);
  
  const quickActions = [
    { icon: '🔍', label: 'Browse SUVs', query: 'Show me available SUVs' },
    { icon: '💰', label: 'Budget $300/mo', query: 'What can I get for $300/month?' },
    { icon: '⚡', label: 'Electric cars', query: 'Show me electric vehicles' },
    { icon: '🔢', label: 'VIN lookup', query: 'I want to check a VIN' }
  ];
  
  return (
    <div 
      className={cn("flex-1 overflow-y-auto px-4", className)}
    >
      <div className="py-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🚗</span>
            </div>
            
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Welcome to RevUpChat!
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
              I'm your AI car shopping assistant. Ask me about available vehicles, 
              get personalized recommendations, or explore our inventory.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => onQuestionClick?.(action.query)}
                  className={cn(
                    "h-auto p-4 text-left justify-start bg-white dark:bg-gray-800 rounded-lg",
                    "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    "border border-gray-200 dark:border-gray-700",
                    "transition-all duration-200"
                  )}
                >
                  <span className="text-lg mr-3">{action.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{action.label}</div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
              Or type your own question below
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onRetry={onRetry}
              onQuestionClick={onQuestionClick}
            />
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}