import { Link } from 'react-router-dom'
import { Section } from '../components/Section.jsx'
import { PageIntro, Loading, Empty, Badge } from '../components/ui.jsx'
import { Embed, Poster } from '../components/Media.jsx'
import Icon from '../components/Icon.jsx'
import { useApi } from '../lib/api.js'
import { useLang, useMeta } from '../lib/prefs.jsx'
import { useSite } from '../content.jsx'
import { fmtDate } from '../lib/format.js'

/** Tazama Ibada: mubashara (kama upo kweli), ibada zijazo na rekodi za ibada zilizopita. */
export default function Live() {
  const { t } = useLang()
  const { services } = useSite()
  const { data, loading } = useApi('/live')
  useMeta(t('Tazama Ibada Mubashara', 'Watch Live'))

  return (
    <>
      <PageIntro
        crumbs={[t('Ibada', 'Worship'), t('Tazama', 'Watch')]}
        eyebrow={t('Ibada Mtandaoni', 'Online Worship')}
        title={t('Abudu pamoja nasi popote ulipo', 'Worship with us wherever you are')}
        intro={t(
          'Ibada zinaporushwa mubashara, utaziona hapa moja kwa moja. Unaweza pia kutazama rekodi za ibada zilizopita.',
          'When a service is streaming, it appears here. You can also watch recordings of past services.',
        )}
      />

      <Section tint="white" className="!pt-0">
        {loading ? (
          <Loading rows={1} />
        ) : data?.isLive ? (
          <div className="overflow-hidden rounded-3xl border border-line bg-ink p-3 shadow-card sm:p-4">
            <div className="mb-3 flex flex-wrap items-center gap-3 px-1">
              <Badge tone="red">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                {t('HEWANI SASA', 'LIVE NOW')}
              </Badge>
              <span className="text-sm font-semibold text-white">{data.title || t('Ibada', 'Service')}</span>
            </div>
            <Embed link={data.liveUrl} title={data.title || 'Ibada'} />
            {!/youtu/.test(data.liveUrl) && (
              <a href={data.liveUrl} target="_blank" rel="noreferrer" className="btn-gold mt-3 w-full">
                {t('Fungua ibada mubashara', 'Open the live stream')}
                <Icon name="external" className="h-4 w-4" />
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-4 rounded-3xl border border-line bg-parchment p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Icon name="live" className="h-5 w-5 text-gold-700" />
                {t('Hakuna ibada inayorushwa sasa hivi', 'No service is streaming right now')}
              </p>
              <p className="mt-2 text-sm text-soft">
                {data?.nextService
                  ? `${t('Ibada ijayo mubashara', 'Next live service')}: ${data.nextService}`
                  : t('Tazama ratiba ya ibada hapa chini au rekodi za ibada zilizopita.', 'See the service times below or past recordings.')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {data?.youtubeChannel && (
                <a href={data.youtubeChannel} target="_blank" rel="noreferrer" className="btn-primary">
                  <Icon name="youtube" className="h-4 w-4" /> YouTube
                </a>
              )}
              {data?.facebookPage && (
                <a href={data.facebookPage} target="_blank" rel="noreferrer" className="btn-navy">
                  <Icon name="facebook" className="h-4 w-4" /> Facebook
                </a>
              )}
            </div>
          </div>
        )}

        {services.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-extrabold">{t('Ratiba ya ibada', 'Service times')}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                  <Icon name="clock" className="h-5 w-5 text-gold-600" />
                  <span>
                    <span className="block text-sm font-bold">{s.name}</span>
                    <span className="block text-[13px] text-soft">{[s.day, s.time].filter(Boolean).join(' · ')}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section tint="cream">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-extrabold">{t('Ibada na mahubiri yaliyopita', 'Past services & sermons')}</h2>
          <Link to="/mahubiri" className="inline-flex items-center gap-1.5 text-sm font-bold hover:text-gold-700">
            {t('Maktaba ya mahubiri', 'Sermon library')} <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        {data?.recordings?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.recordings.map((s) => (
              <Link key={s.slug} to={`/mahubiri/${s.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card">
                <div className="relative aspect-video bg-navy-950">
                  <Poster thumb={s.thumbnail} link={s.link} />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/35">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink">
                      <Icon name="play" className="h-5 w-5" />
                    </span>
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[12px] text-soft">{[fmtDate(s.date), s.preacher].filter(Boolean).join(' · ')}</p>
                  <h3 className="mt-1 text-[15px] font-bold leading-snug">{s.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !loading && <Empty icon="play" title={t('Bado hakuna rekodi', 'No recordings yet')} text={t('Rekodi za ibada zikiwekwa zitaonekana hapa.', 'Service recordings will appear here once published.')} />
        )}
      </Section>
    </>
  )
}
