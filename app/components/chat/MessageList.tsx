'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import ThinkingIndicator from './ThinkingIndicator';
import type { Message as MessageType } from '@/app/lib/types';
import { cn } from '../../lib/utils';
import Image from 'next/image';

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
  const [hasScrolled, setHasScrolled] = useState(false);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (messagesEndRef.current && (!hasScrolled || messages.length <= 2)) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, hasScrolled]);

  // Listen for user scroll to stop auto-scrolling if they've scrolled up
  useEffect(() => {
    const handleScroll = () => {
      // If they've scrolled up more than 200px from the bottom, stop auto-scrolling
      const isNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      setHasScrolled(!isNearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn("flex flex-col space-y-4 pt-8 px-4 md:px-0", className)}>
      {messages.length === 0 ? (
        // Welcome screen when no messages
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-full max-w-xs mx-auto mb-8">
            <Image
              src="/images/welcome-car.png"
              alt="Welcome to RevUp Chat"
              width={400}
              height={225}
              className="rounded-lg shadow-xl w-full h-auto"
              priority
            />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Welcome to RevUp Chat
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
            Your AI-powered assistant for finding the perfect vehicle. Ask anything about cars in our inventory!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <button 
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => onQuestionClick?.("What are the newest cars in inventory?")}
            >
              Newest arrivals
            </button>
            
            <button 
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => onQuestionClick?.("What's the best deal right now?")}
            >
              Best deals
            </button>
            
            <button 
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => onQuestionClick?.("Show me SUVs under $35,000")}
            >
              SUVs under $35k
            </button>
            
            <button 
              className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => onQuestionClick?.("I need a truck with good towing capacity")}
            >
              Trucks
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
          
          {/* Empty div for scrolling to the bottom */}
          <div ref={messagesEndRef} className="h-1" />
        </>
      )}
    </div>
  );
}