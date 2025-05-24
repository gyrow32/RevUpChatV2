'use client';

import { useEffect, useRef } from 'react';
import Message from './Message';
import ThinkingIndicator from './ThinkingIndicator';
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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600/30 to-blue-700/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-blue-400/20 shadow-lg">
              <span className="text-3xl">🚗</span>
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-3 drop-shadow-lg">
              Welcome to RevUpChat!
            </h3>
            
            <p className="text-gray-300 max-w-md mb-8 leading-relaxed">
              I&apos;m your AI car shopping assistant. Ask me about available vehicles, 
              get personalized recommendations, or explore our inventory.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => onQuestionClick?.(action.query)}
                  className={cn(
                    "h-auto p-4 text-left justify-start bg-black/30 backdrop-blur-sm rounded-lg",
                    "hover:bg-black/50 border border-white/10 hover:border-white/20",
                    "transition-all duration-200 shadow-lg hover:shadow-xl"
                  )}
                >
                  <span className="text-lg mr-3">{action.icon}</span>
                  <div>
                    <div className="font-medium text-sm text-white">{action.label}</div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-400 mt-6">
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
        
        {/* AI Thinking Process Indicator */}
        {isLoading && <ThinkingIndicator />}
        
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}