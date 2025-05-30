'use client';
// Deployment trigger - fix applied for duplicate scrollToTop import

import { useEffect } from 'react';
import { ChatProvider } from '@/components/providers/ChatProvider';
import ChatWindow from './components/ChatWindow';
import { scrollToTop } from '@/lib/utils';

export default function ChatPage() {
  // Ensure page starts at top on load (mobile fix)
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <ChatProvider>
      {/* Mobile-first full viewport container */}
      <div className="min-h-screen min-h-[100dvh] relative overflow-hidden">
        {/* Enhanced Cinematic Background - Mobile Optimized */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-black"></div>
        
        {/* Multiple gradient layers for depth - Mobile Optimized */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/20 via-transparent to-purple-200/20 dark:from-blue-900/10 dark:to-purple-900/10"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-100/10 via-transparent to-cyan-200/15 dark:from-green-900/5 dark:to-cyan-900/8"></div>
        
        {/* Animated background orbs - Mobile Optimized */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/3 right-1/5 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000 opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-72 sm:h-72 bg-gradient-to-r from-green-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse delay-500 opacity-30"></div>
          <div className="absolute top-3/4 left-1/3 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-orange-500/15 to-red-500/12 rounded-full blur-3xl animate-pulse delay-2000 opacity-35"></div>
        </div>
        
        {/* Subtle grid pattern overlay - Mobile Optimized */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.2) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px'
          }}
        ></div>
        
        {/* Radial gradient overlay for focus */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-gray-300/30 dark:to-black/20"></div>
        
        {/* Mobile-first chat container with safe areas */}
        <div className="w-full h-screen h-[100dvh] relative z-10 pb-safe-bottom">
          <div className="bg-white/90 dark:bg-black/20 backdrop-blur-xl border border-gray-200/90 dark:border-white/10 overflow-hidden h-full flex flex-col shadow-xl">
            <ChatWindow className="h-full flex-1" />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}