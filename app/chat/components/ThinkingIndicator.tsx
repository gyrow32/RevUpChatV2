'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  className?: string;
}

const thinkingSteps = [
  { icon: '🔍', text: 'Analyzing your request...', duration: 2000 },
  { icon: '☕', text: 'Grab a cup of coffee, this might take a sec...', duration: 2500 },
  { icon: '📊', text: 'Searching RevUP inventory database...', duration: 3000 },
  { icon: '🤖', text: 'Let me do the heavy lifting here...', duration: 2000 },
  { icon: '💰', text: 'Calculating financing options...', duration: 2500 },
  { icon: '😎', text: 'Just relax, I\'ve got this covered...', duration: 2200 },
  { icon: '🚗', text: 'Processing vehicle history and specs...', duration: 2800 },
  { icon: '🧠', text: 'Putting my AI brain to work...', duration: 1800 },
  { icon: '📈', text: 'Running payment algorithms...', duration: 2200 },
  { icon: '🎯', text: 'Matching vehicles to your preferences...', duration: 2000 },
  { icon: '🍿', text: 'This is the fun part - finding your perfect ride!', duration: 2300 },
  { icon: '✨', text: 'Preparing your personalized results...', duration: 1500 },
  { icon: '🏎️', text: 'Almost there... polishing the good stuff!', duration: 1900 },
  { icon: '📋', text: 'Organizing vehicle details...', duration: 1800 },
  { icon: '🎉', text: 'Getting ready to blow your mind...', duration: 1700 },
  { icon: '🔧', text: 'Fine-tuning recommendations...', duration: 2000 },
];

export default function ThinkingIndicator({ className = '' }: ThinkingIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const step = thinkingSteps[currentStep];
    if (!step) {
      // Cycle back to beginning if we run out of steps
      setCurrentStep(0);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % thinkingSteps.length);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const currentStepData = thinkingSteps[currentStep];

  return (
    <div className={cn("flex justify-start mb-6", className)}>
      <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%] bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-md shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Animated thinking dots */}
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            
            {/* Current step with icon */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-base animate-pulse">{currentStepData?.icon}</span>
              <span className="animate-pulse">{currentStepData?.text}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-white/10 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-500 h-1 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / thinkingSteps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 