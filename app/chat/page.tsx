'use client';

import { ChatProvider } from '@/components/providers/ChatProvider';
import ChatWindow from './components/ChatWindow';

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-4">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-5 bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div 
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)`
          }}
        ></div>
        
        <div className="w-full max-w-[98%] mx-auto h-[98vh] relative z-10">
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden h-full">
            <ChatWindow className="h-full" />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}