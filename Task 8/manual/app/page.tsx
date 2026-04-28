import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Welcome to Auth App</h1>
        <div className="flex gap-4">
          <Link href="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition">Sign Up</Link>
          <Link href="/login" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition">Log In</Link>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-500">
              © 2026 🔐 SecureAuth Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}