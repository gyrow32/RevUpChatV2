import React from 'react';

interface TextBlockProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

export default function TextBlock({ content, isUser = false, className = '' }: TextBlockProps) {
  return (
    <div 
      className={`text-block ${className}`}
      data-testid="text-block"
    >
      <p 
        className={`${isUser ? 'text-white' : 'dark:text-gray-100'} whitespace-pre-wrap`}
        data-testid="text-block-paragraph"
      >
        {content}
      </p>
    </div>
  );
} 