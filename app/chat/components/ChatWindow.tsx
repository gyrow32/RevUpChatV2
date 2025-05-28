'use client';

import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { useTheme } from '../../components/providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

interface ChatWindowProps {
  className?: string;
}

export default function ChatWindow({ className = '' }: ChatWindowProps) {
  const { 
    messages, 
    sessionId, 
    isLoading, 
    error, 
    sendMessage, 
    retryMessage, 
    clearChat,
    dismissError,
    startNewSession
  } = useChat();
  
  const { theme, toggleTheme } = useTheme();
  const [showSessionId, setShowSessionId] = useState(false);
  
  // Ensure page loads at top on mobile (fix scroll position issue)
  useEffect(() => {
    // Force scroll to top on component mount, especially for mobile
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Immediate scroll
    scrollToTop();
    
    // Also scroll after a brief delay to handle any layout shifts
    const timer = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };
  
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat? This cannot be undone.')) {
      clearChat();
    }
  };
  
  const handleNewSession = () => {
    if (messages.length > 0) {
      if (window.confirm('Start a new session? Your current conversation will be saved but you\'ll get a fresh start.')) {
        startNewSession();
      }
    } else {
      startNewSession();
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col h-full bg-gray-100/50 dark:bg-black/10 backdrop-blur-sm",
      className
    )}>
      {/* Premium Black Glass Header - Mobile Optimized with Reduced Spacing */}
      <div className="border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-black/20 backdrop-blur-xl px-3 sm:px-6 relative overflow-hidden">
        {/* Reduced safe area handling for mobile - more compact */}
        <div className="pt-safe-top pt-8 sm:pt-4 py-3 sm:py-4">
          {/* Header background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            <div className="absolute top-0 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
          </div>
          
          {/* Reduced mobile spacing above content */}
          <div className="h-2 sm:h-0 mb-2 sm:mb-0"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Enhanced logo/icon - Mobile Optimized */}
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg sm:rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50"></div>
                <div className="relative w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600/40 to-purple-700/40 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-blue-400/30 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                  <span className="text-sm sm:text-xl">🚗</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-lg truncate">
                  RevUpChat
                </h1>
                <p className="text-xs sm:text-base text-blue-300/80 font-light truncate">
                  AI Car Shopping Assistant
                </p>
              </div>
            </div>
            
            {/* Mobile-first prominent action buttons with reduced spacing */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="group touch-target backdrop-blur-sm rounded-xl transition-all duration-300 shadow-lg relative overflow-hidden active:scale-95 p-3 sm:p-3 min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px] text-gray-700 dark:text-white bg-white/80 dark:bg-black/40 hover:bg-white/90 dark:hover:bg-black/60 border border-gray-200/50 dark:border-white/10 hover:border-gray-300/50 dark:hover:border-white/20"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 dark:from-white/5 via-transparent to-gray-200/50 dark:to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <Sun className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>

              {/* Clear Chat Button - More compact on Mobile */}
              <button
                className={cn(
                  "group touch-target backdrop-blur-sm rounded-xl transition-all duration-300 shadow-lg relative overflow-hidden active:scale-95",
                  "p-3 sm:p-3 min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px]",
                  messages.length === 0 
                    ? "text-gray-700 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/80 bg-white/80 dark:bg-black/30 border-2 border-gray-200/50 dark:border-white/20 hover:border-gray-300/50 dark:hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed" 
                    : "text-white bg-red-500/30 hover:bg-red-500/40 border-2 border-red-400/50 hover:border-red-300/70 hover:shadow-red-500/40 shadow-red-500/20"
                )}
                onClick={handleClearChat}
                disabled={messages.length === 0}
                title={messages.length === 0 ? "No messages to clear" : `Clear ${messages.length} message${messages.length !== 1 ? 's' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Message count indicator */}
                {messages.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-4 sm:h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border border-white shadow-lg">
                    {messages.length > 9 ? '9+' : messages.length}
                  </div>
                )}
                
                <span className="relative z-10 text-xs sm:text-xl">🗑️</span>
              </button>
              
              {/* New Session Button - More compact on Mobile */}
              <button
                className="group touch-target backdrop-blur-sm rounded-xl transition-all duration-300 shadow-lg relative overflow-hidden active:scale-95 p-3 sm:p-3 min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px] text-white bg-green-500/30 hover:bg-green-500/40 border-2 border-green-400/50 hover:border-green-300/70 hover:shadow-green-500/40 shadow-green-500/20"
                onClick={handleNewSession}
                title="New Session"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-xs sm:text-xl">➕</span>
              </button>
              
              {/* Session Info Button - More compact on mobile */}
              <button
                className="group touch-target backdrop-blur-sm rounded-xl transition-all duration-300 shadow-lg relative overflow-hidden active:scale-95 p-3 sm:p-3 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] text-gray-700 dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-300 bg-white/80 dark:bg-blue-500/20 hover:bg-white/90 dark:hover:bg-blue-500/30 border border-gray-200/50 dark:border-blue-400/30 hover:border-gray-300/50 dark:hover:border-blue-300/50 hover:shadow-blue-500/30"
                onClick={() => setShowSessionId(!showSessionId)}
                title="Session Info"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-xs sm:text-lg">⚙️</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Session Info Panel */}
        {showSessionId && (
          <div className="mt-2 sm:mt-4 p-3 sm:p-4 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-lg sm:rounded-xl border border-gray-200/50 dark:border-white/10 shadow-inner relative overflow-hidden animate-slide-in-up">
            {/* Session info background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10 space-y-2 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Session ID:
                </div>
                <div className="text-xs sm:text-sm font-mono text-gray-900 dark:text-white mt-1 bg-white/50 dark:bg-black/30 px-2 py-1 rounded border border-gray-200/50 dark:border-white/10 overflow-hidden text-ellipsis">
                  {sessionId}
                </div>
              </div>
              <button
                className="touch-target self-end sm:self-auto text-gray-600 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-red-400/20 active:scale-95"
                onClick={() => setShowSessionId(false)}
              >
                <span className="text-sm">✖️</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Premium Error Banner */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-md border-b border-red-400/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-red-300 text-lg">
                ⚠️ {error}
              </span>
            </div>
            <button
              className="text-red-300 hover:text-red-200 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              onClick={dismissError}
            >
              ✖️
            </button>
          </div>
        </div>
      )}
      
      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onRetry={retryMessage}
        onQuestionClick={handleQuestionClick}
        className="flex-1"
      />
      
      {/* Input */}
      <MessageInput
        onSendMessage={sendMessage}
        disabled={!!error}
        isLoading={isLoading}
      />
    </div>
  );
}