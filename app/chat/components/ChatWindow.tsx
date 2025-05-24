'use client';

import { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

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
  
  const [showSessionId, setShowSessionId] = useState(false);
  
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
      "flex flex-col h-full bg-black/10 backdrop-blur-sm",
      className
    )}>
      {/* Premium Black Glass Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 relative overflow-hidden">
        {/* Header background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            {/* Enhanced logo/icon */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-50"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600/40 to-purple-700/40 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                <span className="text-xl">🚗</span>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-lg">
                RevUpChat
              </h1>
              <p className="text-base text-blue-300/80 font-light">
                AI Car Shopping Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="group p-3 text-white/80 hover:text-blue-400 hover:bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 relative overflow-hidden"
              onClick={() => setShowSessionId(!showSessionId)}
              title="Session Info"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">⚙️</span>
            </button>
            
            <button
              className="group p-3 text-white/80 hover:text-green-400 hover:bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300 shadow-lg hover:shadow-green-500/20 relative overflow-hidden"
              onClick={handleNewSession}
              title="New Session"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">➕</span>
            </button>
            
            <button
              className="group p-3 text-white/80 hover:text-red-400 hover:bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-red-400/30 transition-all duration-300 shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-white/80 relative overflow-hidden"
              onClick={handleClearChat}
              disabled={messages.length === 0}
              title="Clear Chat"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-lg">🗑️</span>
            </button>
          </div>
        </div>
        
        {showSessionId && (
          <div className="mt-4 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-inner relative overflow-hidden animate-slide-in-up">
            {/* Session info background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <div className="text-sm text-gray-300 font-medium">
                  Session ID:
                </div>
                <div className="text-sm font-mono text-white mt-1 bg-black/30 px-2 py-1 rounded border border-white/10">
                  {sessionId}
                </div>
              </div>
              <button
                className="text-white/70 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-red-400/20"
                onClick={() => setShowSessionId(false)}
              >
                ✖️
              </button>
            </div>
            <div className="text-sm text-gray-300 mt-3 flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span>Messages: {messages.length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  isLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"
                )}></span>
                <span>Status: {isLoading ? 'Processing...' : 'Ready'}</span>
              </span>
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