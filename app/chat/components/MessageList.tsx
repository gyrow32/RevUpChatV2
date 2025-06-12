import React, { useEffect, useRef } from 'react';

import { Message as MessageType } from '@/app/lib/types';

import Message from './Message';



interface MessageListProps {

  messages: MessageType[];

  onRetry?: (messageId: string) => void;

  onQuestionClick?: (question: string) => void;

  isLoading?: boolean;

  className?: string;

}



export default function MessageList({ 

  messages, 

  onRetry, 

  onQuestionClick,

  isLoading = false,

  className = ''

}: MessageListProps) {

  const messagesEndRef = useRef<HTMLDivElement>(null);



  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  };



  useEffect(() => {

    scrollToBottom();

  }, [messages]);



  if (messages.length === 0) {

    return (

      <div className="empty-state" data-testid="empty-state">

        {/* Removed sports car image */}

        <h2 className="text-xl font-semibold text-center mb-2">

          Welcome to RevUpChat

        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-center">

          Ask me anything about vehicles, and I&apos;ll help you find the perfect match!

        </p>

      </div>

    );

  }



  const renderQuestions = (questions: string[]) => {

    return (

      <div className="questions-block">

        {questions.map((question, index) => (

          <button

            key={index}

            onClick={() => onQuestionClick?.(question)}

            className="question-button"

          >

            {question}

          </button>

        ))}

      </div>

    );

  };



  const renderMessageContent = (message: MessageType) => {

    if (message.content && typeof message.content === 'object' && 'blocks' in message.content) {

      return message.content.blocks.map((block, index) => {

        if (block.type === 'questions' && Array.isArray(block.content)) {

          return (

            <div key={`${message.id}-block-${index}`}>

              {renderQuestions(block.content)}

            </div>

          );

        }

        return null;

      });

    }

    return null;

  };



  return (

    <div className={`message-list h-full overflow-y-auto px-4 py-6 space-y-4 ${className}`} data-testid="message-list">

      {messages.map((message) => (

        <React.Fragment key={message.id}>

          <Message 

            message={message} 

            onRetry={onRetry ? () => onRetry(message.id) : undefined}

          />

          {renderMessageContent(message)}

        </React.Fragment>

      ))}

      {isLoading && (

        <div className="thinking-indicator" data-testid="thinking-indicator">

          <p>Analyzing your request...</p>

        </div>

      )}

      <div ref={messagesEndRef} data-testid="message-list-end" />

    </div>

  );

} 