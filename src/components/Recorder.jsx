import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

/**
 * Rekoda ya sauti / video kwenye kivinjari (MediaRecorder).
 * Kwa video, kamera hufunguliwa kwanza ili mtumiaji ajione kabla ya kurekodi.
 * onChange({ url, blob }) hupigwa wakati rekodi ipo, au null ikifutwa.
 */
export default function Recorder({ mode = 'audio', onChange }) {
  const [status, setStatus] = useState('idle') // idle | ready | recording | recorded | denied | unsupported
  const [url, setUrl] = useState(null)
  const [seconds, setSeconds] = useState(0)

  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const previewRef = useRef(null)
  const timerRef = useRef(null)

  const supported =
    typeof window !== 'undefined' &&
    navigator.mediaDevices?.getUserMedia &&
    window.MediaRecorder

  useEffect(() => {
    if (!supported) setStatus('unsupported')
    return () => stopTracks()
  }, []) // eslint-disable-line

  // Keep the <video> preview wired to the live camera stream whenever it is on screen.
  useEffect(() => {
    if (mode !== 'video' || (status !== 'ready' && status !== 'recording')) return
    const v = previewRef.current
    if (v && streamRef.current && v.srcObject !== streamRef.current) {
      v.srcObject = streamRef.current
      v.muted = true
      v.play().catch(() => {})
    }
  }, [mode, status])

  function stopTracks() {
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  async function getStream() {
    return navigator.mediaDevices.getUserMedia(
      mode === 'video'
        ? { audio: true, video: { facingMode: 'user', width: { ideal: 1280 } } }
        : { audio: true },
    )
  }

  // Video: open the camera first so the person can frame themselves.
  async function openCamera() {
    try {
      streamRef.current = await getStream()
      setStatus('ready')
    } catch {
      setStatus('denied')
    }
  }

  function beginRecording() {
    const stream = streamRef.current
    if (!stream) return
    chunksRef.current = []
    const rec = new MediaRecorder(stream)
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mode === 'video' ? 'video/webm' : 'audio/webm',
      })
      const u = URL.createObjectURL(blob)
      setUrl(u)
      setStatus('recorded')
      onChange?.({ url: u, blob })
      stopTracks()
    }
    rec.start()
    recorderRef.current = rec
    setSeconds(0)
    setStatus('recording')
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
  }

  // Audio: one tap = open mic + record.
  async function startAudio() {
    try {
      streamRef.current = await getStream()
      beginRecording()
    } catch {
      setStatus('denied')
    }
  }

  function stop() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
    clearInterval(timerRef.current)
  }

  function reset() {
    if (url) URL.revokeObjectURL(url)
    stopTracks()
    setUrl(null)
    setSeconds(0)
    setStatus('idle')
    onChange?.(null)
  }

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60,
  ).padStart(2, '0')}`

  if (status === 'unsupported') {
    return (
      <p className="border border-ink/12 bg-parchment px-4 py-3 text-sm text-ink/60">
        Kivinjari chako hakiruhusu kurekodi. Tumia chaguo la "Pakia faili" au "Weka kiungo".
      </p>
    )
  }

  const showLivePreview =
    mode === 'video' && (status === 'ready' || status === 'recording')

  return (
    <div className="border border-ink/20 bg-white/70 p-4">
      {showLivePreview && (
        <div className="relative mb-3 overflow-hidden bg-ink/90">
          <video
            ref={previewRef}
            className="aspect-video w-full -scale-x-100 object-cover"
            playsInline
            muted
          />
          {status === 'recording' && (
            <span className="absolute left-3 top-3 flex items-center gap-1.5 bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              REC {clock}
            </span>
          )}
        </div>
      )}

      {mode === 'video' && status === 'recorded' && (
        <div className="mb-3 overflow-hidden bg-ink/90">
          <video src={url} controls className="aspect-video w-full object-cover" />
        </div>
      )}

      {mode === 'audio' && status === 'recorded' && (
        <audio src={url} controls className="mb-3 w-full" />
      )}

      <div className="flex flex-wrap items-center gap-3">
        {status === 'idle' && (
          <button
            type="button"
            onClick={mode === 'video' ? openCamera : startAudio}
            className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream"
          >
            <Icon name={mode === 'video' ? 'play' : 'phone'} className="h-3.5 w-3.5" />
            {mode === 'video' ? 'Fungua kamera' : 'Anza kurekodi sauti'}
          </button>
        )}

        {status === 'ready' && (
          <>
            <button
              type="button"
              onClick={beginRecording}
              className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Anza kurekodi
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50 underline hover:text-ink"
            >
              Ghairi
            </button>
          </>
        )}

        {status === 'recording' && (
          <>
            <button
              type="button"
              onClick={stop}
              className="inline-flex items-center gap-2 border border-ink bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink"
            >
              <span className="h-2.5 w-2.5 bg-ink" />
              Simamisha
            </button>
            {mode === 'audio' && (
              <span className="flex items-center gap-2 text-sm font-medium text-ink/70">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                {clock}
              </span>
            )}
          </>
        )}

        {status === 'recorded' && (
          <>
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700">
              <Icon name="heart" className="h-4 w-4" />
              Rekodi tayari
            </span>
            <button
              type="button"
              onClick={reset}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50 underline hover:text-ink"
            >
              Rekodi tena
            </button>
          </>
        )}

        {status === 'denied' && (
          <span className="text-sm text-ink/60">
            Ruhusu matumizi ya {mode === 'video' ? 'kamera na kipaza sauti' : 'kipaza sauti'} kisha jaribu tena.
            <button type="button" onClick={() => setStatus('idle')} className="ml-2 underline">
              Jaribu tena
            </button>
          </span>
        )}
      </div>
    </div>
  )
}
