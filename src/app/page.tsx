import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to ImpGrowth Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Your analytics and growth tracking platform
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/profile" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/secret" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
