import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import { useSite } from '../content.jsx'

const FOOTER_PAGES = [
  { label: 'Kuhusu Sisi', to: '/kuhusu' },
  { label: 'Uongozi', to: '/uongozi' },
  { label: 'Ratiba ya Ibada', to: '/ratiba' },
  { label: 'Idara na Vikundi', to: '/idara' },
  { label: 'Matukio', to: '/matukio' },
  { label: 'Mahubiri', to: '/mahubiri' },
  { label: 'Matunzio', to: '/matunzio' },
  { label: 'Wasiliana', to: '/wasiliana' },
]

function ColTitle({ children }) {
  return (
    <h4 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
      <span className="text-gold-500">✦</span>
      {children}
    </h4>
  )
}

export default function Footer() {
  const { church, services, involveOptions } = useSite()
  const year = new Date().getFullYear()
  const linkCls = 'text-[13px] leading-relaxed text-cream/55 transition-colors hover:text-cream'
  const sundays = services.filter((s) => s.day === 'Jumapili').slice(0, 3)

  return (
    <footer className="bg-navy-950 text-cream">
      <div className="container-x py-12 sm:py-16">
        {/* Brand */}
        <div className="border-b border-cream/10 pb-8 text-center sm:text-left">
          <div className="inline-flex sm:flex">
            <Logo light showText />
          </div>
          <p className="mx-auto mt-4 max-w-sm text-[13px] leading-relaxed text-cream/55 sm:mx-0">
            {church.fullName}. {church.tagline}.
          </p>
          <div className="mt-5 flex justify-center gap-2 sm:justify-start">
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
                className="flex h-10 w-10 items-center justify-center border border-cream/15 text-cream/60 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <Icon name={name} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns — 2 up on phones, 4 up from md */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 pt-9 md:grid-cols-4 md:gap-8">
          <div>
            <ColTitle>Kurasa</ColTitle>
            <ul className="space-y-2">
              {FOOTER_PAGES.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColTitle>Shiriki</ColTitle>
            <ul className="space-y-2">
              {involveOptions.map((o) => (
                <li key={o.to}>
                  <Link to={o.to} className={linkCls}>
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColTitle>Ibada za Jumapili</ColTitle>
            <ul className="space-y-2.5 text-[13px]">
              {sundays.map((s, i) => (
                <li key={i} className="text-cream/55">
                  <span className="block font-medium text-cream/90">{s.name}</span>
                  {s.time}
                </li>
              ))}
              <li>
                <Link to="/ratiba" className="text-[12px] font-semibold uppercase tracking-wide text-gold-400 hover:text-gold-300">
                  Ratiba kamili →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <ColTitle>Wasiliana</ColTitle>
            <ul className="space-y-3 text-[13px] text-cream/55">
              <li className="flex gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span className="leading-relaxed">{church.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={`tel:${(church.phone || '').replace(/\s/g, '')}`} className="hover:text-cream">
                  {church.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <a href={`mailto:${church.email}`} className="break-all hover:text-cream">
                  {church.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-1.5 py-5 text-center text-[10px] uppercase tracking-[0.14em] text-cream/40 sm:flex-row sm:text-left">
          <p>© {year} {church.name}</p>
          <p>Kwa utukufu wa Mungu</p>
        </div>
      </div>
    </footer>
  )
}
