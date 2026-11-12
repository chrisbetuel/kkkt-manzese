import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, BackLink, Badge } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { apiFetch, useApi } from '../lib/api.js'
import { useAuth, useLang, useMeta } from '../lib/prefs.jsx'
import { fmtDate, waShare } from '../lib/format.js'

/** Kadi ya aya ya leo (inatumika pia ukurasa wa mwanzo). Haionyeshi chochote kama ofisi haijaweka neno. */
export function VerseCard({ d, compact = false }) {
  const { t, lang } = useLang()
  if (!d) return null
  return (
    <figure className="relative overflow-hidden rounded-3xl bg-navy-950 p-6 text-white shadow-card sm:p-8">
      <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold-500/20 blur-2xl" />
      <p className="relative text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">
        {d.isToday === false ? fmtDate(d.date, { lang }) : t('Neno la Leo', 'Today’s Word')}
      </p>
      <blockquote className={`relative mt-3 font-semibold leading-snug text-white ${compact ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
        “{d.verseText}”
      </blockquote>
      <figcaption className="relative mt-3 text-sm font-bold text-gold-300">— {d.verseReference}</figcaption>
      {compact && (
        <Link to={`/neno-la-leo/${d.date}`} className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-gold-300">
          {t('Soma tafakari', 'Read the reflection')} <Icon name="arrow" className="h-4 w-4" />
        </Link>
      )}
    </figure>
  )
}

export default function Devotions() {
  const { date } = useParams()
  const { t, lang } = useLang()
  const { data: d, loading } = useApi(date ? `/devotions/${date}` : '/devotions/today')
  const { data: list } = useApi('/devotions')
  useMeta(d?.title ? `${d.title} — ${t('Neno la Leo', 'Daily Devotion')}` : t('Neno la Leo', 'Daily Devotion'))

  return (
    <>
      <PageIntro crumbs={[t('Mafundisho', 'Teaching'), t('Neno la Leo', 'Daily Devotion')]} eyebrow={t('Ibada ya kila siku', 'Daily devotion')} title={d?.title || t('Neno la Leo', 'Daily Devotion')} />
      <Section tint="white" className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {loading ? (
              <Loading rows={1} />
            ) : !d ? (
              <Empty icon="sun" title={t('Neno la leo halijawekwa bado', 'Today’s devotion has not been posted yet')} text={t('Tafadhali rudi baadaye.', 'Please check back later.')} />
            ) : (
              <article>
                <VerseCard d={d} />
                {d.passage && <p className="mt-6 text-sm font-semibold text-gold-700">{t('Somo', 'Reading')}: {d.passage}</p>}
                {d.reflection && <div className="prose-church mt-4 text-[16px]" dangerouslySetInnerHTML={{ __html: d.reflection }} />}
                {d.prayer && (
                  <div className="mt-6 rounded-2xl border border-line bg-parchment p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-700">{t('Sala', 'Prayer')}</p>
                    <p className="mt-2 whitespace-pre-line text-[15.5px] leading-relaxed">{d.prayer}</p>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-soft">
                  {d.author && <span>{t('Imeandikwa na', 'Written by')} {d.author}</span>}
                  <a href={waShare(`${d.title}\n“${d.verseText}” — ${d.verseReference}`, `${window.location.origin}/neno-la-leo/${d.date}`)} target="_blank" rel="noreferrer" className="btn-navy !py-2">
                    <Icon name="whatsapp" className="h-4 w-4" /> {t('Shiriki', 'Share')}
                  </a>
                </div>
              </article>
            )}
          </div>
          <aside>
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-soft">{t('Siku zilizopita', 'Previous days')}</h2>
            <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
              {(list || []).slice(0, 14).map((x) => (
                <li key={x.date}>
                  <Link to={`/neno-la-leo/${x.date}`} className={`block px-4 py-3 hover:bg-cream ${x.date === d?.date ? 'bg-parchment' : ''}`}>
                    <span className="block text-[12px] text-soft">{fmtDate(x.date, { lang })}</span>
                    <span className="block text-sm font-semibold">{x.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/mipango-ya-kusoma" className="btn-navy mt-4 w-full">
              <Icon name="book" className="h-4 w-4" /> {t('Mipango ya kusoma Biblia', 'Bible reading plans')}
            </Link>
          </aside>
        </div>
      </Section>
    </>
  )
}

export function ReadingPlans() {
  const { t } = useLang()
  const { data, loading } = useApi('/reading-plans')
  useMeta(t('Mipango ya Kusoma Biblia', 'Bible Reading Plans'))
  return (
    <>
      <PageIntro crumbs={[t('Mafundisho', 'Teaching'), t('Mipango ya Kusoma', 'Reading Plans')]} eyebrow={t('Soma Biblia', 'Read the Bible')} title={t('Mipango ya kusoma Biblia', 'Bible reading plans')}
        intro={t('Chagua mpango, soma kila siku na — ukiingia kwenye akaunti yako — fuatilia maendeleo yako.', 'Choose a plan, read daily and — when signed in — track your progress.')} />
      <Section tint="white" className="!pt-0">
        {loading ? <Loading /> : !data?.length ? (
          <Empty icon="book" title={t('Bado hakuna mpango uliochapishwa', 'No plans published yet')} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <Link key={p.slug} to={`/mipango-ya-kusoma/${p.slug}`} className="card group">
                <Badge>{t(`Siku ${p.days}`, `${p.days} days`)}</Badge>
                <h2 className="mt-3 text-lg font-bold group-hover:text-gold-700">{p.title}</h2>
                {p.description && <p className="mt-1 text-sm text-soft">{p.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}

export function ReadingPlanDetail() {
  const { slug } = useParams()
  const { t } = useLang()
  const { user } = useAuth()
  const { data: plan, loading } = useApi(`/reading-plans/${slug}`)
  const { data: progress } = useApi(`/me/reading-plans/${slug}`, { enabled: !!user })
  const [done, setDone] = useState(new Set())
  useMeta(plan?.title)

  useEffect(() => {
    setDone(new Set((progress || []).map((p) => p.dayId)))
  }, [progress])

  async function toggle(id) {
    const r = await apiFetch(`/me/reading-days/${id}`, { method: 'POST' })
    setDone((s) => {
      const n = new Set(s)
      r.completed ? n.add(id) : n.delete(id)
      return n
    })
  }

  if (loading) return <Section tint="white"><Loading rows={1} /></Section>
  if (!plan) return <Section tint="white"><Empty icon="book" title={t('Mpango haukupatikana', 'Plan not found')} action={<BackLink to="/mipango-ya-kusoma" />} /></Section>
  const pct = plan.days.length ? Math.round((done.size / plan.days.length) * 100) : 0

  return (
    <>
      <PageIntro crumbs={[t('Mipango ya Kusoma', 'Reading Plans'), plan.title]} eyebrow={t('Mpango wa kusoma', 'Reading plan')} title={plan.title} intro={plan.description} />
      <Section tint="white" className="!pt-0">
        {user ? (
          <div className="mb-6 rounded-2xl border border-line bg-cream p-4">
            <div className="flex items-center justify-between text-sm font-semibold"><span>{t('Maendeleo yako', 'Your progress')}</span><span>{pct}%</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${pct}%` }} /></div>
          </div>
        ) : (
          <p className="mb-6 rounded-2xl border border-line bg-parchment p-4 text-sm">
            <Link to="/akaunti" className="font-bold underline">{t('Ingia', 'Sign in')}</Link> {t('ili kuweka alama kwenye masomo uliyomaliza na kufuatilia maendeleo.', 'to mark readings as done and track your progress.')}
          </p>
        )}
        <ol className="divide-y divide-line rounded-2xl border border-line bg-white">
          {plan.days.map((d) => (
            <li key={d.id} className="flex items-center gap-4 px-4 py-3">
              {user ? (
                <button type="button" onClick={() => toggle(d.id)} aria-pressed={done.has(d.id)} aria-label={t('Weka alama — nimemaliza', 'Mark as read')}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done.has(d.id) ? 'bg-emerald-600 text-white' : 'border border-line text-soft'}`}>
                  <Icon name={done.has(d.id) ? 'check' : 'circle'} className="h-4 w-4" />
                </button>
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-parchment text-xs font-bold text-gold-800">{d.day}</span>
              )}
              <span className="min-w-0">
                <span className="block text-[12px] text-soft">{t(`Siku ${d.day}`, `Day ${d.day}`)}</span>
                <span className={`block font-semibold ${done.has(d.id) ? 'text-soft line-through' : ''}`}>{d.passages}</span>
                {d.note && <span className="block text-[13px] text-soft">{d.note}</span>}
              </span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
