'use client';

import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { useChatContext } from '../providers/ChatProvider';
import { debugLog } from '../../lib/utils/debug';

interface ThinkingIndicatorProps {
  className?: string;
}

// Generic thinking steps as fallback
const genericThinkingSteps = [
  { icon: '🔍', text: 'Analyzing your request...', duration: 2000 },
  { icon: '☕', text: 'Grab a cup of coffee, this might take a sec...', duration: 2500 },
  { icon: '📊', text: 'Searching RevUP inventory database...', duration: 3000 },
  { icon: '🤖', text: 'Let me do the heavy lifting here...', duration: 2000 },
  { icon: '😎', text: 'Just relax, I\'ve got this covered...', duration: 2200 },
  { icon: '🏎️', text: 'Almost there... polishing the good stuff!', duration: 1900 },
];

// Category-specific thinking steps
const thinkingStepsByCategory = {
  // Inventory search related steps
  inventory: [
    { icon: '🔍', text: 'Searching RevUP inventory database...', duration: 3000 },
    { icon: '🔎', text: 'Finding vehicles that match your criteria...', duration: 2500 },
    { icon: '📊', text: 'Analyzing available inventory...', duration: 2200 },
    { icon: '🏁', text: 'Racing through our database for you...', duration: 2300 },
    { icon: '🔎', text: 'Checking dealership inventory across locations...', duration: 2800 },
    { icon: '📋', text: 'Organizing vehicle details by your preferences...', duration: 2400 },
  ],
  
  // Financing related steps
  financing: [
    { icon: '💰', text: 'Calculating financing options...', duration: 2500 },
    { icon: '📈', text: 'Running payment algorithms...', duration: 2200 },
    { icon: '💵', text: 'Crunching the numbers on loan options...', duration: 2700 },
    { icon: '🏦', text: 'Analyzing available financing terms...', duration: 2400 },
    { icon: '📊', text: 'Calculating monthly payment scenarios...', duration: 2300 },
    { icon: '💹', text: 'Optimizing your financing package...', duration: 2600 },
  ],
  
  // Vehicle details/specs related steps
  specs: [
    { icon: '📋', text: 'Processing vehicle history and specs...', duration: 2800 },
    { icon: '🔧', text: 'Retrieving detailed specifications...', duration: 2400 },
    { icon: '📋', text: 'Compiling vehicle feature lists...', duration: 2100 },
    { icon: '⚙️', text: 'Analyzing engine and performance specs...', duration: 2500 },
    { icon: '🛠️', text: 'Checking all technical details...', duration: 2300 },
    { icon: '📱', text: 'Loading technology and connectivity features...', duration: 2200 },
  ],
  
  // Comparison related steps
  comparison: [
    { icon: '⚖️', text: 'Comparing vehicle options side by side...', duration: 2800 },
    { icon: '🔄', text: 'Analyzing pros and cons of each model...', duration: 2500 },
    { icon: '📊', text: 'Creating detailed comparison charts...', duration: 2700 },
    { icon: '🎯', text: 'Highlighting key differences between models...', duration: 2400 },
    { icon: '📋', text: 'Ranking options based on your priorities...', duration: 2600 },
    { icon: '🔍', text: 'Finding the perfect match among options...', duration: 2300 },
  ],
  
  // Recommendation related steps
  recommendations: [
    { icon: '🎯', text: 'Matching vehicles to your preferences...', duration: 2000 },
    { icon: '✨', text: 'Preparing your personalized results...', duration: 1500 },
    { icon: '🧠', text: 'Using AI to find your perfect match...', duration: 2300 },
    { icon: '📈', text: 'Ranking vehicles based on your criteria...', duration: 2100 },
    { icon: '🔮', text: 'Predicting which vehicles you\'ll love...', duration: 2400 },
    { icon: '🏆', text: 'Selecting top recommendations just for you...', duration: 2200 },
  ],
  
  // n8n API related steps (more technical, showing what's happening behind the scenes)
  api: [
    { icon: '🔄', text: 'Connecting to RevUP n8n workflow...', duration: 2200 },
    { icon: '📡', text: 'Sending request to inventory API...', duration: 2500 },
    { icon: '⚙️', text: 'Processing data through n8n workflow...', duration: 2800 },
    { icon: '📊', text: 'Transforming API response data...', duration: 2300 },
    { icon: '🔍', text: 'Filtering results based on your query...', duration: 2600 },
    { icon: '📦', text: 'Packaging data for presentation...', duration: 2400 },
  ],
};

export default function ThinkingIndicator({ className = '' }: ThinkingIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSteps, setActiveSteps] = useState(genericThinkingSteps);
  const { state } = useChatContext();

  // Determine which category of thinking steps to show based on user's last message
  useEffect(() => {
    try {
      // Get the last user message
      const userMessages = state.messages.filter(m => m.role === 'user');
      if (userMessages.length === 0) return;
      
      const lastUserMessage = userMessages[userMessages.length - 1]?.content as string;
      if (!lastUserMessage) return;
      
      // Lowercase for easier matching
      const message = lastUserMessage.toLowerCase();
      
      // Detect keywords to determine message category
      const keywordCategories = {
        inventory: ['find', 'search', 'show me', 'available', 'inventory', 'in stock', 'cars', 'vehicles', 'suv', 'truck', 'sedan'],
        financing: ['finance', 'loan', 'payment', 'monthly', 'down payment', 'interest', 'credit', 'afford', 'budget', 'price'],
        specs: ['features', 'specs', 'specifications', 'horsepower', 'mpg', 'mileage', 'engine', 'interior', 'safety', 'technology'],
        comparison: ['compare', 'difference', 'versus', 'vs', 'better', 'pros and cons', 'which one', 'differences'],
        recommendations: ['recommend', 'suggestion', 'best', 'ideal', 'perfect', 'right for me', 'should i', 'advice'],
        api: ['api', 'n8n', 'database', 'data', 'webhook', 'update', 'refresh', 'system']
      };
      
      // Check which category has the most matches
      let bestCategory = 'generic';
      let bestScore = 0;
      
      Object.entries(keywordCategories).forEach(([category, keywords]) => {
        const matchCount = keywords.reduce((count, keyword) => {
          return count + (message.includes(keyword) ? 1 : 0);
        }, 0);
        
        if (matchCount > bestScore) {
          bestScore = matchCount;
          bestCategory = category;
        }
      });
      
      debugLog('Detected thinking category:', { bestCategory, bestScore, message: lastUserMessage });
      
      // If we found a good category match, use those steps
      if (bestScore > 0 && bestCategory in thinkingStepsByCategory) {
        setActiveSteps(thinkingStepsByCategory[bestCategory as keyof typeof thinkingStepsByCategory]);
      } else {
        setActiveSteps(genericThinkingSteps);
      }
      
    } catch (error) {
      debugLog('Error in ThinkingIndicator category detection:', error);
      setActiveSteps(genericThinkingSteps);
    }
  }, [state.messages]);

  // Cycle through the active steps
  useEffect(() => {
    const step = activeSteps[currentStep];
    if (!step) {
      // Cycle back to beginning if we run out of steps
      setCurrentStep(0);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % activeSteps.length);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep, activeSteps]);

  const currentStepData = activeSteps[currentStep];

  return (
    <div className={cn("flex justify-start mb-6 px-4 md:px-0", className)}>
      <div className="w-full bg-black/60 dark:bg-black/60 backdrop-blur-sm border border-white/10 dark:border-white/10 rounded-2xl rounded-bl-md shadow-lg">
        <div className="p-5">
          <div className="flex items-center gap-3">
            {/* Animated thinking dots */}
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            
            {/* Current step with icon */}
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="text-base animate-pulse">{currentStepData?.icon}</span>
              <span className="animate-pulse font-medium">{currentStepData?.text}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-white/20 rounded-full h-1.5">
            <div 
              className="bg-blue-400 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / activeSteps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}