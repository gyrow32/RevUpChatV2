'use client';

import { ChatProvider } from '@/components/providers/ChatProvider';
import ChatWindow from './components/ChatWindow';

export default function ChatPage() {
  return (
    <ChatProvider>
      {/* Mobile-first full viewport container */}
      <div className="min-h-screen min-h-[100dvh] relative overflow-hidden">
        {/* Enhanced Cinematic Background - Mobile Optimized */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Multiple gradient layers for depth - Mobile Optimized */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-purple-900/10"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-green-900/5 via-transparent to-cyan-900/8"></div>
        
        {/* Animated background orbs - Mobile Optimized */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-600/8 to-cyan-600/8 rounded-full blur-3xl animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/3 right-1/5 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/8 rounded-full blur-3xl animate-pulse delay-1000 opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-72 sm:h-72 bg-gradient-to-r from-green-600/6 to-teal-600/6 rounded-full blur-3xl animate-pulse delay-500 opacity-30"></div>
          <div className="absolute top-3/4 left-1/3 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-orange-600/8 to-red-600/6 rounded-full blur-3xl animate-pulse delay-2000 opacity-35"></div>
        </div>
        
        {/* Subtle grid pattern overlay - Mobile Optimized */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px'
          }}
        ></div>
        
        {/* Radial gradient overlay for focus */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>
        
        {/* Mobile-first chat container with safe areas */}
        <div className="w-full h-screen h-[100dvh] relative z-10 pt-safe-top pb-safe-bottom">
          <div className="bg-black/20 backdrop-blur-xl border-white/10 overflow-hidden h-full flex flex-col">
            <ChatWindow className="h-full flex-1" />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}