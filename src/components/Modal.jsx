import { useEffect } from 'react'
import Icon from './Icon.jsx'

/** Dirisha ibukizi (overlay). Pitisha `open` na `onClose`. */
export default function Modal({ open, onClose, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const max = size === 'lg' ? 'max-w-4xl' : size === 'sm' ? 'max-w-md' : 'max-w-2xl'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-navy-950/90 p-4 py-8 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative my-auto w-full ${max} border border-ink/15 bg-cream shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Funga"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-ink/10 text-ink/70 transition-colors hover:bg-ink/20 hover:text-ink"
        >
          <Icon name="x" className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}
