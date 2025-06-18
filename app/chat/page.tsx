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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900"></div>
        <div className="absolute inset-0 dark:bg-gradient-to-tr dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20"></div>
        
        {/* Mobile-first chat container with safe areas */}
        <div className="w-full h-screen h-[100dvh] relative z-10 pb-safe-bottom">
          <div className="bg-white/95 dark:bg-slate-900/95 dark:backdrop-blur-md border border-gray-200/80 dark:border-slate-700/50 h-full flex flex-col shadow-lg dark:shadow-2xl overflow-hidden">
            <ChatWindow className="h-full flex-1" />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}