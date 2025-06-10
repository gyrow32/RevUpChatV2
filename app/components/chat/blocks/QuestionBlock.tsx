'use client';

import { useState } from 'react';
import { cn } from '@/app/lib/utils';

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
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  
  if (!questions || questions.length === 0) {
    return null;
  }

  // Smart emoji selection based on question content
  const getEmoji = (question: string, index: number) => {
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('$') || lowerQ.includes('payment') || lowerQ.includes('budget') || lowerQ.includes('finance')) return '💰';
    if (lowerQ.includes('lease') || lowerQ.includes('deal')) return '🔍';
    if (lowerQ.includes('compare') || lowerQ.includes('side')) return '⚖️';
    if (lowerQ.includes('margin') || lowerQ.includes('inventory')) return '🚗';
    if (lowerQ.includes('old') || lowerQ.includes('age')) return '📅';
    if (lowerQ.includes('detail') || lowerQ.includes('spec')) return '📋';
    if (lowerQ.includes('electric') || lowerQ.includes('hybrid')) return '⚡';
    if (lowerQ.includes('suv') || lowerQ.includes('truck')) return '🚙';
    // Fallback emojis by position
    return ['💰', '🔍', '🚗', '📅', '⭐'][index] || '💬';
  };
  
  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    onQuestionClick?.(question);
  };

  return (
    <div className={cn("mt-4", className)}>
      <div className="flex flex-wrap gap-2.5">
        {questions.map((question, index) => {
          // Only show the selected question or all questions if none selected
          if (selectedQuestion !== null && selectedQuestion !== question) {
            return null;
          }
          
          return (
            <button
              key={index}
              className={cn(
                "group inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium",
                "bg-gradient-to-r from-black/50 to-black/40 backdrop-blur-sm",
                "border border-white/15 text-white",
                "hover:from-black/70 hover:to-black/60 hover:border-white/25",
                "hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10",
                "active:scale-[0.98] transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-black",
                selectedQuestion === question && "from-blue-600/80 to-blue-500/70 border-blue-400/30"
              )}
              onClick={() => handleQuestionClick(question)}
              disabled={selectedQuestion !== null && selectedQuestion !== question}
            >
              <span className="mr-2.5 text-base group-hover:scale-110 transition-transform duration-200">
                {getEmoji(question, index)}
              </span>
              <span className="leading-none">
                {question}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}