export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 relative">
      {/* Enhanced Background with More Color and Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 dark:from-black dark:via-gray-950 dark:to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/20 via-transparent to-purple-200/20 dark:from-blue-900/10 dark:to-purple-900/10"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-amber-100/10 via-transparent to-cyan-200/15 dark:from-green-900/5 dark:to-cyan-900/8"></div>
      
      {/* Subtle grid pattern overlay */}
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
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/5 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-72 sm:h-72 bg-gradient-to-r from-green-500/15 to-teal-500/15 rounded-full blur-3xl animate-pulse delay-500 opacity-30"></div>
      </div>
      
      {/* Welcome Card */}
      <div className="bg-white/95 border border-gray-200/90 shadow-xl shadow-blue-100/50 dark:bg-black/30 dark:border-white/5 dark:shadow-black/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 text-center relative z-10 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-transparent bg-clip-text dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-200 dark:to-cyan-200">
          Welcome to RevUpChat!
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed font-light">
          I&apos;m your car shopping assistant. Discover your perfect vehicle with personalized recommendations.
        </p>
        <a 
          href="/chat" 
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl border border-blue-400/50 hover:border-blue-300/70 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 font-semibold text-lg"
        >
          Start Chatting
        </a>
      </div>
    </main>
  );
}