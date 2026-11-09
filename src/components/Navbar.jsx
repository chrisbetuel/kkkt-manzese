import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import { navLinks, moreLinks, ctaLink } from '../data/nav.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const moreRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    setMore(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!more) return
    const close = (e) => !moreRef.current?.contains(e.target) && setMore(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [more])

  const desktop = navLinks.filter((l) => l.to !== '/')
  const main = desktop.filter((l) => !moreLinks.includes(l.to))
  const extra = desktop.filter((l) => moreLinks.includes(l.to))
  const moreActive = extra.some((l) => pathname.startsWith(l.to))

  const linkClass = ({ isActive }) =>
    `relative whitespace-nowrap py-2 text-[13.5px] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-gold-500 after:transition-transform ${
      isActive ? 'text-ink after:scale-x-100' : 'text-ink/70 after:scale-x-0 hover:text-ink'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? 'border-line shadow-[0_6px_24px_-14px_rgba(14,35,68,0.25)]' : 'border-transparent'
      }`}
    >
      <nav className="container-x flex h-[76px] items-center justify-between gap-4">
        <Link to="/" aria-label="KKKT Manzese - Nyumbani">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-x-5 xl:flex 2xl:gap-x-6">
          {main.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
          {extra.length > 0 && (
            <li className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMore((v) => !v)}
                aria-expanded={more}
                className={`flex items-center gap-1 py-2 text-[13.5px] font-medium transition-colors ${
                  moreActive || more ? 'text-ink' : 'text-ink/70 hover:text-ink'
                }`}
              >
                Zaidi
                <Icon name="next" className={`h-3.5 w-3.5 transition-transform ${more ? '-rotate-90' : 'rotate-90'}`} />
              </button>
              {more && (
                <ul className="absolute right-0 top-full mt-3 w-48 rounded-2xl border border-line bg-white p-2 shadow-card">
                  {extra.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive ? 'bg-parchment text-ink' : 'text-ink/75 hover:bg-cream hover:text-ink'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>

        <div className="hidden items-center xl:flex">
          <Link to={ctaLink.to} className="btn-primary whitespace-nowrap !px-5 !py-2.5 !text-[13px]">
            {ctaLink.label}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink xl:hidden"
          aria-label={open ? 'Funga menyu' : 'Fungua menyu'}
          aria-expanded={open}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all ${
                open ? 'top-[7px] rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[1.5px] w-5 rounded-full bg-current transition-all ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all ${
                open ? 'top-[7px] -rotate-45' : 'top-[14px]'
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`fixed inset-x-0 top-[76px] z-40 overflow-y-auto border-b border-line bg-white transition-all duration-300 xl:hidden ${
          open ? 'visible h-[calc(100dvh-76px)] opacity-100' : 'invisible h-0 opacity-0'
        }`}
      >
        <ul className="container-x flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-colors ${
                    isActive ? 'bg-parchment text-ink' : 'text-ink/75 hover:bg-cream'
                  }`
                }
              >
                {link.label}
                <Icon name="next" className="h-4 w-4 text-gold-500" />
              </NavLink>
            </li>
          ))}
          <li className="pt-5">
            <Link to={ctaLink.to} className="btn-primary w-full">
              {ctaLink.label}
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
