import React, { useState, useRef } from 'react'
import api from '../utils/api'
import Recorder from '../components/Recorder'

export default function AudioPage() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  async function uploadFile(file) {
    const fd = new FormData()
    fd.append('file', file)
    setLoading(true)
    try {
      const resp = await api.post('/check/audio', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(resp.data)
    } catch (err) {
      setResult({ error: err.message })
    } finally { setLoading(false) }
  }

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2 font-medium text-gray-700">Record audio</div>
          <div className="p-3 border rounded-lg bg-white shadow-sm">
            <Recorder onRecorded={uploadFile} />
          </div>
        </div>

        <div>
          <div className="mb-2 font-medium text-gray-700">Or upload audio (mp3/wav)</div>
          <div className="p-3 border rounded-lg bg-white shadow-sm flex items-center gap-3">
      
            <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={e => { const f = e.target.files && e.target.files[0]; if (f) { setSelectedFile(f); } }} />
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md shadow">Choose file</button>
              <button type="button" onClick={() => { if(fileInputRef.current) fileInputRef.current.value=''; setSelectedFile(null); }} className="px-3 py-2 border rounded-md text-gray-600">Clear</button>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-sm text-gray-400">Max 2 minutes recommended</div>
              <button disabled={!selectedFile} onClick={() => selectedFile && uploadFile(selectedFile)} className={`px-4 py-2 rounded-md font-medium ${selectedFile ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>Upload</button>
            </div>
          </div>
          {selectedFile && <div className="mt-2 text-sm text-gray-700">Selected: <span className="font-medium">{selectedFile.name}</span></div>}
        </div>
      </div>

      {loading && <div className="mt-4">Transcribing & analyzing…</div>}

      {result && (
        <div className="mt-4 p-4 border rounded bg-white">
          {result.error ? (
            <div className="text-red-600">{result.error}</div>
          ) : (
            <div>
              <div><strong>Transcript:</strong> {result.transcript}</div>
              <div><strong>Score:</strong> {result.score}</div>
              <div><strong>Category:</strong> {result.category}</div>
              <div><strong>Explanation:</strong> {result.explanation}</div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
