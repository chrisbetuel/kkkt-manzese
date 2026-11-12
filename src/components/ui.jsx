import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import PageHeader from './PageHeader.jsx'
import { useLang } from '../lib/prefs.jsx'

/** Kichwa cha ukurasa: njia (crumbs) + eyebrow + kichwa + utangulizi. */
export function PageIntro({ crumbs = [], eyebrow, title, intro, children }) {
  return (
    <>
      <PageHeader crumbs={crumbs} />
      <section className="bg-white">
        <div className="container-x pb-8 pt-10 sm:pt-14">
          {eyebrow && (
            <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-700">
              <span className="h-[2px] w-7 rounded-full bg-gold-500" />
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-3xl text-[clamp(1.9rem,4.6vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">{title}</h1>
          {intro && <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-soft">{intro}</p>}
          {children}
        </div>
      </section>
    </>
  )
}

export function Loading({ rows = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-cream" />
      ))}
    </div>
  )
}

export function Empty({ icon = 'calendar', title, text, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-parchment text-gold-700">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="mt-4 text-base font-bold text-ink">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-soft">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorNote({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
      {children}
    </p>
  )
}

export function SuccessNote({ children }) {
  if (!children) return null
  return (
    <p role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

/** Sehemu ya fomu inayodhibitiwa (controlled). */
export function Input({ label, hint, error, className = '', as = 'input', children, ...props }) {
  const Tag = as
  const id = props.id || props.name
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">
        {label}
        {props.required && <span className="text-gold-700"> *</span>}
      </span>
      <Tag
        id={id}
        {...props}
        aria-invalid={!!error || undefined}
        className={`w-full rounded-xl border bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-soft/60 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 ${
          error ? 'border-red-400' : 'border-line'
        } ${as === 'textarea' ? 'min-h-[110px]' : ''}`}
      >
        {children}
      </Tag>
      {error ? <span className="mt-1 block text-[12.5px] text-red-700">{error}</span> : hint && <span className="mt-1 block text-[12px] text-soft">{hint}</span>}
    </label>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto pb-1" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          className={`mx-1 shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
            value === t.value ? 'bg-ink text-white' : 'border border-line bg-white text-ink/75 hover:text-ink'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** Kiungo "rudi" kidogo. */
export function BackLink({ to, children }) {
  const { t } = useLang()
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70 hover:text-ink">
      <Icon name="back" className="h-4 w-4" />
      {children || t('Rudi', 'Back')}
    </Link>
  )
}

export function Badge({ children, tone = 'gold' }) {
  const tones = {
    gold: 'bg-parchment text-gold-800',
    navy: 'bg-navy-50 text-navy-800',
    red: 'bg-red-50 text-red-700',
    green: 'bg-emerald-50 text-emerald-700',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${tones[tone]}`}>{children}</span>
}
