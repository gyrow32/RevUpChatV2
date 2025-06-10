'use client';



import { useState } from 'react';

import { cn } from '@/app/lib/utils';



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

      "bg-white dark:bg-gray-800 rounded-lg p-6",

      "border border-gray-200 dark:border-gray-700",

      className

    )}>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

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

                      name={`survey-question-${index}`}

                      id={`survey-question-${index}-${num}`}

                      value={num.toString()}

                      checked={ratings[question] === num.toString()}

                      onChange={(e) => handleRatingChange(question, e.target.value)}

                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"

                    />

                    <label 

                      htmlFor={`survey-question-${index}-${num}`} 

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

            id="survey-submit-button"

            name="survey-submit"

            type="submit"

            disabled={!allQuestionsAnswered}

            className={cn(

              "w-full mt-4 py-2 px-4 rounded-md",

              "bg-blue-600 hover:bg-blue-700",

              "text-white font-medium",

              "transition-colors duration-200",

              !allQuestionsAnswered && "opacity-50 cursor-not-allowed"

            )}

          >

            Submit Survey

          </button>

          

          {!allQuestionsAnswered && (

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">

              Please rate all factors to continue

            </p>

          )}

        </div>

      </form>

    </div>

  );

}