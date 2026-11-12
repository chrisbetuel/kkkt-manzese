import { useParams } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, BackLink, Badge } from '../components/ui.jsx'
import { Embed, LinkOut } from '../components/Media.jsx'
import Icon from '../components/Icon.jsx'
import { useApi } from '../lib/api.js'
import { useLang, useMeta } from '../lib/prefs.jsx'
import { fmtDate, waShare } from '../lib/format.js'

export default function SermonDetail() {
  const { slug } = useParams()
  const { t } = useLang()
  const { data: s, loading, error } = useApi(`/sermons/${slug}`)
  useMeta(s?.title, s?.summary)

  if (loading) return <Section tint="white"><Loading rows={2} /></Section>
  if (error || !s)
    return (
      <Section tint="white">
        <Empty icon="book" title={t('Hubiri halikupatikana', 'Sermon not found')} action={<BackLink to="/mahubiri">{t('Mahubiri yote', 'All sermons')}</BackLink>} />
      </Section>
    )

  return (
    <>
      <PageIntro crumbs={[t('Mahubiri', 'Sermons'), s.title]} eyebrow={s.series || t('Hubiri', 'Sermon')} title={s.title}>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-soft">
          {s.preacher && <Badge tone="navy"><Icon name="user" className="h-3.5 w-3.5" />{s.preacher}</Badge>}
          {s.date && <Badge tone="navy"><Icon name="calendar" className="h-3.5 w-3.5" />{fmtDate(s.date)}</Badge>}
          {s.scripture && <Badge><Icon name="book" className="h-3.5 w-3.5" />{s.scripture}</Badge>}
          {s.topic && <Badge>{s.topic}</Badge>}
        </div>
      </PageIntro>
      <Section tint="white" className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {(s.youtubeId || s.link) && <Embed link={s.link || `https://youtu.be/${s.youtubeId}`} title={s.title} />}
            {s.audioUrl && (
              /\.(mp3|m4a|ogg|wav|aac)(\?|$)/i.test(s.audioUrl)
                ? <audio src={s.audioUrl} controls preload="none" className="w-full" />
                : <LinkOut url={s.audioUrl} label={t('Sikiliza sauti', 'Listen to audio')} />
            )}
            {s.docUrl && <LinkOut url={s.docUrl} label={t('Pakua maandishi', 'Download notes')} />}
            {s.summary && <p className="text-[16px] leading-relaxed text-ink/80">{s.summary}</p>}
            {s.transcript && (
              <details className="rounded-2xl border border-line bg-cream p-5">
                <summary className="cursor-pointer text-sm font-bold">{t('Maandishi kamili ya hubiri', 'Full transcript')}</summary>
                <div className="prose-church mt-4 whitespace-pre-line text-[15px]">{s.transcript}</div>
              </details>
            )}
          </div>
          <aside className="space-y-3">
            <a href={waShare(s.title, window.location.href)} target="_blank" rel="noreferrer" className="btn-navy w-full">
              <Icon name="whatsapp" className="h-4 w-4" /> {t('Shiriki kwa WhatsApp', 'Share on WhatsApp')}
            </a>
            <BackLink to="/mahubiri">{t('Mahubiri yote', 'All sermons')}</BackLink>
          </aside>
        </div>
      </Section>
    </>
  )
}
