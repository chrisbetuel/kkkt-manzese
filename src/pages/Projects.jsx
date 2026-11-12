import { Link, useParams } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, BackLink, Badge } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { useApi } from '../lib/api.js'
import { useLang, useMeta } from '../lib/prefs.jsx'
import { fmtDate, money } from '../lib/format.js'

function Progress({ value, label }) {
  return (
    <div>
      <div className="flex justify-between text-[12.5px] font-semibold text-soft"><span>{label}</span><span>{value}%</span></div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream"><div className="h-full rounded-full bg-gold-500" style={{ width: `${Math.min(100, value)}%` }} /></div>
    </div>
  )
}

export default function Projects() {
  const { t } = useLang()
  const { data, loading } = useApi('/projects')
  useMeta(t('Miradi ya Maendeleo', 'Church Projects'))
  return (
    <>
      <PageIntro crumbs={[t('Miradi', 'Projects')]} eyebrow={t('Maendeleo ya Usharika', 'Church Development')}
        title={t('Miradi ya maendeleo ya kanisa', 'Church development projects')}
        intro={t('Taarifa za maendeleo ya miradi kwa uwazi. Taarifa za fedha huonyeshwa pale uongozi ulipoidhinisha.', 'Transparent progress updates. Financial figures are shown where church leadership has approved them.')} />
      <Section tint="white" className="!pt-0">
        {loading ? <Loading /> : !data?.length ? (
          <Empty icon="building" title={t('Hakuna miradi iliyochapishwa bado', 'No projects published yet')} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <Link key={p.slug} to={`/miradi/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card">
                <div className="aspect-[16/10] bg-parchment">{p.cover && <img src={p.cover} alt="" loading="lazy" className="h-full w-full object-cover" />}</div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <Badge tone="navy">{p.statusLabel}</Badge>
                  <h2 className="text-lg font-bold group-hover:text-gold-700">{p.title}</h2>
                  {p.summary && <p className="text-sm text-soft">{p.summary}</p>}
                  <Progress value={p.progress} label={t('Hatua zilizokamilika', 'Milestones completed')} />
                  {p.financials?.target > 0 && (
                    <Progress value={Math.round((p.financials.received / p.financials.target) * 100)} label={`${money(p.financials.received)} / ${money(p.financials.target)}`} />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}

export function ProjectDetail() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const { data: p, loading, error } = useApi(`/projects/${slug}`)
  useMeta(p?.title, p?.summary)

  if (loading) return <Section tint="white"><Loading rows={1} /></Section>
  if (error || !p) return <Section tint="white"><Empty icon="building" title={t('Mradi haukupatikana', 'Project not found')} action={<BackLink to="/miradi" />} /></Section>

  return (
    <>
      <PageIntro crumbs={[t('Miradi', 'Projects'), p.title]} eyebrow={p.statusLabel} title={p.title} intro={p.summary} />
      <Section tint="white" className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {p.cover && <img src={p.cover} alt="" className="mb-6 aspect-[16/9] w-full rounded-3xl object-cover" />}
            {p.description && <div className="prose-church text-[16px]" dangerouslySetInnerHTML={{ __html: p.description }} />}
            {p.objectives && (
              <>
                <h2 className="mt-8 text-xl font-extrabold">{t('Malengo', 'Objectives')}</h2>
                <p className="mt-2 whitespace-pre-line text-[15.5px] leading-relaxed">{p.objectives}</p>
              </>
            )}
            {p.photos?.length > 0 && (
              <>
                <h2 className="mt-8 text-xl font-extrabold">{t('Picha za maendeleo', 'Progress photos')}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {p.photos.map((src) => <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />)}
                </div>
              </>
            )}
          </div>
          <aside className="space-y-5">
            <div className="space-y-4 rounded-3xl border border-line bg-cream p-5">
              <Progress value={p.progress} label={t('Hatua zilizokamilika', 'Milestones completed')} />
              {p.financials && (
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {p.financials.target != null && <div><dt className="text-soft">{t('Lengo', 'Target')}</dt><dd className="font-bold">{money(p.financials.target)}</dd></div>}
                  <div><dt className="text-soft">{t('Zimepokelewa', 'Received')}</dt><dd className="font-bold">{money(p.financials.received)}</dd></div>
                  <div><dt className="text-soft">{t('Matumizi', 'Spent')}</dt><dd className="font-bold">{money(p.financials.spent)}</dd></div>
                </dl>
              )}
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {p.manager && <div><dt className="text-soft">{t('Msimamizi', 'Manager')}</dt><dd className="font-semibold">{p.manager}</dd></div>}
                {p.startsOn && <div><dt className="text-soft">{t('Ulianza', 'Started')}</dt><dd className="font-semibold">{fmtDate(p.startsOn, { lang })}</dd></div>}
                {p.expectedCompletion && <div><dt className="text-soft">{t('Kukamilika', 'Completion')}</dt><dd className="font-semibold">{fmtDate(p.expectedCompletion, { lang })}</dd></div>}
              </dl>
              <Link to="/michango" className="btn-primary w-full"><Icon name="hand" className="h-4 w-4" />{t('Changia', 'Contribute')}</Link>
            </div>
            {p.milestones?.length > 0 && (
              <ol className="space-y-2">
                {p.milestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl border border-line bg-white px-3 py-2.5">
                    <Icon name={m.completedOn ? 'done' : 'circle'} className={`mt-0.5 h-5 w-5 shrink-0 ${m.completedOn ? 'text-emerald-600' : 'text-soft'}`} />
                    <span>
                      <span className="block text-sm font-semibold">{m.title}</span>
                      <span className="block text-[12px] text-soft">{m.completedOn ? `${t('Imekamilika', 'Completed')} ${fmtDate(m.completedOn, { lang })}` : m.dueOn ? `${t('Inatarajiwa', 'Due')} ${fmtDate(m.dueOn, { lang })}` : ''}</span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <BackLink to="/miradi">{t('Miradi yote', 'All projects')}</BackLink>
          </aside>
        </div>
      </Section>
    </>
  )
}
