import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { homeLinks } from '../data/nav.js'
import { useSite } from '../content.jsx'

// Faharasa ya viungo — ukurasa huu haujavutwa (no scroll).
const destinations = homeLinks

const WRAP = 'mx-auto w-full max-w-[1180px] px-8 sm:px-12 lg:px-20'

function CornerMarks() {
  return (
    <>
      <span className="absolute -left-[7px] -top-[7px] text-[13px] leading-none text-gold-500">✦</span>
      <span className="absolute -right-[7px] -top-[7px] text-[13px] leading-none text-gold-500">✦</span>
      <span className="absolute -bottom-[9px] -left-[7px] text-[13px] leading-none text-gold-500">✦</span>
      <span className="absolute -bottom-[9px] -right-[7px] text-[13px] leading-none text-gold-500">✦</span>
    </>
  )
}

export default function Home() {
  const { church, services } = useSite()
  const sundays = services.filter((s) => s.day === 'Jumapili').slice(0, 2)

  return (
    <section className="relative flex h-full flex-col overflow-hidden bg-cream">
      {/* ---------- Decorative layer ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        {/* background photo */}
        <img
          src="https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?auto=format&fit=crop&w=1900&q=70"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* cream veil so the masthead stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream/[0.90] via-cream/[0.84] to-cream/[0.66]" />
        <div className="absolute inset-0 bg-cream/[0.30]" />
        {/* fine dot grid */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(23,21,18,0.07) 1px, transparent 0)',
            backgroundSize: '26px 26px',
            maskImage:
              'radial-gradient(ellipse 70% 70% at 50% 45%, #000 30%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 70% at 50% 45%, #000 30%, transparent 100%)',
          }}
        />
        {/* inset frame + corner marks */}
        <div className="absolute inset-4 border border-ink/15 sm:inset-6">
          <CornerMarks />
        </div>
        {/* spine label */}
        <div className="absolute right-[17px] top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] text-[10px] font-semibold uppercase tracking-[0.3em] text-ink/30 xl:block">
          Dar es Salaam · Tanzania
        </div>
      </div>

      {/* ---------- Top micro-header ---------- */}
      <div className={`relative z-10 ${WRAP}`}>
        <div className="flex items-center justify-between gap-6 border-b border-ink/12 py-4">
          <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/45">
            <span className="text-gold-500">✦</span>
            Karibu
          </span>
          <span className="hidden truncate text-[12px] italic text-ink/40 sm:block">
            &ldquo;…nyumba ya Mungu, ndiyo kanisa la Mungu aliye hai&rdquo; — 1&nbsp;Timotheo&nbsp;3:15
          </span>
        </div>
      </div>

      {/* ---------- Main ---------- */}
      <div
        className={`relative z-10 grid flex-1 content-center items-center gap-x-16 gap-y-5 py-4 sm:gap-y-9 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] ${WRAP}`}
      >
        {/* Identity */}
        <div className="animate-fade-up">
          <p className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600 sm:text-[11px]">
            <span className="text-gold-500">✦</span>
            {church.fullName}
          </p>

          <h1 className="mt-5 font-display uppercase text-ink">
            <span className="block text-[19vw] font-extrabold leading-[0.82] tracking-[0.01em] sm:text-[6.5rem] lg:text-[7.75rem]">
              KKKT
            </span>
            <span className="mt-3.5 flex items-center gap-3 sm:mt-5">
              <span className="h-[2px] w-7 shrink-0 bg-gold-500 sm:w-12" />
              <span className="text-[3.4vw] font-semibold tracking-[0.16em] text-gold-600 sm:text-[1.3rem] sm:tracking-[0.26em] lg:text-[1.55rem]">
                Usharika wa Manzese
              </span>
            </span>
          </h1>

          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.14em] text-ink/55">
            <span className="flex items-center gap-2">
              <Icon name="pin" className="h-3.5 w-3.5 text-gold-500" />
              Manzese, Dar es Salaam
            </span>
            <span className="flex items-center gap-2">
              <Icon name="clock" className="h-3.5 w-3.5 text-gold-500" />
              <span>
                Ibada za Jumapili
                <span className="hidden text-ink/75 sm:inline">
                  {' — '}
                  {sundays.map((s) => s.time).join(' · ')}
                </span>
              </span>
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-7 sm:gap-4">
            <Link to="/ratiba" className="btn-primary">
              Ratiba ya Ibada
            </Link>
            <Link to="/wasiliana" className="btn-navy hidden sm:inline-flex">
              Wasiliana Nasi
            </Link>
          </div>
        </div>

        {/* Directory */}
        <nav
          className="animate-fade-up border-t border-ink/15 pt-6 sm:pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0"
          style={{ animationDelay: '0.1s' }}
          aria-label="Sehemu za tovuti"
        >
          <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-ink/40">
            <span className="text-gold-500">✦</span>
            Tembelea
          </p>
          <ul className="grid grid-cols-2 gap-2 [&>li:last-child:nth-child(odd)]:col-span-2 sm:gap-2.5">
            {destinations.map((l, i) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group flex items-center gap-2.5 border border-ink/20 bg-white/80 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/80 backdrop-blur-[2px] transition-all hover:border-ink hover:bg-white hover:text-ink hover:shadow-[3px_3px_0_0_#b98f4c] sm:py-3"
                >
                  <span className="shrink-0 font-display text-[10px] tabular-nums text-gold-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate">{l.label}</span>
                  <Icon
                    name="arrow"
                    className="ml-auto h-3.5 w-3.5 shrink-0 text-ink/25 transition-all group-hover:translate-x-0.5 group-hover:text-gold-600"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className={`relative z-10 ${WRAP}`}>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink/12 py-4">
          <Link to="/michango" className="btn-primary !px-5 !py-2.5 !text-[10px]">
            <span>✦</span>
            Toa Sadaka &amp; Zaka
          </Link>

          <div className="flex items-center gap-4">
            {[
              ['facebook', church.social.facebook],
              ['instagram', church.social.instagram],
              ['youtube', church.social.youtube],
            ].map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                className="text-ink/45 transition-colors hover:text-ink"
              >
                <Icon name={name} className="h-4 w-4" />
              </a>
            ))}
            <a
              href={`tel:${church.phone.replace(/\s/g, '')}`}
              className="hidden text-[11px] uppercase tracking-[0.14em] text-ink/55 hover:text-ink sm:inline"
            >
              {church.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
