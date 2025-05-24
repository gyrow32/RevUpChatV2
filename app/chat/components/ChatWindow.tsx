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
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              RevUpChat
            </h1>
            <p className="text-lg text-blue-300">
              AI Car Shopping Assistant
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              className="p-3 text-white hover:text-blue-400 hover:bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg"
              onClick={() => setShowSessionId(!showSessionId)}
              title="Session Info"
            >
              ⚙️
            </button>
            
            <button
              className="p-3 text-white hover:text-blue-400 hover:bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg"
              onClick={handleNewSession}
              title="New Session"
            >
              ➕
            </button>
            
            <button
              className="p-3 text-white hover:text-blue-400 hover:bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleClearChat}
              disabled={messages.length === 0}
              title="Clear Chat"
            >
              🗑️
            </button>
          </div>
        </div>
        
        {showSessionId && (
          <div className="mt-4 p-4 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300 font-medium">
                  Session ID:
                </div>
                <div className="text-sm font-mono text-white mt-1">
                  {sessionId}
                </div>
              </div>
              <button
                className="text-white hover:text-blue-400 p-2 hover:bg-black/30 rounded-lg transition-all duration-200"
                onClick={() => setShowSessionId(false)}
              >
                ✖️
              </button>
            </div>
            <div className="text-sm text-gray-300 mt-3">
              Messages: {messages.length} • 
              Status: {isLoading ? 'Processing...' : 'Ready'}
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