import { Link } from 'react-router-dom'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { homeLinks } from '../data/nav.js'
import { useSite } from '../content.jsx'

const WRAP = 'mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-16'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=2000&q=70'

const MONTHS = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des']
// viambishi vya majina ya miezi: Kiswahili kisha Kiingereza
const MONTH_PREFIX = [
  ['jan'], ['feb'], ['mac', 'mar'], ['apr'], ['mei', 'may'], ['jun'],
  ['jul'], ['ago', 'aug'], ['sep'], ['okt', 'oct'], ['nov'], ['des', 'dec'],
]

/** Tarehe ya tukio (maandishi huru) -> { day, mon } kwa kisanduku cha tarehe, au null. */
function dateBox(label = '') {
  const s = String(label).toLowerCase()
  let m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (m) return { day: +m[3], mon: MONTHS[+m[2] - 1] }
  m = s.match(/\b(\d{1,2})[./-](\d{1,2})(?:[./-]\d{2,4})?\b/)
  if (m && +m[2] >= 1 && +m[2] <= 12) return { day: +m[1], mon: MONTHS[+m[2] - 1] }
  const month = (w) => MONTH_PREFIX.findIndex((p) => p.some((x) => w.startsWith(x)))
  m = s.match(/\b(\d{1,2})\s+([a-z]{3,})/) || s.match(/\b([a-z]{3,})\s+(\d{1,2})\b/)
  if (m) {
    const [d, w] = /\d/.test(m[1]) ? [m[1], m[2]] : [m[2], m[1]]
    const i = month(w)
    if (i >= 0) return { day: +d, mon: MONTHS[i] }
  }
  return null
}

export default function Home() {
  const { church, services, announcements, events } = useSite()
  const sundays = services.filter((s) => s.day === 'Jumapili').slice(0, 2)
  const upcoming = events.slice(0, 3)

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative isolate overflow-hidden bg-[#0c0b0a] text-cream">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[65%_center] grayscale brightness-[1.15] contrast-[1.15]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/45 to-black/0" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/60 to-transparent" />

        <div className={`pb-8 pt-[130px] sm:pb-10 sm:pt-[170px] lg:pt-[200px] ${WRAP}`}>
          <div className="max-w-2xl animate-fade-up">
            <span className="block h-[2px] w-24 bg-gold-500 sm:w-32" />
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-300 sm:text-[11px]">
              {church.fullName} · {church.parish}
            </p>

            <h1 className="mt-4 font-elegant text-[clamp(2.6rem,7.2vw,5rem)] font-medium leading-[1.02] tracking-[-0.01em] text-white">
              Jumuika, kua na
              <br />
              hudumu pamoja nasi
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-cream/75 sm:text-[15px]">
              {church.tagline}. Karibu kwenye ibada, ushirika na huduma za kanisa letu hapa
              Manzese, Dar es Salaam — kuna nafasi kwa ajili yako katika familia ya Mungu.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                to="/kuhusu"
                className="inline-flex items-center border-[1.5px] border-gold-500 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink"
              >
                Fahamu zaidi kuhusu KKKT Manzese
              </Link>
              <Link
                to="/ratiba"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/80 hover:text-white"
              >
                Ratiba ya Ibada
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-cream/55">
              <span className="flex items-center gap-2">
                <Icon name="pin" className="h-3.5 w-3.5 text-gold-500" />
                Manzese, Dar es Salaam
              </span>
              {sundays.length > 0 && (
                <span className="flex items-center gap-2">
                  <Icon name="clock" className="h-3.5 w-3.5 text-gold-500" />
                  Ibada za Jumapili{' '}
                  <span className="text-cream/80">{sundays.map((s) => s.time).join(' · ')}</span>
                </span>
              )}
            </div>
          </div>

          {/* matukio yajayo — kadi juu ya picha */}
          {upcoming.length > 0 && (
            <ul className="mt-14 grid gap-3 sm:mt-20 md:grid-cols-3">
              {upcoming.map((e) => {
                const box = dateBox(e.date)
                return (
                  <li key={e.title}>
                    <Link
                      to="/matukio"
                      className="group flex h-full gap-4 border border-white/10 bg-navy-700/80 p-4 backdrop-blur-sm transition-colors hover:border-gold-500/60 hover:bg-navy-600/90 sm:p-5"
                    >
                      <span className="flex h-16 w-14 shrink-0 flex-col items-center justify-center border border-white/20 bg-navy-500/50 text-center">
                        {box ? (
                          <>
                            <span className="text-[11px] uppercase tracking-[0.08em] text-cream/75">{box.mon}</span>
                            <span className="font-elegant text-[1.7rem] leading-none text-white">{box.day}</span>
                          </>
                        ) : (
                          <Icon name="calendar" className="h-6 w-6 text-gold-300" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white group-hover:text-gold-300">
                          {e.title}
                        </span>
                        <span className="mt-1 line-clamp-3 block text-[12.5px] leading-relaxed text-cream/65">
                          {[box ? null : e.date, e.time, e.text].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ---------------- DIRECTORY ---------------- */}
      <Section tint="white">
        <SectionTitle eyebrow="Tembelea" title="Sehemu za tovuti" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {homeLinks.map((l, i) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="group flex items-center gap-3 border border-ink/15 bg-white px-4 py-4 transition-all hover:border-ink hover:shadow-[4px_4px_0_0_#b98f4c]"
              >
                <span className="shrink-0 font-display text-xs font-bold tabular-nums text-gold-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-sm font-semibold uppercase tracking-[0.1em] text-ink/80 group-hover:text-ink">
                  {l.label}
                </span>
                <Icon
                  name="arrow"
                  className="h-4 w-4 shrink-0 text-ink/25 transition-all group-hover:translate-x-0.5 group-hover:text-gold-600"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------- ANNOUNCEMENTS ---------------- */}
      {announcements.length > 0 && (
        <Section tint="cream">
          <SectionTitle eyebrow="Matangazo" title="Yanayoendelea kanisani" />
          <div className="grid gap-5 md:grid-cols-3">
            {announcements.slice(0, 3).map((a) => (
              <article
                key={a.title}
                className="flex flex-col overflow-hidden border border-ink/12 bg-white/80"
              >
                {a.image && (
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-600">
                    {a.date}
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{a.title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-ink/60">{a.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/matukio" className="btn-navy">
              Matukio yote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Section>
      )}
    </>
  )
}
