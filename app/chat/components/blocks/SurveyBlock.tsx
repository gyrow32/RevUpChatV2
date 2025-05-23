'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SurveyBlockProps {
  questions: string[];
  onSubmit?: (ratings: Record<string, number>) => void;
  className?: string;
}

export default function SurveyBlock({ 
  questions, 
  onSubmit, 
  className = '' 
}: SurveyBlockProps) {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleRatingChange = (question: string, value: string) => {
    setRatings(prev => ({
      ...prev,
      [question]: value
    }));
  };
  
  const handleSubmit = () => {
    const numericRatings = Object.entries(ratings).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: parseInt(value)
    }), {} as Record<string, number>);
    
    setIsSubmitted(true);
    onSubmit?.(numericRatings);
  };
  
  const allQuestionsAnswered = questions.every(q => ratings[q]);
  
  if (isSubmitted) {
    return (
      <div className={cn(
        "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6",
        className
      )}>
        <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
          <span className="text-xl">✅</span>
          <div>
            <div className="font-semibold">Thanks for your feedback!</div>
            <div className="text-sm text-green-600 dark:text-green-300 mt-1">
              Your preferences will help us find better matches for you.
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6",
      className
    )}>
      <div className="pb-4 mb-4 border-b border-blue-200 dark:border-blue-800">
        <div className="text-lg flex items-center gap-2 font-medium">
          <span className="text-lg">⭐</span>
          Help us find your perfect match
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Rate these factors from 1 (not important) to 5 (very important)
        </p>
      </div>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="space-y-3">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {question}
            </div>
            <div className="flex gap-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center space-x-2">
                  <input 
                    type="radio"
                    name={`question-${index}`}
                    id={`q${index}-${num}`}
                    value={num.toString()}
                    checked={ratings[question] === num.toString()}
                    onChange={() => handleRatingChange(question, num.toString())}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={`q${index}-${num}`} 
                    className="text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {num}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button 
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered}
          className={cn(
            "w-full py-2 px-4 rounded text-white font-medium transition-colors",
            allQuestionsAnswered 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-gray-400 cursor-not-allowed"
          )}
        >
          <span className="mr-2">⭐</span>
          Submit Ratings
        </button>
        
        {!allQuestionsAnswered && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Please rate all factors to continue
          </p>
        )}
      </div>
    </div>
  );
}