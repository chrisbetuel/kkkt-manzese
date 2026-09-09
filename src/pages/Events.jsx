import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

function EventCard({ e, index }) {
  return (
    <article className="group flex flex-col overflow-hidden border border-ink/12 bg-white/80 transition-all hover:border-gold-400 hover:shadow-[4px_4px_0_0_#b98f4c]">
      <div className="relative aspect-[16/10] overflow-hidden bg-parchment">
        {e.image ? (
          <img
            src={e.image}
            alt={e.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-5xl font-bold tabular-nums text-ink/10">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
        <span className="absolute left-0 top-0 bg-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream">
          {e.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug">{e.title}</h3>
        {e.text && <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/60">{e.text}</p>}
        <div className="mt-4 space-y-1.5 border-t border-ink/10 pt-3 text-xs uppercase tracking-wide text-ink/50">
          {(e.date || e.time) && (
            <p className="flex items-center gap-2">
              <Icon name="calendar" className="h-3.5 w-3.5 text-gold-600" />
              {[e.date, e.time].filter(Boolean).join(' · ')}
            </p>
          )}
          {e.location && (
            <p className="flex items-center gap-2">
              <Icon name="pin" className="h-3.5 w-3.5 text-gold-600" />
              {e.location}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Events() {
  const { events, announcements } = useSite()
  const [active, setActive] = useState('Zote')

  const tags = useMemo(
    () => ['Zote', ...Array.from(new Set(events.map((e) => e.tag)))],
    [events],
  )
  const list = active === 'Zote' ? events : events.filter((e) => e.tag === active)

  return (
    <>
      <PageHeader crumbs={['Matukio']} />

      {/* ---- Announcements ---- */}
      {announcements.length > 0 && (
        <Section tint="cream">
          <SectionTitle eyebrow="Matangazo" title="Yanayoendelea kanisani" />
          <div className="grid gap-5 md:grid-cols-3">
            {announcements.map((a) => (
              <article
                key={a.title}
                className="flex flex-col overflow-hidden border border-ink/12 bg-white/80"
              >
                {a.image && (
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                    {a.date}
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{a.title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-ink/60">{a.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ---- Calendar ---- */}
      <Section tint="white">
        <SectionTitle eyebrow="Kalenda" title="Chagua unachotaka kuona" />

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

        {list.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e, i) => (
              <EventCard key={e.title + i} e={e} index={i} />
            ))}
          </div>
        ) : (
          <p className="border border-ink/12 bg-white/70 p-6 text-sm text-ink/55">
            Hakuna matukio katika kundi hili kwa sasa.
          </p>
        )}
      </Section>
    </>
  )
}
