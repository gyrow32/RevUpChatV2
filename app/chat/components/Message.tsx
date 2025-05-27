'use client';

import TextBlock from './blocks/TextBlock';
import VehicleBlock from './blocks/VehicleBlock';
import TableBlock from './blocks/TableBlock';
import SurveyBlock from './blocks/SurveyBlock';
import QuestionBlock from './blocks/QuestionBlock';
import type { Message as MessageType, ParsedResponse } from '@/types';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: MessageType;
  onRetry?: (messageId: string) => void;
  onQuestionClick?: (question: string) => void;
  className?: string;
}

export default function Message({ 
  message, 
  onRetry, 
  onQuestionClick,
  className = '' 
}: MessageProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';
  
  // Check if this message contains vehicle galleries that need full width
  const hasVehicleGallery = !isUser && message.content && 
    typeof message.content === 'object' && 
    'blocks' in message.content &&
    (message.content as ParsedResponse).blocks?.some(block => 
      block.type === 'gallery' || block.type === 'hybrid'
    );
  
  const renderContent = () => {
    if (isUser) {
      // User messages are always text
      return <TextBlock content={message.content as string} isUser={true} />;
    }
    
    // Assistant messages can have blocks
    const parsedContent = message.content as ParsedResponse;
    
    if (!parsedContent.blocks || parsedContent.blocks.length === 0) {
      return <TextBlock content="No content available" isUser={false} />;
    }
    
    return (
      <div className="space-y-4">
        {parsedContent.blocks.map((block, index) => {
          switch (block.type) {
            case 'text':
              return (
                <TextBlock 
                  key={index} 
                  content={block.content as string} 
                  isUser={false} 
                />
              );
              
            case 'gallery':
              return (
                <VehicleBlock 
                  key={index} 
                  vehicles={(block as any).vehicles || []} 
                />
              );
              
            case 'hybrid':
              return (
                <VehicleBlock 
                  key={index} 
                  vehicles={block.content as any[]} 
                />
              );
              
            case 'table':
              return (
                <TableBlock 
                  key={index} 
                  columns={(block as any).columns || []}
                  rows={(block as any).rows || []}
                />
              );
              
            case 'survey':
              return (
                <SurveyBlock 
                  key={index} 
                  questions={block.content as string[]}
                  onSubmit={(ratings) => {
                    console.log('Survey ratings:', ratings);
                    // Could send ratings back to chat
                    // onQuestionClick?.(`My ratings: ${JSON.stringify(ratings)}`);
                  }}
                />
              );
              
            case 'questions':
              return (
                <QuestionBlock 
                  key={index} 
                  questions={block.content as string[]}
                  onQuestionClick={onQuestionClick}
                />
              );
              
            default:
              console.warn('Unknown block type:', block);
              return (
                <TextBlock 
                  key={index} 
                  content={`[Unknown block type: ${(block as any).type}]`} 
                  isUser={false} 
                />
              );
          }
        })}
      </div>
    );
  };
  
  return (
    <div
      data-message-id={message.id}
      className={cn(
        "flex mb-10",
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div className={cn(
        // Only constrain width for non-vehicle-gallery messages
        !hasVehicleGallery && "max-w-[85%] md:max-w-[75%] lg:max-w-[65%]",
        // Vehicle galleries get nearly full width with just small margins
        hasVehicleGallery && "w-full max-w-[95%]",
        "shadow-lg rounded-2xl backdrop-blur-sm",
        isUser 
          ? "bg-blue-600/70 text-white rounded-br-md border border-blue-400/30" 
          : "bg-black/30 border border-white/10 rounded-bl-md",
        isError && "border-red-400/50 bg-red-500/20"
      )}>
        <div className="p-5">
          {renderContent()}
          
          {/* Status indicators */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {isSending && (
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <div className="animate-spin text-xs">⟳</div>
                  <span>Sending...</span>
                </div>
              )}
              
              {isError && (
                <div className="flex items-center gap-2 text-red-300">
                  <span className="text-xs">⚠️</span>
                  <span className="text-sm">Failed to send</span>
                </div>
              )}
            </div>
            
            {/* Retry button for errors */}
            {isError && onRetry && (
              <button
                onClick={() => onRetry(message.id)}
                className="text-xs text-red-300 bg-red-500/20 py-1 px-2 rounded border border-red-400/50 hover:bg-red-500/30 backdrop-blur-sm transition-all duration-200"
              >
                <span className="mr-1">⟳</span>
                Retry
              </button>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-2 flex items-center gap-1",
            isUser 
              ? "text-blue-200" 
              : "text-gray-400"
          )}>
            <span className="text-xs">🕒</span>
            <span>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}