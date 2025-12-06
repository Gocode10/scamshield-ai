import React, { useEffect, useRef, useState } from 'react'

export default function Recorder({ onRecorded, maxSeconds = 60 }) {
  const [recording, setRecording] = useState(false)
  const [mediaSupported, setMediaSupported] = useState(true)
  const [blobUrl, setBlobUrl] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const recorderRef = useRef(null)
  const timerRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)

  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) setMediaSupported(false)
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [])

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s + 1 >= maxSeconds) stopRecording()
          return s + 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [recording])

  async function startRecording() {
    // revoke previous blob so the new recording is used
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      setBlobUrl(null)
    }
    chunksRef.current = []
    setSeconds(0)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      recorderRef.current = new MediaRecorder(stream)

      recorderRef.current.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data)
      }

      recorderRef.current.onstop = () => {
        const localChunks = chunksRef.current
        if (!localChunks.length) return
        const blob = new Blob(localChunks, { type: localChunks[0].type || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setBlobUrl(url)
        const ext = (blob.type.split('/')[1] || 'webm').split(';')[0]
        const file = new File([blob], `recording.${ext}`, { type: blob.type })
        if (onRecorded) onRecorded(file)

        // stop all tracks
        try {
          streamRef.current && streamRef.current.getTracks().forEach(t => t.stop())
        } catch (e) {  }
      }

      recorderRef.current.start()
      setRecording(true)
    } catch (e) {
      console.error('microphone error', e)
      setMediaSupported(false)
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop()
    setRecording(false)
  }

  return (
    <div className="p-3 border rounded bg-white">
      {!mediaSupported && <div className="text-red-600">Recording not supported or permission denied.</div>}
      <div className="flex items-center gap-3">
        <button onClick={() => recording ? stopRecording() : startRecording()} className={`px-3 py-2 rounded ${recording ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
          {recording ? 'Stop' : 'Record'}
        </button>
        <div className="text-sm">{seconds}s</div>
        {blobUrl && <audio controls src={blobUrl} className="ml-4" />}
      </div>
    </div>
  )
}
