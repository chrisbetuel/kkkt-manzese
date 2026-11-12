import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { Section, SectionTitle } from './Section.jsx'
import { Badge } from './ui.jsx'
import { VerseCard } from '../pages/Devotions.jsx'
import { SermonCard } from '../pages/Sermons.jsx'
import { useApi } from '../lib/api.js'
import { useLang } from '../lib/prefs.jsx'
import { useSite } from '../content.jsx'

/** Tazama Ibada + Neno la Leo (aya huonyeshwa tu kama ofisi imeweka — haibuniwi). */
export function LiveAndWord() {
  const { t } = useLang()
  const { data: live } = useApi('/live')
  const { data: verse } = useApi('/devotions/today')
  const hasVerse = verse && verse.verseText

  return (
    <section className="bg-white pb-6 pt-2">
      <div className={`container-x grid gap-4 ${hasVerse ? 'lg:grid-cols-[1fr_1.3fr]' : ''}`}>
        <Link
          to="/tazama"
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-parchment to-white p-6 shadow-soft sm:p-8"
        >
          <div className="flex items-center gap-2">
            {live?.isLive ? (
              <Badge tone="red"><span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />{t('HEWANI SASA', 'LIVE NOW')}</Badge>
            ) : (
              <Badge tone="navy"><Icon name="live" className="h-3.5 w-3.5" />{t('Ibada mtandaoni', 'Online worship')}</Badge>
            )}
          </div>
          <div className="mt-5">
            <h2 className="text-2xl font-extrabold leading-tight sm:text-[1.9rem]">
              {live?.isLive ? live.title || t('Ibada inaendelea sasa', 'A service is streaming now') : t('Tazama ibada popote ulipo', 'Watch services wherever you are')}
            </h2>
            <p className="mt-2 text-sm text-soft">
              {live?.isLive
                ? t('Jiunge nasi mubashara sasa hivi.', 'Join us live right now.')
                : live?.nextService
                  ? `${t('Ibada ijayo mubashara', 'Next live service')}: ${live.nextService}`
                  : t('Rekodi za ibada na mahubiri zinapatikana wakati wowote.', 'Service recordings and sermons are available any time.')}
            </p>
          </div>
          <span className="btn-primary mt-6 self-start">
            <Icon name="play" className="h-4 w-4" />
            {t('Tazama Ibada', 'Watch Live')}
          </span>
        </Link>
        {hasVerse && <VerseCard d={verse} compact />}
      </div>
    </section>
  )
}

/** Neno la ukaribisho la uongozi (kutoka Mipangilio — ofisi huhariri). */
export function Welcome() {
  const { t } = useLang()
  const { pastorWelcome } = useSite()
  if (!pastorWelcome?.message) return null
  return (
    <Section tint="white" className="!py-12 sm:!py-16">
      <figure className="mx-auto grid max-w-4xl gap-6 rounded-3xl border border-line bg-cream p-6 sm:grid-cols-[auto_1fr] sm:p-10">
        <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-navy-950 text-gold-300">
          {pastorWelcome.photo ? <img src={pastorWelcome.photo} alt="" className="h-full w-full object-cover" /> : <Icon name="church" className="h-8 w-8" />}
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-700">{t('Neno la Ukaribisho', 'A word of welcome')}</p>
          <blockquote className="mt-3 text-[17px] leading-relaxed text-ink/85">{pastorWelcome.message}</blockquote>
          {(pastorWelcome.name || pastorWelcome.title) && (
            <figcaption className="mt-4 text-sm">
              <span className="font-bold">{pastorWelcome.name}</span>
              {pastorWelcome.title && <span className="block text-soft">{pastorWelcome.title}</span>}
            </figcaption>
          )}
        </div>
      </figure>
    </Section>
  )
}

export function LatestSermons() {
  const { t } = useLang()
  const { data } = useApi('/sermons?per_page=6')
  const items = (data?.data || []).slice(0, 3)
  if (!items.length) return null
  return (
    <Section tint="white">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow={t('Mafundisho', 'Teaching')} title={t('Mahubiri ya hivi karibuni', 'Latest sermons')} />
        <Link to="/mahubiri" className="-mt-8 inline-flex items-center gap-1.5 text-sm font-bold hover:text-gold-700 sm:mt-0">
          {t('Mahubiri yote', 'All sermons')} <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => <SermonCard key={s.slug} s={s} />)}
      </div>
    </Section>
  )
}

export function MinistriesStrip() {
  const { t } = useLang()
  const { departments } = useSite()
  if (!departments.length) return null
  return (
    <Section tint="cream">
      <SectionTitle eyebrow={t('Huduma', 'Ministries')} title={t('Kuna nafasi yako ya kuhudumu', 'There is a place for you to serve')} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {departments.slice(0, 8).map((d) => (
          <Link key={d.slug} to={`/idara/${d.slug}`} className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-card">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-gold-300"><Icon name={d.icon || 'hands'} className="h-5 w-5" /></span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-bold">{d.name}</span>
              {d.meets && <span className="block truncate text-[12px] text-soft">{d.meets}</span>}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6"><Link to="/idara" className="btn-navy">{t('Huduma zote', 'All ministries')} <Icon name="arrow" className="h-4 w-4" /></Link></div>
    </Section>
  )
}

export function CareAndVisit() {
  const { t } = useLang()
  return (
    <Section tint="white">
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/maombi" className="group rounded-3xl bg-navy-950 p-7 text-white shadow-card sm:p-9">
          <Icon name="hands" className="h-8 w-8 text-gold-300" />
          <h2 className="mt-4 text-2xl font-extrabold text-white">{t('Tunaomba pamoja nawe', 'We pray with you')}</h2>
          <p className="mt-2 text-sm text-white/70">{t('Tuma ombi la maombi, omba ushauri wa kichungaji au kutembelewa — kwa faragha.', 'Send a prayer request, ask for pastoral counsel or a visit — in confidence.')}</p>
          <span className="btn-gold mt-6">{t('Omba Maombi', 'Request prayer')}</span>
        </Link>
        <Link to="/karibu" className="group rounded-3xl border border-line bg-parchment p-7 shadow-soft sm:p-9">
          <Icon name="userPlus" className="h-8 w-8 text-gold-700" />
          <h2 className="mt-4 text-2xl font-extrabold">{t('Mgeni? Karibu!', 'New here? Welcome!')}</h2>
          <p className="mt-2 text-sm text-soft">{t('Jaza kadi fupi ya mgeni ili tukufahamu, au jisajili kama mshirika.', 'Fill a short visitor card so we can get to know you, or register as a member.')}</p>
          <span className="btn-primary mt-6">{t('Kadi ya mgeni', 'Visitor card')}</span>
        </Link>
      </div>
    </Section>
  )
}

export function FindUs() {
  const { t } = useLang()
  const { church, services } = useSite()
  const sunday = services.filter((s) => s.day === 'Jumapili')
  return (
    <Section tint="cream">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionTitle eyebrow={t('Tutembelee', 'Visit us')} title={t('Mahali tulipo', 'Where to find us')} />
          <ul className="space-y-3 text-[15px]">
            {church.address && <li className="flex gap-3"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />{church.address}</li>}
            {sunday.map((s, i) => (
              <li key={i} className="flex gap-3"><Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />{[s.name, s.time].filter(Boolean).join(' — ')}</li>
            ))}
            {church.phone && <li className="flex gap-3"><Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" /><a href={`tel:${church.phone.replace(/\s/g, '')}`} className="hover:underline">{church.phone}</a></li>}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {church.mapLink && <a href={church.mapLink} target="_blank" rel="noreferrer" className="btn-primary"><Icon name="map" className="h-4 w-4" />{t('Pata maelekezo', 'Get directions')}</a>}
            <Link to="/wasiliana" className="btn-navy">{t('Wasiliana nasi', 'Contact us')}</Link>
          </div>
        </div>
        {church.mapEmbed && (
          <iframe
            title={t('Ramani ya kanisa', 'Church map')}
            src={church.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full rounded-3xl border border-line sm:h-96"
          />
        )}
      </div>
    </Section>
  )
}
