'use client';

import { cn } from '@/lib/utils';

interface QuestionBlockProps {
  questions: string[];
  onQuestionClick?: (question: string) => void;
  className?: string;
}

export default function QuestionBlock({ 
  questions, 
  onQuestionClick, 
  className = '' 
}: QuestionBlockProps) {
  if (!questions || questions.length === 0) {
    return null;
  }
  
  return (
    <div className={cn(
      "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4",
      className
    )}>
      <div className="pb-3">
        <div className="text-lg flex items-center gap-2 font-medium">
          <span className="text-lg">💬</span>
          Suggested questions
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click any question to continue the conversation
        </p>
      </div>
      
      <div className="space-y-2">
        {questions.map((question, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex justify-between items-center h-auto p-4 text-left rounded-lg",
              "hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm",
              "transition-all duration-200",
              "border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            )}
            onClick={() => onQuestionClick?.(question)}
          >
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-left">
              {question}
            </span>
            <span className="text-gray-400 shrink-0 ml-3">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}