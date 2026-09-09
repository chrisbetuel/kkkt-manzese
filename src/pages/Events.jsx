import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

export default function Events() {
  const { events, announcements } = useSite()
  const [active, setActive] = useState('Zote')

  const tags = useMemo(
    () => ['Zote', ...Array.from(new Set(events.map((e) => e.tag)))],
    [],
  )

  const list = active === 'Zote' ? events : events.filter((e) => e.tag === active)

  return (
    <>
      <PageHeader crumbs={['Matukio']} />

      {/* What's going on now */}
      <Section tint="cream">
        <SectionTitle eyebrow="Matangazo" title="Yanayoendelea kanisani" />
        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((a) => (
            <div key={a.title} className="border border-ink/12 bg-white/70 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                {a.date}
              </p>
              <h3 className="mt-1 text-base font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{a.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tint="white">
        <SectionTitle eyebrow="Kalenda" title="Chagua unachotaka kuona" />

        {/* Category selector */}
        <div className="mb-10 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                active === t
                  ? 'border-ink bg-ink text-cream'
                  : 'border-ink/25 bg-white/70 text-ink/70 hover:border-ink hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Ordered list */}
        <ol className="space-y-3">
          {list.map((e, i) => (
            <li
              key={e.title}
              className="grid gap-4 border border-ink/12 bg-white/70 p-5 transition-colors hover:border-gold-400 sm:grid-cols-[auto_1fr_auto] sm:items-center"
            >
              <span className="font-display text-sm font-bold tabular-nums text-gold-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                  {e.tag}
                </span>
                <h3 className="mt-0.5 text-lg font-semibold">{e.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{e.text}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink/45">
                  <Icon name="pin" className="h-3.5 w-3.5" /> {e.location}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold text-ink">{e.date}</p>
                <p className="text-xs text-ink/50">{e.time}</p>
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="border border-ink/12 bg-white/70 p-6 text-sm text-ink/55">
              Hakuna matukio katika kundi hili kwa sasa.
            </li>
          )}
        </ol>
      </Section>
    </>
  )
}
