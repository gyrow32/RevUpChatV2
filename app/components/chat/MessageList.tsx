'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import ThinkingIndicator from './ThinkingIndicator';
import type { Message as MessageType } from '@/app/lib/types';
import { cn } from '../../lib/utils';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  onRetry?: (messageId: string) => void;
  onQuestionClick?: (question: string) => void;
  className?: string;
}

export default function MessageList({ 
  messages, 
  isLoading,
  onRetry,
  onQuestionClick,
  className = '' 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

  // Listen for user scroll on the chat container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setIsUserNearBottom(nearBottom);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Set initial state
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to bottom ONLY if user is near the bottom
  useEffect(() => {
    if (messagesEndRef.current && isUserNearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isUserNearBottom]);

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col space-y-4 pt-8 px-6 md:px-8 overflow-y-auto", className)}
      style={{ maxHeight: '100vh' }} // Adjust as needed for your layout
    >
      {messages.length === 0 ? (
        // Welcome screen when no messages
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Welcome to RevUp Chat
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
            Your AI-powered assistant for finding the perfect vehicle. Ask anything about cars in our inventory!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-lg">
            {/* Each card has consistent dimensions with height: 80px, fixed margins and width */}
            <button 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold h-[80px] flex items-center justify-center"
              onClick={() => onQuestionClick?.("Show me SUVs under $30,000")}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🚙</span>
                <span>SUVs Under $30,000</span>
              </div>
            </button>
            
            <button 
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold h-[80px] flex items-center justify-center"
              onClick={() => onQuestionClick?.("Vehicles with payments under $450 per month")}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">💰</span>
                <span>Payments Under $450/mo</span>
              </div>
            </button>
            
            <button 
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold h-[80px] flex items-center justify-center"
              onClick={() => onQuestionClick?.("Show me pickup trucks in inventory")}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">🛻</span>
                <span>Pickup Trucks Available</span>
              </div>
            </button>
            
            <button 
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold h-[80px] flex items-center justify-center"
              onClick={() => onQuestionClick?.("Show me best value SUVs with lowest age and mileage")}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">✨</span>
                <span>Best Value SUVs</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        // Message list when there are messages
        <>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              onRetry={onRetry}
              onQuestionClick={onQuestionClick}
            />
          ))}
          {isLoading && <ThinkingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}