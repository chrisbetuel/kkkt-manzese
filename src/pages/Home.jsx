import { Link } from 'react-router-dom'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { homeLinks } from '../data/nav.js'
import { useSite } from '../content.jsx'

const WRAP = 'container-x'

// picha halisi za usharika (public/images/kanisa)
const photo = (name, small = false) => `/images/kanisa/${name}${small ? '-sm' : ''}.jpg`
const HERO_IMAGE = photo('maombi-ibada')

// kadi ndefu za picha (kama "Daily Challenges / Group Saving")
const FEATURES = [
  { to: '/maombi', title: 'Maombi', icon: 'hands', image: photo('mchungaji-madhabahu', true) },
  { to: '/mahubiri', title: 'Mahubiri', icon: 'book', image: photo('mahubiri-mimbari', true) },
  { to: '/ushuhuda', title: 'Ushuhuda', icon: 'heart', image: photo('ubatizo-familia', true) },
]

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

function Chip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink shadow-[0_4px_14px_-8px_rgba(14,35,68,0.25)]">
      <Icon name={icon} className="h-4 w-4 text-gold-600" />
      {children}
    </span>
  )
}

export default function Home() {
  const { church, services, announcements, events, involveOptions } = useSite()
  const sundays = services.filter((s) => s.day === 'Jumapili').slice(0, 2)
  const upcoming = events.slice(0, 4)
  const steps = involveOptions.slice(0, 3)

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-parchment via-white to-white">
        {/* picha upande wa kulia, inafifia kuelekea kushoto */}
        <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-parchment via-parchment/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className={`relative ${WRAP} pb-14 pt-12 sm:pt-16 lg:pb-20 lg:pt-20`}>
          <div className="max-w-xl animate-fade-up">
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
              {church.name}
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span className="text-ink/70">{church.parish}</span>
            </p>

            <h1 className="mt-5 text-[clamp(2.5rem,6.4vw,4.4rem)] font-extrabold leading-[1.03] tracking-[-0.035em] text-ink">
              Karibu Nyumbani
              <br />
              kwa Bwana
            </h1>
            <p className="mt-1 font-script text-[clamp(2rem,4.6vw,3rem)] leading-tight text-gold-600">
              Tukue pamoja katika Kristo
            </p>

            <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-soft">
              {church.tagline}. Jiunge nasi kwenye ibada, ushirika na huduma hapa Manzese, Dar es Salaam.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Chip icon="pin">Manzese · Dar es Salaam</Chip>
              <Chip icon="clock">Ibada kila Jumapili</Chip>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/ratiba" className="btn-primary">
                Ratiba ya Ibada
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link to="/kuhusu" className="btn-navy">
                <Icon name="church" className="h-4 w-4 text-gold-600" />
                Kuhusu Sisi
              </Link>
            </div>
          </div>

          {/* picha kwa simu */}
          <div className="relative mt-10 overflow-hidden rounded-3xl shadow-card lg:hidden">
            <img src={HERO_IMAGE} alt="" className="aspect-[16/10] w-full object-cover" />
          </div>

          {/* vipande vinavyoelea juu ya picha */}
          <div aria-hidden className="pointer-events-none absolute right-8 top-16 hidden animate-float items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-chip backdrop-blur lg:flex xl:right-16">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-parchment text-gold-600">
              <Icon name="calendar" className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] text-soft">Ibada za Jumapili</span>
              <span className="block text-sm font-bold text-ink">
                {sundays[0]?.time || 'Kila Jumapili'}
              </span>
            </span>
          </div>
          {upcoming.length > 0 && (
            <div aria-hidden className="pointer-events-none absolute bottom-40 right-[30%] hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-chip backdrop-blur lg:flex" style={{ animation: 'float 6s ease-in-out 1s infinite' }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-gold-300">
                <Icon name="spark" className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold text-ink">Matukio {events.length}</span>
                <span className="block text-[11px] text-soft">Yanayokuja kanisani</span>
              </span>
            </div>
          )}

          {/* upau wa taarifa (kama upau wa kutafuta) */}
          <div className="relative mt-10 grid gap-2 rounded-3xl border border-line bg-white p-2.5 shadow-card sm:grid-cols-[1fr_1fr_auto] lg:mt-14 lg:max-w-3xl">
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
              <Icon name="clock" className="h-5 w-5 shrink-0 text-ink" />
              <span className="min-w-0 leading-tight">
                <span className="block text-[13px] font-bold text-ink">Ibada za Jumapili</span>
                <span className="block truncate text-[12.5px] text-soft">
                  {sundays.length ? sundays.map((s) => s.time).join(' · ') : 'Tazama ratiba'}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 sm:border-l sm:border-line">
              <Icon name="pin" className="h-5 w-5 shrink-0 text-ink" />
              <span className="min-w-0 leading-tight">
                <span className="block text-[13px] font-bold text-ink">Mahali</span>
                <span className="block truncate text-[12.5px] text-soft">Manzese, Dar es Salaam</span>
              </span>
            </div>
            <Link to="/jisajili" className="btn-primary !py-3">
              <Icon name="userPlus" className="h-4 w-4" />
              Jisajili
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- KARIBU + KADI NDEFU ---------------- */}
      <section className="bg-white pb-16 pt-4 sm:pb-24">
        <div className={`${WRAP} grid gap-4 lg:grid-cols-[1.45fr_1fr]`}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-50 via-parchment to-gold-100 p-7 shadow-card sm:p-10">
            <div aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold-200/50 blur-2xl" />
            <p className="relative flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-700">
              <span className="h-[2px] w-7 rounded-full bg-gold-500" />
              Usajili wa Washirika
            </p>
            <p className="relative mt-4 font-script text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.05] text-ink">
              Karibu katika familia,
              <br />
              <span className="text-gold-600">jisajili leo</span>
            </p>
            <p className="relative mt-4 max-w-md text-[15px] leading-relaxed text-soft">
              Jaza fomu fupi ya usajili ili tukufahamu, tukuhudumie na upate nafasi ya kuhudumu
              katika idara na kwaya.
            </p>
            <div className="relative mt-7 flex flex-wrap gap-3">
              <Link to="/jisajili" className="btn-primary">
                Jisajili Sasa
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <Link to="/idara" className="btn-navy">
                Idara na Kwaya
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {FEATURES.map((f, i) => (
              <Link
                key={f.to}
                to={f.to}
                className="group relative flex min-h-[260px] flex-col items-center justify-between overflow-hidden rounded-3xl bg-ink py-5 text-white shadow-card sm:min-h-[340px]"
              >
                <img
                  src={f.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/85" />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur">
                  <Icon name={f.icon} className="h-5 w-5" />
                </span>
                <span className="relative rotate-180 text-base font-bold tracking-tight [writing-mode:vertical-rl] sm:text-lg">
                  {f.title}
                </span>
                <span className="relative text-[11px] font-semibold tracking-[0.2em] text-white/70">
                  {String(i + 2).padStart(2, '0')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- MATUKIO ---------------- */}
      {upcoming.length > 0 && (
        <Section tint="cream">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-700">
                <span className="h-[2px] w-7 rounded-full bg-gold-500" />
                Matukio
              </p>
              <h2 className="text-[1.75rem] font-extrabold leading-[1.15] tracking-[-0.025em] md:text-[2.4rem]">
                Yanayokuja kanisani
              </h2>
            </div>
            <Link to="/matukio" className="inline-flex items-center gap-1.5 text-sm font-bold text-ink hover:text-gold-700">
              Matukio yote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((e) => {
              const box = dateBox(e.date)
              return (
                <article
                  key={e.title}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-parchment to-navy-50">
                    {e.image ? (
                      <img src={e.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="flex h-full items-center justify-center">
                        <Icon name="calendar" className="h-12 w-12 text-gold-500/70" />
                      </span>
                    )}
                    {e.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
                        {e.tag}
                      </span>
                    )}
                    {box && (
                      <span className="absolute right-3 top-3 flex h-14 w-12 flex-col items-center justify-center rounded-xl bg-white text-center shadow-chip">
                        <span className="text-[10px] font-semibold uppercase text-gold-700">{box.mon}</span>
                        <span className="text-lg font-extrabold leading-none text-ink">{box.day}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="flex items-center gap-1.5 text-[12px] text-soft">
                      <Icon name="calendar" className="h-3.5 w-3.5 text-gold-600" />
                      {[e.date, e.time].filter(Boolean).join(' · ')}
                    </p>
                    <h3 className="mt-1.5 text-[15px] font-bold leading-snug">{e.title}</h3>
                    {e.location && (
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-soft">
                        <Icon name="pin" className="h-3.5 w-3.5 text-gold-600" />
                        {e.location}
                      </p>
                    )}
                    <div className="flex-1 pb-4" />
                    <div className="flex gap-2 border-t border-line pt-4">
                      <Link to="/matukio" className="btn-gold flex-1 !px-3 !py-2 !text-[12.5px]">
                        Maelezo
                      </Link>
                      <Link to="/jisajili" className="btn-navy flex-1 !px-3 !py-2 !text-[12.5px]">
                        Jisajili
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </Section>
      )}

      {/* ---------------- NJIA ZA KUSHIRIKI ---------------- */}
      {steps.length > 0 && (
        <Section tint="white">
          <SectionTitle center eyebrow="Shiriki" title="Njia rahisi za kujiunga na huduma" />
          <div className="relative mx-auto mb-8 hidden max-w-4xl md:block" aria-hidden>
            <div className="absolute inset-x-[16%] top-1/2 h-[2px] -translate-y-1/2 bg-gold-300" />
            <div className="relative flex justify-around">
              {steps.map((_, i) => (
                <span key={i} className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-bold text-gold-300 ring-4 ring-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Link
                key={s.to}
                to={s.to}
                className="group relative overflow-hidden rounded-3xl border border-line bg-white p-7 transition-shadow hover:shadow-card"
              >
                <span className="absolute right-6 top-4 text-5xl font-extrabold tracking-tight text-gold-200">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-parchment text-gold-700">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-soft">{s.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-ink group-hover:text-gold-700">
                  Anza hapa
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ---------------- DIRECTORY ---------------- */}
      <Section tint="cream">
        <SectionTitle eyebrow="Tembelea" title="Sehemu za tovuti" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {homeLinks.map((l, i) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-white px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-parchment text-xs font-bold tabular-nums text-gold-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-[15px] font-semibold text-ink">{l.label}</span>
                <Icon
                  name="arrow"
                  className="h-4 w-4 shrink-0 text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:text-gold-600"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------- ANNOUNCEMENTS ---------------- */}
      {announcements.length > 0 && (
        <Section tint="white">
          <SectionTitle eyebrow="Matangazo" title="Yanayoendelea kanisani" />
          <div className="grid gap-5 md:grid-cols-3">
            {announcements.slice(0, 3).map((a) => (
              <article
                key={a.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card"
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
                  <p className="text-[12px] font-semibold text-gold-700">{a.date}</p>
                  <h3 className="mt-1 text-base font-bold">{a.title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-soft">{a.text}</p>
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
