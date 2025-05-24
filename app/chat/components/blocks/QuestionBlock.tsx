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
    <div className={cn("mt-6", className)}>
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-300 mb-3">
          ### Follow-up Questions
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {questions.map((question, index) => (
          <button
            key={index}
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium",
              "bg-black/40 backdrop-blur-sm border border-white/20 text-white",
              "hover:bg-black/60 hover:border-white/30 hover:scale-105",
              "transition-all duration-200 shadow-lg hover:shadow-xl",
              "active:scale-95"
            )}
            onClick={() => onQuestionClick?.(question)}
          >
            <span className="mr-2 text-base">
              {index === 0 ? '💰' : index === 1 ? '🔍' : index === 2 ? '🚗' : '📅'}
            </span>
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}