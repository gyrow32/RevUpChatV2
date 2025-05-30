import { FaCarSide } from 'react-icons/fa';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 relative overflow-hidden bg-gradient-to-br from-blue-950 via-gray-950 to-indigo-950">
      {/* Glassmorphism Card */}
      <div className="relative z-10 p-10 rounded-2xl bg-white/20 dark:bg-black/30 backdrop-blur-[6px] border border-white/30 shadow-2xl flex flex-col items-center max-w-xl mx-auto">
        <FaCarSide className="text-4xl text-blue-400 mb-2 drop-shadow" />
        <h1 className="text-3xl sm:text-4xl font-semibold text-center mb-2 tracking-wide">
          <span className="text-gray-900 dark:text-white">Welcome to</span>
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-bold">
            RevUpChat!
          </span>
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full my-3 opacity-60" />
        <p className="text-base sm:text-lg text-blue-100 dark:text-blue-200 text-center mb-8 font-light">
          I&apos;m your car shopping assistant. Discover your perfect vehicle with personalized recommendations.
        </p>
        <a
          href="/chat"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold text-lg shadow-lg hover:scale-105 transition-transform border border-blue-400/40 hover:border-blue-300/70"
        >
          Start Chatting
        </a>
      </div>
    </main>
  );
}