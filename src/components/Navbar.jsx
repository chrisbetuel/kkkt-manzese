import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import { navLinks, ctaLink } from '../data/nav.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [open])

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors 2xl:text-[11px] 2xl:tracking-[0.18em] ${
      isActive ? 'text-ink' : 'text-ink/55 hover:text-ink'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-ink/12 bg-cream/95 backdrop-blur">
      <nav className="container-x flex h-[76px] items-center justify-between gap-4">
        <Link to="/" aria-label="KKKT Manzese - Nyumbani">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-x-4 gap-y-1 xl:flex 2xl:gap-x-[18px]">
          {navLinks
            .filter((link) => link.to !== '/')
            .map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
        </ul>

        <div className="hidden items-center xl:flex">
          <Link
            to={ctaLink.to}
            className="btn-primary whitespace-nowrap !px-5 !py-3 !text-[10px]"
          >
            {ctaLink.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center text-ink xl:hidden"
          aria-label={open ? 'Funga menyu' : 'Fungua menyu'}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 h-[1.5px] w-6 bg-current transition-all ${
                open ? 'top-2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-[1.5px] w-6 bg-current transition-all ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 h-[1.5px] w-6 bg-current transition-all ${
                open ? 'top-2 -rotate-45' : 'top-4'
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`fixed inset-x-0 top-[76px] z-40 overflow-y-auto border-b border-ink/12 bg-cream transition-all duration-300 xl:hidden ${
          open ? 'visible h-[calc(100vh-76px)] opacity-100' : 'invisible h-0 opacity-0'
        }`}
      >
        <ul className="container-x flex flex-col py-4">
          {navLinks.map((link) => (
            <li key={link.to} className="border-b border-ink/10">
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-4 text-sm font-semibold uppercase tracking-[0.16em] ${
                    isActive ? 'text-ink' : 'text-ink/60'
                  }`
                }
              >
                <span className="text-gold-500">✦</span>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="pt-6">
            <Link to={ctaLink.to} className="btn-primary w-full">
              {ctaLink.label}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
