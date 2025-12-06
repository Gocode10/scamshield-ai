import React, { useState } from 'react'
import api from '../utils/api'

export default function TextPage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
  const resp = await api.post('/check/text', { text })
      setResult(resp.data)
    } catch (err) {
      setResult({ error: err.message })
    } finally { setLoading(false) }
  }

  return (
    <section>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <div className="mb-2 font-medium text-gray-700">Paste the message to analyze</div>
          <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-indigo-600" rows={6} placeholder="Paste message text here..." />
          <div className="text-sm text-gray-400 mt-1">Tip: include the full message (links, sender text) for better analysis.</div>
        </label>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md shadow hover:scale-[1.01] transition" disabled={loading}>{loading ? 'Checking…' : 'Check'}</button>
          <button type="button" onClick={() => { setText(''); setResult(null); }} className="px-4 py-2 border rounded-md text-gray-600">Clear</button>
        </div>
      </form>

      {loading && <div className="mt-4 text-sm text-gray-500">Analyzing…</div>}

      {result && (
        <div className="mt-6 p-4 rounded-lg shadow-md bg-white border">
          {result.error ? (
            <div className="text-red-600">{result.error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Score</div>
                <div className="text-lg font-semibold">{result.score}</div>
              </div>

              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full`} style={{ width: `${Math.min(100, result.score)}%`, background: 'linear-gradient(90deg,#ef4444,#f97316,#10b981)' }} />
              </div>

              <div className="flex items-center gap-3">
                <div className="px-2 py-1 text-sm bg-gray-100 rounded">Category</div>
                <div className="font-medium">{result.category}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Explanation</div>
                <div className="mt-1 text-gray-700">{result.explanation}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
