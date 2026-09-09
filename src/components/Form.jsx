import { useState } from 'react'
import Icon from './Icon.jsx'

const inputBase =
  'w-full rounded-xl border border-navy-200 bg-cream px-4 py-3 text-navy-900 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-200 placeholder:text-navy-400'

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy-800">
      {children} {required && <span className="text-gold-600">*</span>}
    </label>
  )
}

export function Field({ label, name, type = 'text', required, hint, ...props }) {
  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <input id={name} name={name} type={type} required={required} className={inputBase} {...props} />
      {hint && <p className="mt-1 text-xs text-navy-500">{hint}</p>}
    </div>
  )
}

export function TextArea({ label, name, required, rows = 4, hint, ...props }) {
  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <textarea id={name} name={name} required={required} rows={rows} className={inputBase} {...props} />
      {hint && <p className="mt-1 text-xs text-navy-500">{hint}</p>}
    </div>
  )
}

export function Select({ label, name, required, options = [], hint, placeholder = 'Chagua...' }) {
  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <select id={name} name={name} required={required} defaultValue="" className={inputBase}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => {
          const value = typeof o === 'string' ? o : o.value
          const text = typeof o === 'string' ? o : o.label
          return (
            <option key={value} value={value}>
              {text}
            </option>
          )
        })}
      </select>
      {hint && <p className="mt-1 text-xs text-navy-500">{hint}</p>}
    </div>
  )
}

export function RadioCards({ label, name, options = [], required, defaultValue = '', onChange }) {
  const [selected, setSelected] = useState(defaultValue)
  const pick = (value) => {
    setSelected(value)
    onChange?.(value)
  }
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-navy-800">
        {label} {required && <span className="text-gold-600">*</span>}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const value = typeof o === 'string' ? o : o.value
          const title = typeof o === 'string' ? o : o.label
          const desc = typeof o === 'string' ? null : o.desc
          const active = selected === value
          return (
            <label
              key={value}
              className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                active
                  ? 'border-gold-400 bg-gold-50 ring-2 ring-gold-200'
                  : 'border-navy-200 bg-cream hover:border-gold-300'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={value}
                required={required}
                checked={active}
                onChange={() => pick(value)}
                className="mt-1 accent-gold-600"
              />
              <span>
                <span className="block text-sm font-semibold text-navy-900">{title}</span>
                {desc && <span className="mt-0.5 block text-xs text-navy-500">{desc}</span>}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function CheckboxList({ label, name, options = [] }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-navy-800">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o}
            className="flex items-center gap-2.5 rounded-lg border border-navy-200 bg-cream px-3 py-2.5 text-sm text-navy-800"
          >
            <input type="checkbox" name={name} value={o} className="accent-gold-600" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function FileInput({ label, name, accept, hint, required }) {
  const [fileName, setFileName] = useState('')
  return (
    <div>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <label
        htmlFor={name}
        className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-navy-300 bg-cream px-4 py-4 text-sm text-navy-600 transition-colors hover:border-gold-400"
      >
        <Icon name="arrow" className="h-5 w-5 -rotate-90 text-gold-600" />
        {fileName || 'Bofya kuchagua faili'}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        required={required}
        className="sr-only"
        onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
      />
      {hint && <p className="mt-1 text-xs text-navy-500">{hint}</p>}
    </div>
  )
}

/**
 * Kifuniko cha fomu: hushughulikia hali ya "imewasilishwa".
 * Hakuna backend bado — badilisha `onSubmit` kuunganisha na Formspree/EmailJS/API.
 */
export function FormPanel({
  children,
  onSubmit,
  submitLabel = 'Wasilisha',
  successTitle = 'Asante!',
  successText = 'Taarifa yako imepokelewa. Tutawasiliana nawe hivi karibuni.',
  note,
}) {
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    // collect multi-value fields (checkbox groups) too
    for (const key of new Set([...new FormData(form).keys()])) {
      const all = new FormData(form).getAll(key)
      if (all.length > 1) data[key] = all
    }
    try {
      setBusy(true)
      await onSubmit?.(data)
      setDone(true)
    } catch {
      setError('Imeshindikana kutuma. Tafadhali jaribu tena.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-gold-200 bg-white px-6 py-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-700">
          <Icon name="heart" className="h-8 w-8" />
        </span>
        <h3 className="mt-4 text-xl font-semibold">{successTitle}</h3>
        <p className="mt-2 max-w-md text-navy-600">{successText}</p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 text-sm font-semibold text-gold-700 hover:text-gold-800"
        >
          Jaza fomu nyingine
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-navy-100 bg-white p-6 md:p-8"
    >
      {children}
      {note && (
        <p className="flex items-start gap-2 text-xs leading-relaxed text-navy-500">
          <Icon name="shield" className="h-4 w-4 shrink-0 text-gold-600" />
          {note}
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
        {busy ? 'Inatuma…' : submitLabel}
      </button>
    </form>
  )
}
