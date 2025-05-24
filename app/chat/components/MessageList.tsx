'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  
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

  // Animation trigger for welcome screen
  useEffect(() => {
    if (messages.length === 0) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);
  
  const quickActions = [
    { 
      icon: '🔍', 
      label: 'Browse SUVs', 
      description: '150+ premium SUVs available',
      query: 'Show me available SUVs', 
      color: 'from-blue-600/40 to-cyan-600/30',
      badge: 'POPULAR' 
    },
    { 
      icon: '💰', 
      label: 'Budget $300/mo', 
      description: 'Find your perfect match',
      query: 'What can I get for $300/month?', 
      color: 'from-green-600/40 to-emerald-600/30',
      badge: 'SMART CHOICE'
    },
    { 
      icon: '⚡', 
      label: 'Electric Vehicles', 
      description: 'Eco-friendly & efficient',
      query: 'Show me electric vehicles', 
      color: 'from-yellow-600/40 to-orange-600/30',
      badge: 'ECO'
    },
    { 
      icon: '🔢', 
      label: 'VIN Lookup', 
      description: 'Instant vehicle history',
      query: 'I want to check a VIN', 
      color: 'from-purple-600/40 to-violet-600/30',
      badge: 'QUICK'
    }
  ];
  
  return (
    <div 
      className={cn("flex-1 overflow-y-auto overflow-x-hidden px-4", className)}
      style={{ maxHeight: '100%' }}
    >
      <div className="py-6 space-y-2">
        {messages.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-4 overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 opacity-20">
              {/* Animated gradient orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Main Content */}
            <div className={cn(
              "relative z-10 transition-all duration-1000 ease-out",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              {/* Hero Car Icon */}
              <div className={cn(
                "relative group mb-8 transition-all duration-700 delay-300",
                isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              )}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/20 to-cyan-600/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600/40 to-purple-700/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-400/30 shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:scale-110">
                  <span className="text-4xl animate-bounce">🚗</span>
                </div>
              </div>
              
              {/* Cinematic Title */}
              <div className={cn(
                "transition-all duration-1000 delay-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-200 mb-4 drop-shadow-2xl tracking-wide">
                  Welcome to RevUpChat!
                </h3>
                
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6 opacity-60"></div>
              </div>
              
              {/* Subtitle */}
              <div className={cn(
                "transition-all duration-1000 delay-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed font-light">
                  I&apos;m your <span className="text-blue-300 font-semibold">AI-powered</span> car shopping assistant. 
                  Discover your perfect vehicle with personalized recommendations and expert guidance.
                </p>
              </div>
              
              {/* Action Cards */}
              <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl transition-all duration-1000 delay-900",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onQuestionClick?.(action.query)}
                    className={cn(
                      "group relative overflow-hidden h-auto p-6 text-left bg-black/30 backdrop-blur-md rounded-2xl",
                      "hover:bg-black/50 border border-white/10 hover:border-white/20",
                      "transition-all duration-300 shadow-xl hover:shadow-2xl",
                      "hover:scale-[1.02] transform-gpu hover:-translate-y-1 min-h-[140px]"
                    )}
                    style={{
                      animationDelay: `${1200 + index * 150}ms`
                    }}
                  >
                    {/* Card background gradient */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-15 transition-opacity duration-300",
                      action.color
                    )}></div>
                    
                    {/* Badge - repositioned to avoid overlap */}
                    <div className="absolute top-2 right-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-white/60 bg-white/8 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-sm">
                        {action.badge}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 pr-20">
                      {/* Icon and Title Row */}
                      <div className="flex items-start mb-3">
                        <div className="relative flex-shrink-0">
                          <div className={cn(
                            "absolute inset-0 blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300",
                            action.color.replace('/40', '/30').replace('/30', '/20')
                          )}></div>
                          <span className="relative text-2xl mr-4 group-hover:scale-110 transition-transform duration-300 block">
                            {action.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg group-hover:text-blue-100 transition-colors duration-300 leading-tight">
                            {action.label}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="ml-12">
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
                          {action.description}
                        </p>
                        
                        {/* Hover Indicator */}
                        <div className="mt-3 flex items-center text-xs text-gray-500 group-hover:text-blue-400 transition-all duration-300">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Click to explore →
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced hover effect border */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={cn(
                        "absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      )}></div>
                      <div className={cn(
                        "absolute inset-0 rounded-2xl border opacity-30",
                        action.color.includes('blue') && "border-blue-400/30",
                        action.color.includes('green') && "border-green-400/30", 
                        action.color.includes('yellow') && "border-yellow-400/30",
                        action.color.includes('purple') && "border-purple-400/30"
                      )}></div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Call to Action */}
              <div className={cn(
                "mt-8 transition-all duration-1000 delay-1000",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-500"></div>
                  <span>Or type your own question below</span>
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-500"></div>
                </div>
              </div>
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