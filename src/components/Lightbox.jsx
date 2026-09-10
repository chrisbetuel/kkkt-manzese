import { useEffect } from 'react'
import Icon from './Icon.jsx'

/** Full-screen image viewer. Pass `src` to open, `onClose` to dismiss. */
export default function Lightbox({ src, alt = '', caption = '', onClose }) {
  useEffect(() => {
    if (!src) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20"
        onClick={onClose}
        aria-label="Funga"
      >
        <Icon name="x" className="h-5 w-5" />
      </button>
      <figure className="max-h-[88vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="mx-auto max-h-[80vh] w-auto object-contain" />
        {caption && (
          <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.14em] text-navy-300">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  )
}
