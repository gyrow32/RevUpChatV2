'use client';

import { useEffect, useRef, useState } from 'react';
import Message from './Message';
import ThinkingIndicator from './ThinkingIndicator';
import type { Message as MessageType } from '@/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Smart scroll to show beginning of new AI responses
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        const container = messagesContainerRef.current;
        if (container) {
          // For user messages, just scroll to show them
          const lastMessage = messages[messages.length - 1];
          if (lastMessage.role === 'user') {
            // Scroll to bottom for user messages
            container.scrollTop = container.scrollHeight;
          } else {
            // For AI responses, scroll to show the beginning of the response
            // Find the position where the new AI message starts
            const messageElements = container.children;
            if (messageElements.length >= 2) {
              // Get the second-to-last element (user message) 
              const userMessage = messageElements[messageElements.length - 2] as HTMLElement;
              // Scroll to just after the user message to show start of AI response
              userMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end' 
              });
              // Small delay then scroll a bit more to show AI response start
              setTimeout(() => {
                window.scrollBy(0, 40);
              }, 300);
            }
          }
        }
      }, 100);
    }
  }, [messages]);
  
  // Scroll to beginning of response when loading completes
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setTimeout(() => {
        const container = messagesContainerRef.current;
        const lastMessage = messages[messages.length - 1];
        
        if (container && lastMessage.role === 'assistant') {
          // When AI finishes responding, ensure we see the beginning
          const messageElements = container.children;
          if (messageElements.length >= 2) {
            const userMessage = messageElements[messageElements.length - 2] as HTMLElement;
            userMessage.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end' 
            });
            setTimeout(() => {
              window.scrollBy(0, 40);
            }, 300);
          }
        }
      }, 200);
    }
  }, [isLoading, messages]);

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
      color: 'from-blue-600/70 to-cyan-600/60',
      badge: 'POPULAR' 
    },
    { 
      icon: '💰', 
      label: 'Budget $300/mo', 
      description: 'Find your perfect match',
      query: 'What can I get for $300/month?', 
      color: 'from-green-600/70 to-emerald-600/60',
      badge: 'SMART CHOICE'
    },
    { 
      icon: '⚡', 
      label: 'Electric Vehicles', 
      description: 'Eco-friendly & efficient',
      query: 'Show me electric vehicles', 
      color: 'from-yellow-600/70 to-orange-600/60',
      badge: 'ECO'
    },
    { 
      icon: '🔢', 
      label: 'VIN Lookup', 
      description: 'Instant vehicle history',
      query: 'I want to check a VIN', 
      color: 'from-purple-600/70 to-violet-600/60',
      badge: 'QUICK'
    }
  ];
  
  return (
    <div 
      className={cn("flex-1 overflow-y-auto overflow-x-hidden px-4", className)}
      style={{ maxHeight: '100%' }}
    >
      <div ref={messagesContainerRef} className="py-6 space-y-2">
        {messages.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-8 overflow-hidden">
            {/* Cinematic Background Elements - Mobile Optimized */}
            <div className="absolute inset-0 opacity-15 sm:opacity-20">
              {/* Animated gradient orbs - Smaller on mobile */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-28 h-28 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-72 sm:h-72 bg-gradient-to-r from-green-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Floating particles - Reduced on mobile */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full animate-float hidden sm:block"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Main Content - Mobile Optimized */}
            <div className={cn(
              "relative z-10 transition-all duration-1000 ease-out max-w-lg mx-auto",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              {/* Cinematic Hero Car Section - Blended Into Background */}
              <div className={cn(
                "relative mb-6 sm:mb-8 transition-all duration-1000 delay-300 overflow-hidden rounded-2xl",
                isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              )}>
                {/* Hero Image Container */}
                <div className="relative h-32 sm:h-40 w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
                  {/* Sports Car Image */}
                  <Image 
                    src="/images/sports-car-hero.png"
                    alt="Sleek Sports Car"
                    fill
                    className="object-cover object-center scale-110 transition-transform duration-700 group-hover:scale-125"
                    style={{
                      filter: 'brightness(0.9) contrast(1.1) saturate(1.1)'
                    }}
                  />
                  
                  {/* Cinematic Gradient Overlays for Blending */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-transparent to-gray-900/80"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-transparent to-gray-900/30"></div>
                  
                  {/* Subtle animated particles for premium feel */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${4 + Math.random() * 4}s`
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-6">
                    <div className="text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        {/* <span className="text-xs font-semibold bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm border border-white/20">
                          AI POWERED
                        </span> */}
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white/90 drop-shadow-lg">
                        RevUpChat Assistant
                      </h2>
                      <p className="text-xs sm:text-sm text-white/70 mt-1">
                        Find your perfect vehicle
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle bottom fade to blend with content below */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
              </div>
              
              {/* Cinematic Title - Mobile Optimized */}
              <div className={cn(
                "transition-all duration-1000 delay-500",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-200 mb-3 sm:mb-4 drop-shadow-2xl tracking-wide">
                  Welcome to RevUpChat!
                </h3>
                
                <div className="h-0.5 sm:h-1 w-20 sm:w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-4 sm:mb-6 opacity-60"></div>
              </div>
              
              {/* Subtitle - Mobile Optimized */}
              <div className={cn(
                "transition-all duration-1000 delay-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed font-light px-2">
                  I&apos;m your car shopping assistant. 
                  Discover your perfect vehicle with personalized recommendations.
                </p>
              </div>
              
              {/* Action Cards - Mobile Optimized */}
              <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full transition-all duration-1000 delay-900",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onQuestionClick?.(action.query)}
                    className={cn(
                      "group relative overflow-hidden h-auto p-4 sm:p-6 text-left bg-black/30 backdrop-blur-md rounded-xl sm:rounded-2xl",
                      "hover:bg-black/50 border border-white/10 hover:border-white/20",
                      "transition-all duration-300 shadow-xl hover:shadow-2xl",
                      "hover:scale-[1.02] transform-gpu hover:-translate-y-1 min-h-[100px] sm:min-h-[140px]",
                      "touch-target active:scale-95"
                    )}
                    style={{
                      animationDelay: `${1200 + index * 150}ms`
                    }}
                  >
                    {/* Card background gradient */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-30 group-hover:opacity-50 transition-opacity duration-300",
                      action.color
                    )}></div>
                    
                    {/* Badge - Mobile Optimized */}
                    <div className="absolute top-2 right-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-white/60 bg-white/8 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/15 backdrop-blur-sm">
                        {action.badge}
                      </span>
                    </div>
                    
                    {/* Content - Mobile Optimized */}
                    <div className="relative z-10 pr-12 sm:pr-20">
                      {/* Icon and Title Row */}
                      <div className="flex items-start mb-2 sm:mb-3">
                        <div className="relative flex-shrink-0">
                          <div className={cn(
                            "absolute inset-0 blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300",
                            action.color.replace('/40', '/30').replace('/30', '/20')
                          )}></div>
                          <span className="relative text-xl sm:text-2xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300 block">
                            {action.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm sm:text-lg group-hover:text-blue-100 transition-colors duration-300 leading-tight">
                            {action.label}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="ml-8 sm:ml-12">
                        <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium">
                          {action.description}
                        </p>
                        
                        {/* Hover Indicator */}
                        <div className="mt-2 sm:mt-3 flex items-center text-xs text-gray-500 group-hover:text-blue-400 transition-all duration-300">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Tap to explore →
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced hover effect border */}
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={cn(
                        "absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      )}></div>
                      <div className={cn(
                        "absolute inset-0 rounded-xl sm:rounded-2xl border opacity-30",
                        action.color.includes('blue') && "border-blue-400/30",
                        action.color.includes('green') && "border-green-400/30", 
                        action.color.includes('yellow') && "border-yellow-400/30",
                        action.color.includes('purple') && "border-purple-400/30"
                      )}></div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Call to Action - Mobile Optimized */}
              <div className={cn(
                "mt-6 sm:mt-8 transition-all duration-1000 delay-1000",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-400">
                  <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-gray-500"></div>
                  <span>Or type your question below</span>
                  <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-gray-500"></div>
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
        
        {/* Scroll anchor - keep for fallback */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}