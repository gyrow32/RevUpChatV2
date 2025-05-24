'use client';

import { ChatProvider } from '@/components/providers/ChatProvider';
import ChatWindow from './components/ChatWindow';

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Enhanced Cinematic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Multiple gradient layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-purple-900/10"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-green-900/5 via-transparent to-cyan-900/8"></div>
        
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-blue-600/8 to-cyan-600/8 rounded-full blur-3xl animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/8 rounded-full blur-3xl animate-pulse delay-1000 opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-600/6 to-teal-600/6 rounded-full blur-3xl animate-pulse delay-500 opacity-30"></div>
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-r from-orange-600/8 to-red-600/6 rounded-full blur-3xl animate-pulse delay-2000 opacity-35"></div>
        </div>
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Radial gradient overlay for focus */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>
        
        <div className="w-full max-w-[98%] mx-auto h-[98vh] relative z-10">
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden h-full shadow-black/50">
            <ChatWindow className="h-full" />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}