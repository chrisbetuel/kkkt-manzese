import { Link } from 'react-router-dom'
import { Section, SectionTitle } from '../components/Section.jsx'
import Icon from '../components/Icon.jsx'
import { homeLinks } from '../data/nav.js'
import { useSite } from '../content.jsx'

const WRAP = 'mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-16'

export default function Home() {
  const { church, services, announcements } = useSite()
  const sundays = services.filter((s) => s.day === 'Jumapili').slice(0, 2)

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-ink/12 bg-cream">
        {/* decorative layer */}
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
          <img
            src="https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=1900&q=70"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cream/[0.92] via-cream/[0.86] to-cream/[0.7]" />
          <div className="absolute inset-0 bg-cream/[0.3]" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(23,21,18,0.07) 1px, transparent 0)',
              backgroundSize: '26px 26px',
              maskImage:
                'radial-gradient(ellipse 75% 70% at 50% 40%, #000 30%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 75% 70% at 50% 40%, #000 30%, transparent 100%)',
            }}
          />
          <div className="absolute inset-3 border border-ink/15 sm:inset-5">
            <span className="absolute -left-[7px] -top-[7px] text-[13px] leading-none text-gold-500">✦</span>
            <span className="absolute -right-[7px] -top-[7px] text-[13px] leading-none text-gold-500">✦</span>
            <span className="absolute -bottom-[9px] -left-[7px] text-[13px] leading-none text-gold-500">✦</span>
            <span className="absolute -bottom-[9px] -right-[7px] text-[13px] leading-none text-gold-500">✦</span>
          </div>
        </div>

        <div className={`relative z-10 py-14 sm:py-20 lg:py-28 ${WRAP}`}>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-600 sm:text-[11px] sm:tracking-[0.22em]">
            <span className="text-gold-500">✦</span>
            {church.fullName}
          </p>

          <h1 className="mt-4 font-display uppercase text-ink sm:mt-6">
            <span className="block text-[clamp(3.25rem,17vw,8rem)] font-extrabold leading-[0.85] tracking-[0.01em]">
              KKKT
            </span>
            <span className="mt-3 flex items-center gap-3 sm:mt-4">
              <span className="h-[2px] w-7 shrink-0 bg-gold-500 sm:w-12" />
              <span className="text-[clamp(0.95rem,4vw,1.6rem)] font-semibold tracking-[0.16em] text-gold-600 sm:tracking-[0.24em]">
                Usharika wa Manzese
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/70 sm:text-base">
            {church.tagline}. Karibu kwenye ibada, ushirika na huduma za kanisa
            letu hapa Manzese, Dar es Salaam.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-ink/55">
            <span className="flex items-center gap-2">
              <Icon name="pin" className="h-3.5 w-3.5 text-gold-500" />
              Manzese, Dar es Salaam
            </span>
            {sundays.length > 0 && (
              <span className="flex items-center gap-2">
                <Icon name="clock" className="h-3.5 w-3.5 text-gold-500" />
                Ibada za Jumapili{' '}
                <span className="text-ink/75">{sundays.map((s) => s.time).join(' · ')}</span>
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link to="/ratiba" className="btn-primary">
              Ratiba ya Ibada
            </Link>
            <Link to="/michango" className="btn-navy">
              Toa Sadaka &amp; Zaka
            </Link>
          </div>
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
