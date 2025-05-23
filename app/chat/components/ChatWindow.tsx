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
      "flex flex-col h-full bg-gray-50 dark:bg-gray-900",
      className
    )}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              RevUpChat
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI Car Shopping Assistant
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowSessionId(!showSessionId)}
              title="Session Info"
            >
              ⚙️
            </button>
            
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={handleNewSession}
              title="New Session"
            >
              ➕
            </button>
            
            <button
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={handleClearChat}
              disabled={messages.length === 0}
              title="Clear Chat"
            >
              🗑️
            </button>
          </div>
        </div>
        
        {showSessionId && (
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Session ID:
                </div>
                <div className="text-xs font-mono text-gray-700 dark:text-gray-300 mt-1">
                  {sessionId}
                </div>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowSessionId(false)}
              >
                ✖️
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Messages: {messages.length} • 
              Status: {isLoading ? 'Processing...' : 'Ready'}
            </div>
          </div>
        )}
      </div>
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-red-600 dark:text-red-400 text-sm">
                ⚠️ {error}
              </span>
            </div>
            <button
              className="text-red-600 hover:text-red-700 dark:text-red-400"
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