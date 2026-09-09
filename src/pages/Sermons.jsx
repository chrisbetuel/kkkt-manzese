import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

function MediaPlayer({ sermon }) {
  if (sermon.youtubeId) {
    return (
      <div className="aspect-video overflow-hidden rounded-xl">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${sermon.youtubeId}`}
          title={sermon.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  if (sermon.audioUrl) {
    return <audio controls src={sermon.audioUrl} className="w-full" />
  }
  return (
    <p className="rounded-xl bg-parchment px-4 py-3 text-sm text-navy-600">
      Rekodi ya sauti/video itapatikana hapa mara itakapopakiwa na timu ya media.
    </p>
  )
}

function SermonCard({ sermon }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="card flex flex-col">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-100 text-gold-700">
        <Icon name="play" className="h-5 w-5" />
      </span>
      <p className="mt-4 text-xs uppercase tracking-widest text-gold-700">
        {sermon.series}
      </p>
      <h3 className="mt-1 text-lg font-semibold">{sermon.title}</h3>
      <p className="mt-1 text-sm text-navy-500">
        {sermon.preacher} · {sermon.scripture}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
        {sermon.summary}
      </p>

      {open && (
        <div className="mt-4">
          <MediaPlayer sermon={sermon} />
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-gold-700 hover:text-gold-800"
      >
        {open ? 'Ficha' : 'Sikiliza / Tazama'}
        <Icon name={open ? 'arrow' : 'play'} className={`h-4 w-4 ${open ? 'rotate-90' : ''}`} />
      </button>
    </article>
  )
}

export default function Sermons() {
  const { sermons } = useSite()
  const [featured, ...rest] = sermons
  return (
    <>
      <PageHeader
        crumbs={['Mahubiri']}
        eyebrow="Habari na Mahubiri"
        title="Neno la Mungu, popote ulipo"
        subtitle="Sikiliza, tazama na soma mahubiri."
        image="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1600&q=75"
      />

      <Section tint="cream">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Hubiri la Hivi Karibuni" title={featured.title} />
          <Link to="/mahubiri/pakia" className="btn-navy mb-12">
            <Icon name="arrow" className="h-4 w-4 -rotate-90" />
            Pakia Hubiri
          </Link>
        </div>
        <div className="grid gap-8 rounded-3xl bg-navy-950 p-8 text-cream md:grid-cols-[1fr_1.2fr] md:p-12">
          <div className="self-center">
            {featured.youtubeId || featured.audioUrl ? (
              <MediaPlayer sermon={featured} />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-white/5">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-navy-950">
                  <Icon name="play" className="h-8 w-8" />
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-gold-400">
              {featured.series}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-white">{featured.title}</h3>
            <p className="mt-1 text-navy-300">
              {featured.preacher} · {featured.date}
            </p>
            <p className="mt-4 rounded-lg bg-white/5 px-4 py-2 font-display text-lg text-gold-200">
              {featured.scripture}
            </p>
            <p className="mt-4 leading-relaxed text-navy-200">{featured.summary}</p>
          </div>
        </div>
      </Section>

      <Section tint="white">
        <SectionTitle eyebrow="Kumbukumbu" title="Mahubiri mengine" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.concat(sermons).slice(0, 6).map((s, i) => (
            <SermonCard key={i} sermon={s} />
          ))}
        </div>
      </Section>

      <section className="bg-navy-950 py-16 text-cream">
        <div className="container-x flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">Wewe ni wa timu ya media?</h2>
            <p className="mt-2 text-navy-200">
              Pakia mahubiri mapya ya sauti, video au maandishi kwa waumini wote.
            </p>
          </div>
          <Link to="/mahubiri/pakia" className="btn-primary shrink-0">
            Pakia Hubiri
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
