import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Embed, videoEmbed, platformOf } from '../components/Media.jsx'
import { useSite } from '../content.jsx'

const TYPE_LABEL = { video: 'Video', audio: 'Sauti', text: 'Maandishi' }
const TYPE_ICON = { video: 'play', audio: 'music', text: 'book' }

function Meta({ s }) {
  return (
    <p className="text-sm text-ink/55">
      {[s.preacher, s.scripture].filter(Boolean).join(' · ')}
      {s.date ? <span className="text-ink/40"> — {s.date}</span> : null}
    </p>
  )
}

function SermonCard({ s }) {
  const [open, setOpen] = useState(false)
  const embeddable = !!videoEmbed(s.link)
  const hasMedia = s.link || s.audioUrl || s.youtubeId

  return (
    <article className="flex flex-col border border-ink/12 bg-white">
      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-600">
          <Icon name={TYPE_ICON[s.type] || 'play'} className="h-3.5 w-3.5" />
          {s.series || TYPE_LABEL[s.type] || 'Hubiri'}
        </span>
        <h3 className="mt-2 text-lg font-semibold leading-snug">{s.title}</h3>
        <div className="mt-1">
          <Meta s={s} />
        </div>
        {s.summary && (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">{s.summary}</p>
        )}

        {open && hasMedia && (
          <div className="mt-4">
            <Embed link={s.link} mediaUrl={s.audioUrl} type={s.type} title={s.title} />
          </div>
        )}

        {hasMedia && (
          <div className="mt-4">
            {embeddable || s.audioUrl ? (
              <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 hover:text-gold-800"
              >
                {open ? 'Ficha' : 'Sikiliza / Tazama'}
                <Icon name={open ? 'x' : 'play'} className="h-3.5 w-3.5" />
              </button>
            ) : (
              <a
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 hover:text-gold-800"
              >
                Fungua kwenye {platformOf(s.link)}
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default function Sermons() {
  const { sermons } = useSite()
  const [featured, ...rest] = sermons
  const featuredEmbed = useMemo(() => videoEmbed(featured?.link || ''), [featured])

  return (
    <>
      <PageHeader crumbs={['Mahubiri']} />

      <Section tint="cream">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle
            eyebrow="Neno la Mungu"
            title="Mahubiri ya hivi karibuni"
            intro="Fuata viungo hapa chini kusikiliza au kutazama mahubiri kwenye YouTube, Facebook au mixlr."
          />
          <Link to="/mahubiri/pakia" className="btn-outline mb-10 shrink-0">
            <Icon name="arrow" className="h-4 w-4 -rotate-90" />
            Pakia Hubiri
          </Link>
        </div>

        {featured && (
          <article className="border border-ink/15 bg-white">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
              <div className="bg-parchment p-5 sm:p-7">
                {featuredEmbed || featured.audioUrl ? (
                  <Embed
                    link={featured.link}
                    mediaUrl={featured.audioUrl}
                    type={featured.type}
                    title={featured.title}
                  />
                ) : featured.link ? (
                  <a
                    href={featured.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex aspect-video flex-col items-center justify-center gap-3 border border-ink/15 bg-white text-center transition-colors hover:border-ink"
                  >
                    <span className="flex h-14 w-14 items-center justify-center bg-navy-950 text-gold-400">
                      <Icon name="play" className="h-7 w-7" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/70">
                      Fungua kwenye {platformOf(featured.link)}
                    </span>
                  </a>
                ) : (
                  <div className="flex aspect-video items-center justify-center border border-ink/12 bg-white text-xs uppercase tracking-wide text-ink/40">
                    Kiungo cha hubiri kitawekwa hapa
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                  <Icon name={TYPE_ICON[featured.type] || 'play'} className="h-3.5 w-3.5" />
                  {featured.series || 'Hubiri la hivi karibuni'}
                </span>
                <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-[1.75rem]">
                  {featured.title}
                </h2>
                <div className="mt-2">
                  <Meta s={featured} />
                </div>
                {featured.scripture && (
                  <p className="mt-4 border-l-2 border-gold-500 bg-cream px-4 py-2 font-display text-base text-ink/80">
                    {featured.scripture}
                  </p>
                )}
                {featured.summary && (
                  <p className="mt-4 text-sm leading-relaxed text-ink/65">{featured.summary}</p>
                )}
              </div>
            </div>
          </article>
        )}
      </Section>

      {rest.length > 0 && (
        <Section tint="white">
          <SectionTitle eyebrow="Kumbukumbu" title="Mahubiri mengine" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((s, i) => (
              <SermonCard key={i} s={s} />
            ))}
          </div>
        </Section>
      )}

      <section className="bg-navy-950 py-14 text-cream sm:py-16">
        <div className="container-x flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
              <span className="text-gold-500">✦</span> Timu ya Media
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              Una kiungo cha hubiri jipya?
            </h2>
            <p className="mt-1 text-sm text-cream/60">
              Wasilisha kiungo cha YouTube, Facebook au mixlr — hakuna faili linalopakiwa.
            </p>
          </div>
          <Link to="/mahubiri/pakia" className="btn-primary shrink-0">
            Wasilisha Kiungo
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
