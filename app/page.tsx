export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">RevUpChat</h1>
      <p className="text-xl text-gray-600">AI Car Shopping Assistant</p>
      <a href="/chat" className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Start Chatting
      </a>
    </main>
  );
}