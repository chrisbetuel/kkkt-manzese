import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import { navLinks } from '../data/nav.js'
import { useSite } from '../content.jsx'

function ColTitle({ children }) {
  return (
    <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-400">
      <span className="text-gold-500">✦</span>
      {children}
    </h4>
  )
}

export default function Footer() {
  const { church, services, involveOptions } = useSite()
  const year = new Date().getFullYear()
  const linkCls = 'text-[13px] text-cream/55 transition-colors hover:text-cream'

  return (
    <footer className="bg-navy-950 text-cream">
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo light showText />
          <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-cream/55">
            {church.fullName}. {church.tagline}.
          </p>
          <div className="mt-6 flex gap-2">
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

        <div>
          <ColTitle>Kurasa</ColTitle>
          <ul className="mt-5 space-y-2.5">
            {navLinks.map((l) => (
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
          <ul className="mt-5 space-y-2.5">
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
          <ColTitle>Ratiba ya Ibada</ColTitle>
          <ul className="mt-5 space-y-3 text-[13px]">
            {services.slice(0, 4).map((s, i) => (
              <li key={i} className="text-cream/55">
                <span className="block font-medium text-cream/90">
                  {s.day} — {s.name}
                </span>
                {s.time}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColTitle>Wasiliana</ColTitle>
          <ul className="mt-5 space-y-3 text-[13px] text-cream/55">
            <li className="flex gap-3">
              <Icon name="pin" className="h-4 w-4 shrink-0 text-gold-400" />
              <span>{church.address}</span>
            </li>
            <li className="flex gap-3">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`tel:${church.phone.replace(/\s/g, '')}`} className="hover:text-cream">
                {church.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`mailto:${church.email}`} className="hover:text-cream">
                {church.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-[11px] uppercase tracking-[0.14em] text-cream/40 sm:flex-row">
          <p>
            © {year} {church.name}
          </p>
          <p>Kwa utukufu wa Mungu</p>
        </div>
      </div>
    </footer>
  )
}
