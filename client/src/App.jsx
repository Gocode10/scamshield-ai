import React, { useState } from 'react'
import TextPage from './pages/TextPage'
import AudioPage from './pages/AudioPage'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [page, setPage] = useState('text')

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 via-purple-600 to-teal-400 flex items-center justify-center text-white font-bold">SS</div>
            <div>
              <h1 className="text-2xl font-semibold">ScamShield AI</h1>
              <p className="text-sm text-gray-500">Real-time scam detection for text & voice</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-3">
            <button onClick={() => setPage('text')} className={`px-4 py-2 rounded-md font-medium ${page==='text' ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow' : 'text-blue-600 border border-blue-100'}`}>Text</button>
            <button onClick={() => setPage('audio')} className={`px-4 py-2 rounded-md font-medium ${page==='audio' ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow' : 'text-gray-700 border border-gray-100'}`}>Audio</button>
            <button onClick={() => setPage('dashboard')} className={`px-4 py-2 rounded-md font-medium ${page==='dashboard' ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow' : 'text-gray-700 border border-gray-100'}`}>Dashboard</button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 gap-6">
            <div className="glass-card p-6 rounded-lg shadow">
              {page === 'text' && <TextPage />}
              {page === 'audio' && <AudioPage />}
              {page === 'dashboard' && <Dashboard />}
            </div>
          </div>
        </main>

        <footer className="mt-6 text-center text-sm text-gray-400">© {new Date().getFullYear()} ScamShield — Stay vigilant!</footer>
      </div>
    </div>
  )
}
