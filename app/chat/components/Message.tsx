import React from 'react';
import { Message as MessageType, Block } from '@/app/lib/types';
import TextBlock from './blocks/TextBlock';
import TableBlock from './blocks/TableBlock';
import VehicleCard from './blocks/VehicleCard';

interface MessageProps {
  message: MessageType;
  onRetry?: () => void;
}

export default function Message({ message, onRetry }: MessageProps) {
  const isUser = message.role === 'user';

  const getBubbleClass = () => {
    if (message.role === 'user') return 'message-bubble from-blue-600';
    if (message.role === 'assistant') return 'message-bubble bg-gray-100';
    return 'message-bubble';
  };

  const renderContent = () => {
    if (message.status === 'error') {
      return (
        <div className="error-message">
          <span>Failed to send</span>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="retry-button"
              data-testid="retry-button"
            >
              Retry
            </button>
          )}
        </div>
      );
    }
    if (message.status === 'sending') {
      return <span>Sending...</span>;
    }
    if (typeof message.content === 'string') {
      return <TextBlock content={message.content} />;
    }
    if (message.content && 'blocks' in message.content && Array.isArray(message.content.blocks)) {
      return message.content.blocks.map((block: Block, idx: number) => {
        switch (block.type) {
          case 'text':
            return <TextBlock key={idx} content={block.content} />;
          case 'table':
            return <TableBlock key={idx} columns={block.columns} rows={block.rows} />;
          case 'gallery':
            return null; // Gallery rendering handled elsewhere or add if needed
          default:
            return <span key={idx}>[Unknown block type: {block.type}]</span>;
        }
      });
    }
    return null;
  };

  return (
    <div 
      className={`message ${isUser ? 'user-message' : 'assistant-message'}`}
      data-testid={`message-bubble-${message.id}`}
    >
      <div className={getBubbleClass()}>
        {renderContent()}
        <div className="message-timestamp">
          {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
} 