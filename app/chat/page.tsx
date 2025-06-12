'use client';
// Deployment trigger - fix applied for duplicate scrollToTop import

import { useEffect } from 'react';
import { ChatProvider } from '../components/providers/ChatProvider';
import ChatWindow from '../components/chat/ChatWindow';
import { scrollToTop } from '../lib/utils/scroll';

export default function ChatPage() {
  // Ensure page starts at top on load (mobile fix)
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <ChatProvider>
      {/* Mobile-first full viewport container */}
      <div className="min-h-screen min-h-[100dvh] relative overflow-hidden">
        {/* Enhanced background with gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>
        
        {/* Mobile-first chat container with safe areas */}
        <div className="w-full h-screen h-[100dvh] relative z-10 pb-safe-bottom">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full flex flex-col shadow-md overflow-hidden">
            <ChatWindow className="h-full flex-1 pb-[40px] sm:pb-0" />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}