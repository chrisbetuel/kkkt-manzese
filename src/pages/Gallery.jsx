import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { useSite } from '../content.jsx'

export default function Gallery() {
  const { galleryImages } = useSite()
  const [album, setAlbum] = useState('Zote')
  const [active, setActive] = useState(null) // index within `photos`

  const albums = useMemo(
    () => ['Zote', ...Array.from(new Set(galleryImages.map((g) => g.album)))],
    [],
  )

  const photos = useMemo(
    () =>
      album === 'Zote'
        ? galleryImages
        : galleryImages.filter((g) => g.album === album),
    [album],
  )

  useEffect(() => setActive(null), [album])

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, photos.length])

  return (
    <>
      <PageHeader crumbs={['Matunzio']} />

      <Section tint="cream">
        <SectionTitle eyebrow="Matunzio" title="Chagua albamu unayotaka kuona" />

        {/* Album selector */}
        <div className="mb-10 flex flex-wrap gap-2">
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => setAlbum(a)}
              className={`border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                album === a
                  ? 'border-ink bg-ink text-cream'
                  : 'border-ink/25 bg-white/70 text-ink/70 hover:border-ink hover:text-ink'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Photos */}
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {photos.map((img, i) => (
            <button
              key={img.src + i}
              onClick={() => setActive(i)}
              className="group relative block w-full overflow-hidden border border-ink/10 focus-visible:ring-2 focus-visible:ring-gold-500"
            >
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent p-3 text-left text-[11px] font-medium uppercase tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.caption}
              </span>
            </button>
          ))}
        </div>
      </Section>

      <Section tint="white">
        <SectionTitle eyebrow="Video" title="Video za ibada na matukio" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex aspect-video items-center justify-center border border-ink/12 bg-cream"
            >
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center bg-navy-900 text-gold-400">
                  <Icon name="play" className="h-7 w-7" />
                </span>
                <p className="mt-3 text-xs uppercase tracking-wide text-ink/45">
                  Video [JAZA kiungo]
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Lightbox */}
      {active !== null && photos[active] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center bg-white/10 text-white hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label="Funga"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[active].src.replace('w=900', 'w=1600')}
              alt={photos[active].caption}
              className="max-h-[80vh] object-contain"
            />
            <figcaption className="mt-3 text-center text-xs uppercase tracking-wide text-navy-300">
              {photos[active].caption} · {active + 1}/{photos.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
