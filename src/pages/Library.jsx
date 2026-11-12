import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, BackLink, Badge, Tabs } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { apiUrl, useApi } from '../lib/api.js'
import { useAuth, useLang, useMeta } from '../lib/prefs.jsx'

// makundi ya "Elimu ya Kikristo"
const EDUCATION = ['new_believers', 'baptism', 'confirmation', 'marriage', 'youth', 'bible_study', 'leadership', 'christian_living', 'lutheran']

/** Maktaba ya kidijitali; /elimu huonyesha makundi ya elimu ya Kikristo. */
export default function Library() {
  const { t } = useLang()
  const education = useLocation().pathname.startsWith('/elimu')
  const [category, setCategory] = useState('')
  const [q, setQ] = useState('')
  const { data, loading } = useApi(`/library?${new URLSearchParams({ ...(category && { category }), ...(q && { q }) })}`)
  useMeta(education ? t('Elimu ya Kikristo', 'Christian Education') : t('Maktaba', 'Library'))

  const cats = (data?.categories || []).filter((c) => !education || EDUCATION.includes(c.key))
  const items = (data?.items || []).filter((i) => !education || EDUCATION.includes(i.category))

  return (
    <>
      <PageIntro
        crumbs={[education ? t('Elimu ya Kikristo', 'Christian Education') : t('Maktaba', 'Library')]}
        eyebrow={education ? t('Ufuasi', 'Discipleship') : t('Maktaba ya Kidijitali', 'Digital Library')}
        title={education ? t('Elimu ya Kikristo kwa kila hatua', 'Christian education for every stage') : t('Vitabu, nyaraka na mafunzo', 'Books, documents and study materials')}
        intro={t('Ni maudhui yaliyoidhinishwa na usharika na yenye ruhusa ya kuchapishwa pekee.', 'Only content approved by the parish and cleared for publication.')}
      />
      <Section tint="white" className="!pt-0">
        <div className="mb-6 space-y-3">
          <label className="relative block max-w-md">
            <span className="sr-only">{t('Tafuta', 'Search')}</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Tafuta kwenye maktaba', 'Search the library')}
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm" />
          </label>
          {cats.length > 0 && (
            <Tabs value={category} onChange={setCategory} tabs={[{ value: '', label: t('Yote', 'All') }, ...cats.map((c) => ({ value: c.key, label: c.label }))]} />
          )}
        </div>
        {loading ? <Loading rows={6} /> : !items.length ? (
          <Empty icon="library" title={t('Hakuna vipengele bado', 'Nothing here yet')} text={t('Nyaraka zilizoidhinishwa zikichapishwa zitaonekana hapa.', 'Approved materials will appear here once published.')} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((i) => <LibraryCard key={i.slug} i={i} />)}
          </div>
        )}
      </Section>
    </>
  )
}

function LibraryCard({ i }) {
  const { t } = useLang()
  return (
    <Link to={`/maktaba/${i.slug}`} className="card group flex gap-4">
      <span className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-parchment text-gold-700">
        {i.cover ? <img src={i.cover} alt="" className="h-full w-full object-cover" loading="lazy" /> : <Icon name="file" className="h-7 w-7" />}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap gap-1.5">
          <Badge tone="navy">{i.typeLabel}</Badge>
          {i.isOfficial && <Badge tone="green">{t('Rasmi', 'Official')}</Badge>}
          {i.membersOnly && <Badge><Icon name="lock" className="h-3 w-3" />{t('Washirika', 'Members')}</Badge>}
        </span>
        <span className="mt-2 block font-bold leading-snug group-hover:text-gold-700">{i.title}</span>
        {i.author && <span className="block text-[13px] text-soft">{i.author}</span>}
      </span>
    </Link>
  )
}

export function LibraryDetail() {
  const { slug } = useParams()
  const { t } = useLang()
  const { user } = useAuth()
  const { data: i, loading, error } = useApi(`/library/${slug}`)
  useMeta(i?.title, i?.description)

  if (loading) return <Section tint="white"><Loading rows={1} /></Section>
  if (error || !i) return <Section tint="white"><Empty icon="library" title={t('Haikupatikana', 'Not found')} action={<BackLink to="/maktaba" />} /></Section>

  const locked = i.membersOnly && !user
  return (
    <>
      <PageIntro crumbs={[t('Maktaba', 'Library'), i.title]} eyebrow={i.categoryLabel || i.typeLabel} title={i.title} intro={i.author} />
      <Section tint="white" className="!pt-0">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl bg-parchment text-gold-700">
            {i.cover ? <img src={i.cover} alt="" className="h-full w-full object-cover" /> : <Icon name="file" className="h-12 w-12" />}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {i.isOfficial && <Badge tone="green">{t('Fundisho rasmi la usharika', 'Official parish teaching')}</Badge>}
              {i.membersOnly && <Badge><Icon name="lock" className="h-3 w-3" />{t('Washirika pekee', 'Members only')}</Badge>}
            </div>
            {i.description && <p className="mt-4 whitespace-pre-line text-[16px] leading-relaxed">{i.description}</p>}
            <div className="mt-6 flex flex-wrap gap-3">
              {i.hasFile && (locked ? (
                <Link to="/akaunti" className="btn-primary"><Icon name="lock" className="h-4 w-4" />{t('Ingia kupakua', 'Sign in to download')}</Link>
              ) : (
                <a href={apiUrl(`/library/${i.slug}/download`)} className="btn-primary"><Icon name="download" className="h-4 w-4" />{t('Pakua', 'Download')}</a>
              ))}
              {i.externalUrl && <a href={i.externalUrl} target="_blank" rel="noreferrer" className="btn-navy"><Icon name="external" className="h-4 w-4" />{t('Fungua', 'Open')}</a>}
            </div>
            {i.copyrightNote && <p className="mt-6 text-[12.5px] text-soft">{i.copyrightNote}</p>}
            <div className="mt-6"><BackLink to="/maktaba">{t('Maktaba', 'Library')}</BackLink></div>
          </div>
        </div>
      </Section>
    </>
  )
}
