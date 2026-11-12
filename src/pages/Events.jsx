import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, Tabs, Badge } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { useApi } from '../lib/api.js'
import { useLang, useMeta } from '../lib/prefs.jsx'
import { fmtDate, fmtTime, monthName } from '../lib/format.js'
import { fallbackPhotos } from '../lib/photos.js'

const pad = (n) => String(n).padStart(2, '0')

/** Matukio: orodha ya yajayo, kalenda ya mwezi, na yaliyopita. */
export default function Events() {
  const { t, lang } = useLang()
  const [view, setView] = useState('list')
  const [tag, setTag] = useState('')
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  useMeta(t('Matukio na Kalenda', 'Events & Calendar'))

  const path =
    view === 'calendar' ? `/events?month=${cursor.y}-${pad(cursor.m + 1)}` : view === 'past' ? '/events?past=1' : '/events'
  const { data, loading } = useApi(path)
  const events = useMemo(() => (data || []).filter((e) => !tag || e.tag === tag), [data, tag])
  const tags = useMemo(() => [...new Set((data || []).map((e) => e.tag).filter(Boolean))], [data])
  const photos = fallbackPhotos(events)

  return (
    <>
      <PageIntro
        crumbs={[t('Matukio', 'Events')]}
        eyebrow={t('Matukio', 'Events')}
        title={t('Matukio na kalenda ya usharika', 'Church events & calendar')}
        intro={t('Ibada maalum, semina, mikutano na sherehe. Jisajili pale inapohitajika na uongeze kwenye kalenda yako.', 'Special services, seminars, meetings and celebrations. Register where needed and add to your calendar.')}
      />
      <Section tint="white" className="!pt-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={view}
            onChange={setView}
            tabs={[
              { value: 'list', label: t('Yajayo', 'Upcoming') },
              { value: 'calendar', label: t('Kalenda', 'Calendar') },
              { value: 'past', label: t('Yaliyopita', 'Past') },
            ]}
          />
          {tags.length > 1 && (
            <select value={tag} onChange={(e) => setTag(e.target.value)} className="rounded-xl border border-line bg-white px-3 py-2 text-sm" aria-label={t('Aina ya tukio', 'Event type')}>
              <option value="">{t('Aina zote', 'All types')}</option>
              {tags.map((x) => <option key={x}>{x}</option>)}
            </select>
          )}
        </div>

        {view === 'calendar' && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-cream px-3 py-2">
            <button type="button" className="rounded-full p-2 hover:bg-white" aria-label={t('Mwezi uliopita', 'Previous month')}
              onClick={() => setCursor(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))}>
              <Icon name="back" className="h-5 w-5" />
            </button>
            <span className="text-base font-bold">{monthName(cursor.m, lang)} {cursor.y}</span>
            <button type="button" className="rounded-full p-2 hover:bg-white" aria-label={t('Mwezi ujao', 'Next month')}
              onClick={() => setCursor(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}>
              <Icon name="next" className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <Loading rows={3} />
          ) : view === 'calendar' ? (
            <MonthGrid y={cursor.y} m={cursor.m} events={events} />
          ) : events.length === 0 ? (
            <Empty title={t('Hakuna matukio kwa sasa', 'No events right now')} text={t('Matukio mapya yakitangazwa yataonekana hapa.', 'New events will appear here when announced.')} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <EventCard key={e.slug || e.title} e={e} photo={e.image || photos[i]} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  )
}

export function EventCard({ e, photo }) {
  const { t, lang } = useLang()
  const when = e.startsAt ? `${fmtDate(e.startsAt, { lang })} · ${fmtTime(e.startsAt)}` : [e.dateLabel, e.timeLabel].filter(Boolean).join(' · ')
  return (
    <Link to={`/matukio/${e.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-parchment">
        {photo && <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
        {e.tag && <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">{e.tag}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {when && (
          <p className="flex items-center gap-1.5 text-[12.5px] text-soft">
            <Icon name="calendar" className="h-3.5 w-3.5 text-gold-600" />
            {when}
          </p>
        )}
        <h3 className="mt-1.5 text-[15.5px] font-bold leading-snug group-hover:text-gold-700">{e.title}</h3>
        {e.location && (
          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-soft">
            <Icon name="pin" className="h-3.5 w-3.5 text-gold-600" />
            {e.location}
          </p>
        )}
        {e.requiresRegistration && (
          <span className="mt-3">
            <Badge tone={e.isFull ? 'red' : 'green'}>{e.isFull ? t('Nafasi zimejaa', 'Full') : t('Usajili uko wazi', 'Registration open')}</Badge>
          </span>
        )}
      </div>
    </Link>
  )
}

function MonthGrid({ y, m, events }) {
  const { t } = useLang()
  const first = new Date(y, m, 1)
  const days = new Date(y, m + 1, 0).getDate()
  const offset = first.getDay() // Jumapili = 0
  const byDay = {}
  for (const e of events) {
    if (!e.startsAt) continue
    const d = new Date(e.startsAt)
    if (d.getFullYear() === y && d.getMonth() === m) (byDay[d.getDate()] ||= []).push(e)
  }
  const today = new Date()
  // Jumapili, Jumatatu, Jumanne, Jumatano, Alhamisi, Ijumaa, Jumamosi
  const heads = t('Jpl Jtt Jnn Jtn Alh Iju Jmm', 'Sun Mon Tue Wed Thu Fri Sat').split(' ')

  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wide text-soft" aria-hidden>
        {heads.map((h) => <div key={h} className="py-2">{h}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1
          const list = byDay[day] || []
          const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === day
          return (
            <div key={day} className={`min-h-[64px] rounded-xl border p-1.5 text-left sm:min-h-[96px] ${isToday ? 'border-gold-500 bg-parchment' : 'border-line bg-white'}`}>
              <span className={`text-[12px] font-bold ${isToday ? 'text-gold-800' : 'text-ink/70'}`}>{day}</span>
              <div className="mt-1 space-y-1">
                {list.map((e) => (
                  <Link key={e.slug} to={`/matukio/${e.slug}`} className="block truncate rounded-md bg-ink px-1.5 py-0.5 text-[10.5px] font-semibold text-white sm:text-[11.5px]" title={e.title}>
                    <span className="hidden sm:inline">{fmtTime(e.startsAt)} </span>{e.title}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {events.filter((e) => !e.startsAt).length > 0 && (
        <p className="mt-4 text-sm text-soft">{t('Matukio ya kujirudia (bila tarehe maalum) yako kwenye orodha ya "Yajayo".', 'Recurring events (without a fixed date) are in the "Upcoming" list.')}</p>
      )}
    </>
  )
}
