export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 relative">
      {/* Enhanced Background with More Color and Contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-50 dark:from-black dark:via-gray-950 dark:to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/30 via-transparent to-purple-200/30 dark:from-blue-900/20 dark:to-purple-900/20"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-amber-100/20 via-transparent to-cyan-200/25 dark:from-green-900/10 dark:to-cyan-900/15"></div>
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,.25) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px'
        }}
      ></div>
      
      {/* Animated background orbs with increased brightness */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-600/25 to-cyan-600/25 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/5 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-purple-600/25 to-pink-600/25 rounded-full blur-3xl animate-pulse delay-1000 opacity-70"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-72 sm:h-72 bg-gradient-to-r from-green-500/25 to-teal-500/25 rounded-full blur-3xl animate-pulse delay-500 opacity-50"></div>
      </div>
      
      {/* Welcome Card - Improved vertical spacing and contrast */}
      <div className="bg-white/95 border border-gray-200/90 shadow-xl shadow-blue-100/50 dark:bg-black/50 dark:border-white/10 dark:shadow-black/50 backdrop-blur-xl rounded-3xl p-7 sm:p-10 text-center relative z-10 max-w-2xl mx-auto">
        {/* Car Image Section - Brighter with better contrast */}
        <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-indigo-600/40 rounded-xl"></div>
          <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl"></div>
          <div className="relative h-full w-full flex items-center justify-center p-3">
            <img 
              src="/images/20250527_0657_Sleek Blue Sports Car_simple_compose_01jw8p52beeva9xxcayar93awc.png" 
              alt="Sleek sports car"
              className="w-full h-full object-contain brightness-110 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent dark:from-blue-900/40"></div>
          </div>
        </div>
        
        {/* Title with improved contrast */}
        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-md p-3 rounded-xl mb-5 border border-gray-100 dark:border-white/10 shadow-sm">
          <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-transparent bg-clip-text dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-300 dark:to-cyan-300">
            Welcome to RevUpChat!
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200 mt-3 leading-relaxed font-light">
            I&apos;m your car shopping assistant. Discover your perfect vehicle with personalized recommendations.
          </p>
        </div>
        
        {/* Enhanced CTA Button */}
        <a 
          href="/chat" 
          className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white rounded-xl border border-blue-400/50 hover:border-blue-300/70 transition-all duration-200 shadow-lg hover:shadow-blue-500/40 font-semibold text-lg animate-pulse hover:animate-none"
        >
          Start Chatting
        </a>
      </div>
    </main>
  );
}