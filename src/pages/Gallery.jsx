import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { Embed } from '../components/Media.jsx'
import { useGallery } from '../content.jsx'

const MONTHS = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des']
const monthYear = (d) => {
  if (!d) return ''
  const [y, m] = d.split('-')
  return `${MONTHS[+m - 1] || ''} ${y}`.trim()
}

function Count({ icon, n, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">
      <Icon name={icon} className="h-3.5 w-3.5 text-gold-600" />
      {n} {label}
    </span>
  )
}

/** Kadi ya albamu kama folda: kichupo juu, picha ya jalada, jina na idadi. */
function AlbumCard({ a }) {
  return (
    <Link to={`/matunzio/${a.slug}`} className="group block">
      <span className="ml-5 block h-3 w-24 rounded-t-xl bg-gold-300 transition-colors group-hover:bg-gold-400" />
      <div className="overflow-hidden rounded-2xl rounded-tl-none border border-line bg-white shadow-soft transition-all group-hover:-translate-y-1 group-hover:shadow-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-parchment">
          {a.cover ? (
            <img
              src={a.cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center">
              <Icon name="gallery" className="h-12 w-12 text-gold-500/60" />
            </span>
          )}
          <span className="absolute bottom-3 left-3 flex gap-1.5">
            <Count icon="gallery" n={a.photos.length} label="Picha" />
            {a.videos.length > 0 && <Count icon="play" n={a.videos.length} label="Video" />}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-bold text-ink">{a.title}</span>
            {a.date && <span className="mt-0.5 block text-[12px] text-soft">{monthYear(a.date)}</span>}
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink/50 transition-colors group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink">
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function AlbumList({ albums, loading }) {
  const years = useMemo(
    () => [...new Set(albums.map((a) => a.date?.slice(0, 4)).filter(Boolean))].sort().reverse(),
    [albums],
  )
  const [year, setYear] = useState('Zote')
  const shown = year === 'Zote' ? albums : albums.filter((a) => a.date?.startsWith(year))

  return (
    <Section tint="cream">
      <SectionTitle
        eyebrow="Matunzio"
        title="Albamu za picha na video"
        intro="Chagua albamu kufungua picha na video za ibada, matukio na huduma za usharika."
      />

      {years.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {['Zote', ...years].map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors ${
                year === y ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/70 hover:border-gold-400'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <div key={n} className="aspect-[4/3] animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : shown.length ? (
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <AlbumCard key={a.slug} a={a} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-line bg-white p-6 text-sm text-soft">Bado hakuna albamu.</p>
      )}
    </Section>
  )
}

function PhotoViewer({ photos, index, title, onChange, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange((index + 1) % photos.length)
      if (e.key === 'ArrowLeft') onChange((index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, photos.length, onChange, onClose])

  const nav = 'absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <button className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25" onClick={onClose} aria-label="Funga">
        <Icon name="x" className="h-5 w-5" />
      </button>
      {photos.length > 1 && (
        <>
          <button className={`${nav} left-3 sm:left-6`} aria-label="Iliyotangulia" onClick={(e) => (e.stopPropagation(), onChange((index - 1 + photos.length) % photos.length))}>
            <Icon name="back" className="h-6 w-6" />
          </button>
          <button className={`${nav} right-3 sm:right-6`} aria-label="Inayofuata" onClick={(e) => (e.stopPropagation(), onChange((index + 1) % photos.length))}>
            <Icon name="next" className="h-6 w-6" />
          </button>
        </>
      )}
      <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={photos[index]} alt={`${title} — picha ${index + 1}`} className="mx-auto max-h-[82vh] w-auto rounded-xl object-contain" />
        <figcaption className="mt-3 text-center text-[13px] text-white/70">
          {title} · {index + 1} / {photos.length}
        </figcaption>
      </figure>
    </div>
  )
}

function AlbumView({ album }) {
  const [params, setParams] = useSearchParams()
  const hasPhotos = album.photos.length > 0
  const tab = params.get('aina') === 'video' || !hasPhotos ? 'video' : 'picha'
  const [open, setOpen] = useState(null)

  const tabs = [
    { key: 'picha', label: 'Picha', icon: 'gallery', n: album.photos.length },
    { key: 'video', label: 'Video', icon: 'play', n: album.videos.length },
  ]

  return (
    <Section tint="cream" className="!pt-10 sm:!pt-14">
      <Link to="/matunzio" className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink/75 hover:border-gold-400 hover:text-ink">
        <Icon name="back" className="h-4 w-4" />
        Albamu zote
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-700">
            <span className="h-[2px] w-7 rounded-full bg-gold-500" />
            {album.date ? monthYear(album.date) : 'Albamu'}
          </p>
          <h1 className="text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink md:text-[2.5rem]">{album.title}</h1>
          {album.description && <p className="mt-3 text-[15px] leading-relaxed text-soft">{album.description}</p>}
        </div>

        <div className="flex rounded-full border border-line bg-white p-1 shadow-soft" role="tablist" aria-label="Aina ya maudhui">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setParams(t.key === 'video' ? { aina: 'video' } : {}, { replace: true })}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.key ? 'bg-ink text-white' : 'text-ink/65 hover:text-ink'
              }`}
            >
              <Icon name={t.icon} className="h-4 w-4" />
              {t.label}
              <span className={`rounded-full px-1.5 text-[11px] ${tab === t.key ? 'bg-white/15' : 'bg-cream'}`}>{t.n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {tab === 'picha' ? (
          <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4">
            {album.photos.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-xl border border-line bg-white focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <img src={src} alt={`${album.title} — picha ${i + 1}`} loading="lazy" className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </button>
            ))}
          </div>
        ) : album.videos.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {album.videos.map((v, i) => (
              <figure key={v.url + i} className="overflow-hidden rounded-2xl border border-line bg-white p-3">
                <Embed link={v.url} title={v.caption || album.title} />
                {v.caption && <figcaption className="px-1 pb-1 pt-3 text-sm font-semibold text-ink">{v.caption}</figcaption>}
              </figure>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-gold-300 bg-white px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-parchment text-gold-600">
              <Icon name="play" className="h-6 w-6" />
            </span>
            <p className="mt-4 font-semibold text-ink">Bado hakuna video kwenye albamu hii</p>
            <p className="mt-1 text-sm text-soft">Tazama picha, au rudi baadaye.</p>
          </div>
        )}
      </div>

      {open !== null && (
        <PhotoViewer photos={album.photos} index={open} title={album.title} onChange={setOpen} onClose={() => setOpen(null)} />
      )}
    </Section>
  )
}

export default function Gallery() {
  const { slug } = useParams()
  const { albums, loading } = useGallery()
  const album = slug ? albums.find((a) => a.slug === slug) : null

  return (
    <>
      <PageHeader crumbs={album ? ['Matunzio', album.title] : ['Matunzio']} />
      {!slug ? (
        <AlbumList albums={albums} loading={loading} />
      ) : album ? (
        <AlbumView album={album} />
      ) : (
        <Section tint="cream">
          {loading ? (
            <div className="h-64 animate-pulse rounded-2xl bg-white" />
          ) : (
            <div className="rounded-2xl border border-line bg-white p-8 text-center">
              <p className="font-semibold text-ink">Albamu haikupatikana.</p>
              <Link to="/matunzio" className="btn-primary mt-5">
                Albamu zote
              </Link>
            </div>
          )}
        </Section>
      )}
    </>
  )
}
