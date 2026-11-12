import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, Badge } from '../components/ui.jsx'
import { Poster } from '../components/Media.jsx'
import Icon from '../components/Icon.jsx'
import { useApi } from '../lib/api.js'
import { useLang, useMeta } from '../lib/prefs.jsx'
import { fmtDate } from '../lib/format.js'

const TYPE_ICON = { video: 'play', audio: 'audio', text: 'file' }

/** Maktaba ya mahubiri: utafutaji, vichujio (mhubiri, mada, kundi, mfululizo) na kurasa. */
export default function Sermons() {
  const { t } = useLang()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  useMeta(t('Mahubiri', 'Sermons'), t('Sikiliza, tazama na soma mahubiri ya KKKT Manzese.', 'Listen to, watch and read sermons from KKKT Manzese.'))

  // utafutaji husubiri mtu amalize kuandika
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(params)
      q ? next.set('q', q) : next.delete('q')
      next.delete('page')
      if (next.toString() !== params.toString()) setParams(next, { replace: true })
    }, 350)
    return () => clearTimeout(id)
  }, [q]) // eslint-disable-line react-hooks/exhaustive-deps

  const { data: filters } = useApi('/sermons/filters')
  const { data, loading } = useApi(`/sermons?${params.toString()}`)
  const set = (k, v) => {
    const next = new URLSearchParams(params)
    v ? next.set(k, v) : next.delete(k)
    next.delete('page')
    setParams(next)
  }
  const page = Number(params.get('page') || 1)
  const active = ['preacher', 'topic', 'category', 'series', 'type'].some((k) => params.get(k)) || params.get('q')

  const select = (key, label, options) =>
    options?.length > 0 && (
      <label className="block">
        <span className="sr-only">{label}</span>
        <select
          value={params.get(key) || ''}
          onChange={(e) => set(key, e.target.value)}
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink"
        >
          <option value="">{label}</option>
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      </label>
    )

  return (
    <>
      <PageIntro
        crumbs={[t('Mafundisho', 'Teaching'), t('Mahubiri', 'Sermons')]}
        eyebrow={t('Maktaba ya Mahubiri', 'Sermon Library')}
        title={t('Neno la Mungu kwa kila siku', 'God’s Word for every day')}
        intro={t('Tafuta kwa kichwa, andiko, mhubiri au mada.', 'Search by title, Bible passage, preacher or topic.')}
      />
      <Section tint="white" className="!pt-0">
        <div className="grid gap-3 rounded-2xl border border-line bg-cream p-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <label className="relative block sm:col-span-2 lg:col-span-1">
            <span className="sr-only">{t('Tafuta', 'Search')}</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('Tafuta mahubiri, mf. "neema" au "Yohana 3"', 'Search, e.g. "grace" or "John 3"')}
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm"
            />
          </label>
          {select('preacher', t('Mhubiri yeyote', 'Any preacher'), filters?.preachers)}
          {select('topic', t('Mada yoyote', 'Any topic'), filters?.topics)}
          {select('category', t('Kundi lolote', 'Any category'), filters?.categories?.map((c) => ({ value: c.key, label: c.label })))}
          {select('type', t('Aina yoyote', 'Any format'), [
            { value: 'video', label: 'Video' },
            { value: 'audio', label: t('Sauti', 'Audio') },
            { value: 'text', label: t('Maandishi', 'Text') },
          ])}
        </div>
        {active && (
          <button type="button" onClick={() => { setQ(''); setParams({}) }} className="mt-3 text-sm font-semibold text-gold-700 hover:underline">
            {t('Ondoa vichujio', 'Clear filters')}
          </button>
        )}

        <div className="mt-8">
          {loading ? (
            <Loading rows={6} />
          ) : !data?.data?.length ? (
            <Empty icon="book" title={t('Hakuna mahubiri yaliyopatikana', 'No sermons found')} text={active ? t('Jaribu maneno mengine au ondoa vichujio.', 'Try other words or clear the filters.') : t('Mahubiri yakichapishwa yataonekana hapa.', 'Sermons will appear here once published.')} />
          ) : (
            <>
              <p className="mb-4 text-sm text-soft">{t(`Mahubiri ${data.meta.total}`, `${data.meta.total} sermons`)}</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.data.map((s) => (
                  <SermonCard key={s.slug} s={s} />
                ))}
              </div>
              {data.meta.lastPage > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-3" aria-label={t('Kurasa', 'Pages')}>
                  <button type="button" disabled={page <= 1} onClick={() => set('page', String(page - 1))} className="btn-navy !py-2 disabled:opacity-40">
                    <Icon name="back" className="h-4 w-4" /> {t('Nyuma', 'Previous')}
                  </button>
                  <span className="text-sm text-soft">{page} / {data.meta.lastPage}</span>
                  <button type="button" disabled={page >= data.meta.lastPage} onClick={() => set('page', String(page + 1))} className="btn-navy !py-2 disabled:opacity-40">
                    {t('Mbele', 'Next')} <Icon name="next" className="h-4 w-4" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </Section>
    </>
  )
}

export function SermonCard({ s }) {
  const { t } = useLang()
  return (
    <Link to={`/mahubiri/${s.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card">
      <div className="relative aspect-video bg-gradient-to-br from-navy-900 to-navy-950">
        <Poster thumb={s.thumbnail} link={s.link} />
        {!s.thumbnail && !s.youtubeId && (
          <span className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm font-semibold text-white/80">{s.scripture || s.title}</span>
        )}
        <span className="absolute left-3 top-3">
          <Badge tone="navy">
            <Icon name={TYPE_ICON[s.type] || 'play'} className="h-3.5 w-3.5" />
            {s.type === 'audio' ? t('Sauti', 'Audio') : s.type === 'text' ? t('Maandishi', 'Text') : 'Video'}
          </Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[12px] text-soft">{[fmtDate(s.date), s.preacher].filter(Boolean).join(' · ')}</p>
        <h3 className="mt-1 text-[15px] font-bold leading-snug group-hover:text-gold-700">{s.title}</h3>
        {s.scripture && <p className="mt-1 text-[13px] font-medium text-gold-700">{s.scripture}</p>}
        {s.summary && <p className="mt-2 line-clamp-2 text-sm text-soft">{s.summary}</p>}
      </div>
    </Link>
  )
}
