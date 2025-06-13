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
                // Light mode - vibrant with good contrast
                "bg-white border-2 border-gray-300 text-gray-800 shadow-md",
                "hover:bg-blue-50 hover:border-blue-400 hover:text-blue-800",
                // Dark mode - keep the existing dark styling
                "dark:bg-gradient-to-r dark:from-black/50 dark:to-black/40 dark:backdrop-blur-sm",
                "dark:border-white/15 dark:text-white",
                "dark:hover:from-black/70 dark:hover:to-black/60 dark:hover:border-white/25",
                "hover:scale-[1.02] hover:shadow-lg",
                "active:scale-[0.98] transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2",
                selectedQuestion === question && "bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium border border-green-400/50 shadow-md hover:from-green-700 hover:to-emerald-600 hover:shadow-lg dark:shadow-emerald-900/20 dark:border-emerald-400/30"
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