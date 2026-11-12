import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, BackLink } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { useApi } from '../lib/api.js'
import { useLang, useMeta } from '../lib/prefs.jsx'
import { fmtDate, waShare } from '../lib/format.js'
import { fallbackPhotos } from '../lib/photos.js'

/** Habari na Matangazo (ya umma tu — matangazo ya vikundi huonekana kwenye akaunti za wanachama). */
export default function News() {
  const { t, lang } = useLang()
  const [page, setPage] = useState(1)
  const { data, loading } = useApi(`/announcements?page=${page}`)
  useMeta(t('Habari na Matangazo', 'News & Announcements'))
  const items = data?.data || []
  const photos = fallbackPhotos(items, { offset: 2 })

  return (
    <>
      <PageIntro crumbs={[t('Habari', 'News')]} eyebrow={t('Habari na Matangazo', 'News & Announcements')} title={t('Yanayoendelea kanisani', 'What’s happening at church')} />
      <Section tint="white" className="!pt-0">
        {loading ? (
          <Loading rows={6} />
        ) : !items.length ? (
          <Empty icon="news" title={t('Hakuna matangazo kwa sasa', 'No announcements right now')} />
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((a, i) => (
                <Link key={a.slug} to={`/habari/${a.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card">
                  <img src={a.image || photos[i]} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[12px] font-semibold text-gold-700">{a.date || fmtDate(a.publishedAt, { lang })}</p>
                    <h2 className="mt-1 text-base font-bold group-hover:text-gold-700">{a.title}</h2>
                    {a.body && <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-soft">{a.body}</p>}
                  </div>
                </Link>
              ))}
            </div>
            {data.meta.lastPage > 1 && (
              <div className="mt-10 flex justify-center gap-3">
                <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-navy !py-2 disabled:opacity-40">{t('Nyuma', 'Previous')}</button>
                <button type="button" disabled={page >= data.meta.lastPage} onClick={() => setPage(page + 1)} className="btn-navy !py-2 disabled:opacity-40">{t('Mbele', 'Next')}</button>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  )
}

export function NewsDetail() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const { data: a, loading, error } = useApi(`/announcements/${slug}`)
  useMeta(a?.title, a?.body)

  if (loading) return <Section tint="white"><Loading rows={1} /></Section>
  if (error || !a) return <Section tint="white"><Empty icon="news" title={t('Tangazo halikupatikana', 'Announcement not found')} action={<BackLink to="/habari" />} /></Section>

  return (
    <>
      <PageIntro crumbs={[t('Habari', 'News'), a.title]} eyebrow={a.date || fmtDate(a.publishedAt, { lang })} title={a.title} />
      <Section tint="white" className="!pt-0">
        <article className="mx-auto max-w-3xl">
          {a.image && <img src={a.image} alt="" className="mb-6 w-full rounded-3xl object-cover" />}
          <p className="whitespace-pre-line text-[16.5px] leading-relaxed text-ink/85">{a.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={waShare(a.title, window.location.href)} target="_blank" rel="noreferrer" className="btn-navy">
              <Icon name="whatsapp" className="h-4 w-4" /> {t('Shiriki', 'Share')}
            </a>
            <BackLink to="/habari">{t('Habari zote', 'All news')}</BackLink>
          </div>
        </article>
      </Section>
    </>
  )
}
