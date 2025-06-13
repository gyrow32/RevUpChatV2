'use client';

import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '../../lib/hooks/useChat';
import { cn } from '../../lib/utils';
import { scrollToTop } from '../../lib/utils/scroll';
import { useTheme } from '../providers/ThemeProvider';
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
  
  const { theme, toggleTheme, isInitialized } = useTheme();
  const [showSessionId, setShowSessionId] = useState(false);
  
  // Ensure page loads at top on mobile (fix scroll position issue)
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToTop();
    }, 100);

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
      "flex flex-col h-full bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-gray-900 dark:to-slate-800",
      className
    )}>
      {/* Header - Clean and Simple */}
      <div className="border-b bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl border-gray-200 dark:border-slate-700/50 shadow-sm dark:shadow-xl px-2 sm:px-6 relative overflow-hidden">
        {/* Glass/highlight overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-30" />
          <div className="block dark:hidden absolute inset-0 opacity-30" />
        </div>
        <div className="pt-safe-top pt-3 sm:pt-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-blue-200 dark:bg-blue-700 rounded-lg sm:rounded-xl opacity-20"></div>
                <div className="relative w-7 h-7 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-800 rounded-lg sm:rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-700 shadow-sm">
                  <span className="text-xs sm:text-xl font-bold text-blue-800 dark:text-blue-200">RC</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-2xl font-bold truncate text-gray-900 dark:text-white leading-tight">
                  RevUpChat
                </h1>
                <p className="text-xs sm:text-base font-light truncate text-blue-700 dark:text-blue-200 -mt-0.5 sm:mt-0">
                  AI Car Shopping Assistant
                </p>
              </div>
            </div>
            
            {/* Mobile-first prominent action buttons with reduced spacing */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="group touch-target rounded-xl transition-all duration-300 shadow-sm relative overflow-hidden active:scale-95 p-2 sm:p-3 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] text-gray-700 dark:text-white bg-white/80 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {isInitialized ? (
                  theme === 'light' ? (
                    <Moon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Sun className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  )
                ) : (
                  <div className="w-5 h-5" />
                )}
              </button>

              {/* Clear Chat Button - More compact on Mobile */}
              <button
                className={cn(
                  "group touch-target rounded-xl transition-all duration-300 shadow-sm relative overflow-hidden active:scale-95",
                  "p-3 sm:p-3 min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px]",
                  messages.length === 0 
                    ? "text-gray-700 dark:text-white/60 hover:text-gray-900 dark:hover:text-white/80 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                    : "text-white bg-red-500 hover:bg-red-600 border border-red-400 hover:border-red-500"
                )}
                onClick={handleClearChat}
                disabled={messages.length === 0}
                title={messages.length === 0 ? "No messages to clear" : `Clear ${messages.length} message${messages.length !== 1 ? 's' : ''}`}
              >
                {/* Message count indicator */}
                {messages.length > 0 && (
                  <div className="absolute top-1 right-1 min-w-[1.2rem] h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border border-white shadow-sm px-1 z-20">
                    {messages.length > 9 ? '9+' : messages.length}
                  </div>
                )}
                
                <span className="relative z-10 text-xs sm:text-xl">🗑️</span>
              </button>
              
              {/* New Session Button - More compact on Mobile */}
              <button
                className="group touch-target rounded-xl transition-all duration-300 shadow-sm relative overflow-hidden active:scale-95 p-3 sm:p-3 min-w-[48px] min-h-[48px] sm:min-w-[44px] sm:min-h-[44px] text-white bg-green-500 hover:bg-green-600 border border-green-400 hover:border-green-500"
                onClick={handleNewSession}
                title="New Session"
              >
                <span className="relative z-10 text-xs sm:text-xl">➕</span>
              </button>
              
              {/* Session Info Button - More compact on mobile */}
              <button
                className="group touch-target rounded-xl transition-all duration-300 shadow-sm relative overflow-hidden active:scale-95 p-3 sm:p-3 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] text-gray-700 dark:text-white/70 hover:text-blue-600 dark:hover:text-blue-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                onClick={() => setShowSessionId(!showSessionId)}
                title="Session Info"
              >
                <span className="relative z-10 text-xs sm:text-lg">⚙️</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Session Info Panel */}
        {showSessionId && (
          <div className="mt-2 sm:mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 shadow-inner relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10 space-y-2 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Session ID:
                </div>
                <div className="text-xs sm:text-sm font-mono text-gray-900 dark:text-white mt-1 bg-white/50 dark:bg-black/30 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 overflow-hidden text-ellipsis">
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
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-red-600 dark:text-red-300 text-lg">
                ⚠️ {error}
              </span>
            </div>
            <button
              className="text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 p-2 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              onClick={dismissError}
            >
              ✖️
            </button>
          </div>
        </div>
      )}
      
      {/* Messages container - Make sure to enable scrolling */}
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages}
          onRetry={retryMessage}
          onQuestionClick={handleQuestionClick}
          isLoading={isLoading}
          className="h-full overflow-y-auto"
        />
      </div>
      
      {/* Input container */}
      <div className="border-t border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/90 dark:backdrop-blur-md p-2 sm:p-4">
        <MessageInput
          onSendMessage={sendMessage}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}