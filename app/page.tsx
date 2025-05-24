export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
      {/* Deep Black Background */}
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"></div>
      <div className="absolute inset-0 opacity-3 bg-gradient-to-tr from-blue-950/10 via-transparent to-purple-950/10"></div>
      <div 
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.015) 0%, transparent 50%), 
                           radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.015) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.01) 0%, transparent 50%)`
        }}
      ></div>
      
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-12 border border-white/5 shadow-2xl shadow-black/50 text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">RevUpChat</h1>
        <p className="text-xl text-gray-300 mb-8">AI Car Shopping Assistant</p>
        <a 
          href="/chat" 
          className="inline-block px-6 py-3 bg-blue-600/70 backdrop-blur-sm text-white rounded-xl hover:bg-blue-700/80 border border-blue-400/50 hover:border-blue-300/70 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 font-semibold"
        >
          Start Chatting
        </a>
      </div>
    </main>
  );
}