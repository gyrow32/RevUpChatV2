'use client';

import TextBlock from './blocks/TextBlock';
import VehicleBlock from './blocks/VehicleBlock';
import TableBlock from './blocks/TableBlock';
import SurveyBlock from './blocks/SurveyBlock';
import QuestionBlock from './blocks/QuestionBlock';
import type { Message as MessageType, ParsedResponse, Block } from '@/app/lib/types';
import { cn, debugLog } from '@/app/lib/utils';

interface MessageProps {
  message: MessageType;
  onRetry?: (messageId: string) => void;
  onQuestionClick?: (question: string) => void;
  className?: string;
}

function isBlock(obj: unknown): obj is Block {
  return typeof obj === 'object' && obj !== null && 'type' in obj;
}

export default function Message({ 
  message, 
  onRetry, 
  onQuestionClick,
  className = '' 
}: MessageProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  
  // Check if this message contains blocks that should span nearly full width
  const parsedBlocks = !isUser && message.content &&
    typeof message.content === 'object' &&
    'blocks' in message.content
      ? (message.content as ParsedResponse).blocks
      : undefined;

  const hasVehicleGallery = parsedBlocks?.some(
    block => isBlock(block) && (block.type === 'gallery' || block.type === 'hybrid')
  );

  const hasTable = parsedBlocks?.some(
    block => isBlock(block) && block.type === 'table'
  );

  // Any block type that should use more width
  const hasWideContent = hasVehicleGallery || hasTable;
  
  // Separate questions from other content blocks if present
  // Get all blocks that are not questions
  const nonQuestionBlocks = !isUser && parsedBlocks 
    ? parsedBlocks.filter(block => !isBlock(block) || block.type !== 'questions')
    : undefined;
    
  // Get only the question blocks
  const questionBlocks = !isUser && parsedBlocks
    ? parsedBlocks.filter(block => isBlock(block) && block.type === 'questions')
    : undefined;
  
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
          if (!isBlock(block)) {
            debugLog('Invalid block:', block);
            return null;
          }

          switch (block.type) {
            case 'text':
              return (
                <TextBlock 
                  key={index} 
                  content={block.content} 
                  isUser={false} 
                />
              );
              
            case 'gallery':
              console.log('Message rendering gallery block with vehicles:', block.vehicles);
              return (
                <VehicleBlock 
                  key={index} 
                  vehicles={block.vehicles} 
                />
              );
              
            case 'hybrid':
              console.log('Message rendering hybrid block with vehicles:', block.content);
              return (
                <VehicleBlock 
                  key={index} 
                  vehicles={block.content} 
                />
              );
              
            case 'table':
              return (
                <TableBlock 
                  key={index} 
                  columns={block.columns}
                  rows={block.rows}
                />
              );
              
            case 'survey':
              return (
                <SurveyBlock 
                  key={index} 
                  questions={block.content}
                  onSubmit={(ratings) => {
                    debugLog('Survey ratings:', ratings);
                    // Could send ratings back to chat
                    // onQuestionClick?.(`My ratings: ${JSON.stringify(ratings)}`);
                  }}
                />
              );
              
            case 'questions':
              return (
                <QuestionBlock 
                  key={index} 
                  questions={block.content}
                  onQuestionClick={onQuestionClick}
                />
              );
              
            default:
              debugLog('Unknown block type:', block);
              return (
                <TextBlock
                  key={index}
                  content={`[Unknown block type: ${(block as { type: string }).type}]`}
                  isUser={false}
                />
              );
          }
        })}
      </div>
    );
  };
  
  const renderNonQuestionContent = () => {
    if (isUser) {
      return <TextBlock content={message.content as string} isUser={true} />;
    }
    
    if (!nonQuestionBlocks || nonQuestionBlocks.length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-4">
        {nonQuestionBlocks.map((block, index) => {
          if (!isBlock(block)) {
            debugLog('Invalid block:', block);
            return null;
          }

          switch (block.type) {
            case 'text':
              return (
                <TextBlock key={index} content={block.content} isUser={false} />
              );
              
            case 'gallery':
              console.log('Message rendering gallery block with vehicles:', block.vehicles);
              return (
                <VehicleBlock key={index} vehicles={block.vehicles} />
              );
              
            case 'hybrid':
              console.log('Message rendering hybrid block with vehicles:', block.content);
              return (
                <VehicleBlock key={index} vehicles={block.content} />
              );
              
            case 'table':
              return (
                <TableBlock key={index} columns={block.columns} rows={block.rows} />
              );
              
            case 'survey':
              return (
                <SurveyBlock 
                  key={index} 
                  questions={block.content}
                  onSubmit={(ratings) => {
                    debugLog('Survey ratings:', ratings);
                  }}
                />
              );
              
            default:
              debugLog('Unknown block type:', block);
              return (
                <TextBlock
                  key={index}
                  content={`[Unknown block type: ${(block as { type: string }).type}]`}
                  isUser={false}
                />
              );
          }
        })}
      </div>
    );
  };
  
  const renderQuestionContent = () => {
    if (!questionBlocks || questionBlocks.length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-4">
        {questionBlocks.map((block, index) => {
          if (!isBlock(block) || block.type !== 'questions') {
            return null;
          }
          
          return (
            <QuestionBlock 
              key={index} 
              questions={block.content}
              onQuestionClick={onQuestionClick}
              className="mt-0"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      data-message-id={message.id}
      className={cn(
        "flex flex-col mb-10",
        isUser ? 'items-end' : 'items-start',
        className
      )}
    >
      {/* Main content bubble (everything except questions) */}
      {(isUser || (nonQuestionBlocks && nonQuestionBlocks.length > 0)) && (
        <div
          data-testid={`message-bubble-${message.id}`}
          className={cn(
            // Only constrain width for standard text messages
            !hasWideContent && "max-w-[85%] md:max-w-[75%] lg:max-w-[65%]",
            // Wide content like galleries and tables get extra width
            hasWideContent && "w-full max-w-[95%]",
            "shadow-lg rounded-2xl backdrop-blur-sm",
            isUser
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md border border-blue-400/30"
              : "bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-bl-md text-gray-800 dark:text-white",
            isError && "border-red-400/50 bg-red-500/20"
          )}
        >
          <div className="p-5">
            {isUser ? renderContent() : renderNonQuestionContent()}
            
            {/* Status indicators */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
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
      )}
      
      {/* Separate card for questions, if present */}
      {!isUser && questionBlocks && questionBlocks.length > 0 && (
        <div className={cn(
          "w-full max-w-[95%] mt-4",
          "shadow-lg rounded-2xl backdrop-blur-sm",
          "bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-bl-md text-gray-800 dark:text-white",
          isError && "border-red-400/50 bg-red-500/20"
        )}>
          <div className="p-5">
            <div className="text-sm mb-2 text-gray-500 dark:text-gray-400">
              Quick options
            </div>
            {renderQuestionContent()}
          </div>
        </div>
      )}
    </div>
  );
}