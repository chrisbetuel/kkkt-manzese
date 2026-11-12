import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'
import Icon from './Icon.jsx'
import { navGroups, ctas } from '../data/nav.js'
import { useAuth, useLang, useTheme } from '../lib/prefs.jsx'
import { useApi } from '../lib/api.js'

/** Swichi ndogo za lugha na mandhari. */
export function PrefToggles({ compact = false }) {
  const { lang, setLang, t } = useLang()
  const { theme, setTheme } = useTheme()
  const next = { light: 'dark', dark: 'system', system: 'light' }
  const themeIcon = { light: 'sun', dark: 'moon', system: 'monitor' }
  const themeLabel = { light: t('Mwanga', 'Light'), dark: t('Giza', 'Dark'), system: t('Kama kifaa', 'System') }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setLang(lang === 'sw' ? 'en' : 'sw')}
        className="rounded-full px-2.5 py-1.5 text-[12px] font-bold text-ink/70 transition-colors hover:bg-cream hover:text-ink"
        aria-label={t('Badili lugha kuwa Kiingereza', 'Switch language to Kiswahili')}
      >
        {lang === 'sw' ? 'EN' : 'SW'}
      </button>
      <button
        type="button"
        onClick={() => setTheme(next[theme])}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-semibold text-ink/70 transition-colors hover:bg-cream hover:text-ink"
        aria-label={`${t('Mandhari', 'Theme')}: ${themeLabel[theme]}`}
        title={themeLabel[theme]}
      >
        <Icon name={themeIcon[theme]} className="h-4 w-4" />
        {!compact && <span className="hidden 2xl:inline">{themeLabel[theme]}</span>}
      </button>
    </div>
  )
}

function LiveDot() {
  const { data } = useApi('/live')
  if (!data?.isLive) return null
  return (
    <span className="relative flex h-2 w-2" aria-label="Hewani sasa">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
    </span>
  )
}

export default function Navbar() {
  const { t } = useLang()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(null) // kundi lililofunguliwa (kompyuta)
  const [expanded, setExpanded] = useState(null) // kundi lililofunguliwa (simu)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    setMenu(null)
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
    if (!menu) return
    const close = (e) => !navRef.current?.contains(e.target) && setMenu(null)
    const esc = (e) => e.key === 'Escape' && setMenu(null)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [menu])

  const groupActive = (g) =>
    g.to === '/' ? pathname === '/' : (g.items || [g]).some((i) => pathname === i.to || pathname.startsWith(i.to + '/'))

  const topClass = (active) =>
    `relative flex items-center gap-1 whitespace-nowrap py-2 text-[13px] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-gold-500 after:transition-transform 2xl:text-[13.5px] ${
      active ? 'text-ink after:scale-x-100' : 'text-ink/70 after:scale-x-0 hover:text-ink'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? 'border-line shadow-[0_6px_24px_-14px_rgba(14,35,68,0.25)]' : 'border-transparent'
      }`}
    >
      {/* upau wa juu: vitendo vikuu + mapendeleo (kompyuta) */}
      <div className="hidden border-b border-line/70 xl:block">
        <div className="container-x flex h-9 items-center justify-end gap-4 text-[12.5px]">
          <Link to={ctas.watch.to} className="flex items-center gap-1.5 font-semibold text-ink/75 hover:text-ink">
            <LiveDot />
            <Icon name="play" className="h-3.5 w-3.5 text-gold-600" />
            {t(ctas.watch.sw, ctas.watch.en)}
          </Link>
          <Link to={ctas.pray.to} className="flex items-center gap-1.5 font-semibold text-ink/75 hover:text-ink">
            <Icon name="hands" className="h-3.5 w-3.5 text-gold-600" />
            {t(ctas.pray.sw, ctas.pray.en)}
          </Link>
          <span className="h-4 w-px bg-line" />
          <Link to="/akaunti" className="flex items-center gap-1.5 font-semibold text-ink/75 hover:text-ink">
            <Icon name="user" className="h-3.5 w-3.5 text-gold-600" />
            {user ? t('Akaunti yangu', 'My account') : t('Ingia', 'Sign in')}
          </Link>
          <PrefToggles />
        </div>
      </div>

      <nav ref={navRef} className="container-x flex h-[72px] items-center justify-between gap-3" aria-label={t('Menyu kuu', 'Main menu')}>
        <Link to="/" aria-label="KKKT Manzese - Mwanzo">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-x-4 xl:flex 2xl:gap-x-5">
          {navGroups.filter((g) => g.to !== '/').map((g) => (
            <li key={g.sw} className="relative">
              {g.items ? (
                <>
                  <button
                    type="button"
                    className={topClass(groupActive(g))}
                    aria-expanded={menu === g.sw}
                    aria-haspopup="true"
                    onClick={() => setMenu((m) => (m === g.sw ? null : g.sw))}
                  >
                    {t(g.sw, g.en)}
                    <Icon name="next" className={`h-3 w-3 transition-transform ${menu === g.sw ? '-rotate-90' : 'rotate-90'}`} />
                  </button>
                  {menu === g.sw && (
                    <ul className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 rounded-2xl border border-line bg-white p-2 shadow-card">
                      {g.items.map((i) => (
                        <li key={i.to}>
                          <NavLink
                            to={i.to}
                            end
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                isActive ? 'bg-parchment text-ink' : 'text-ink/75 hover:bg-cream hover:text-ink'
                              }`
                            }
                          >
                            {t(i.sw, i.en)}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink to={g.to} className={({ isActive }) => topClass(isActive)}>
                  {t(g.sw, g.en)}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden items-center xl:flex">
          <Link to={ctas.join.to} className="btn-primary whitespace-nowrap !px-5 !py-2.5 !text-[13px]">
            {t(ctas.join.sw, ctas.join.en)}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        {/* simu: kitufe cha Tazama + menyu */}
        <div className="flex items-center gap-2 xl:hidden">
          <Link
            to={ctas.watch.to}
            className="flex h-11 items-center gap-1.5 rounded-full border border-line px-3.5 text-[13px] font-semibold text-ink"
          >
            <LiveDot />
            <Icon name="play" className="h-4 w-4 text-gold-600" />
            <span className="hidden sm:inline">{t(ctas.watch.sw, ctas.watch.en)}</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink"
            aria-label={open ? t('Funga menyu', 'Close menu') : t('Fungua menyu', 'Open menu')}
            aria-expanded={open}
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all ${open ? 'top-[7px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[7px] h-[1.5px] w-5 rounded-full bg-current transition-all ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all ${open ? 'top-[7px] -rotate-45' : 'top-[14px]'}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* menyu ya simu */}
      <div
        className={`fixed inset-x-0 top-[72px] z-40 overflow-y-auto border-b border-line bg-white transition-all duration-300 xl:hidden ${
          open ? 'visible h-[calc(100dvh-72px)] opacity-100' : 'invisible h-0 opacity-0'
        }`}
      >
        <div className="container-x py-4">
          <div className="mb-3 grid grid-cols-3 gap-2">
            {[ctas.join, ctas.watch, ctas.pray].map((c, i) => (
              <Link
                key={c.to}
                to={c.to}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-center text-[12px] font-bold ${
                  i === 0 ? 'bg-ink text-white' : 'border border-line text-ink'
                }`}
              >
                <Icon name={['userPlus', 'play', 'hands'][i]} className="h-5 w-5" />
                {t(c.sw, c.en)}
              </Link>
            ))}
          </div>

          <ul className="flex flex-col gap-1">
            {navGroups.map((g) => (
              <li key={g.sw}>
                {g.items ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded((x) => (x === g.sw ? null : g.sw))}
                      aria-expanded={expanded === g.sw}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-colors ${
                        groupActive(g) ? 'bg-parchment text-ink' : 'text-ink/80 hover:bg-cream'
                      }`}
                    >
                      {t(g.sw, g.en)}
                      <Icon name="next" className={`h-4 w-4 text-gold-500 transition-transform ${expanded === g.sw ? '-rotate-90' : 'rotate-90'}`} />
                    </button>
                    {expanded === g.sw && (
                      <ul className="mb-1 ml-4 border-l-2 border-gold-200 pl-2">
                        {g.items.map((i) => (
                          <li key={i.to}>
                            <NavLink
                              to={i.to}
                              end
                              className={({ isActive }) =>
                                `block rounded-lg px-3 py-3 text-[14.5px] font-medium ${isActive ? 'text-ink' : 'text-ink/70'}`
                              }
                            >
                              {t(i.sw, i.en)}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={g.to}
                    end={g.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-colors ${
                        isActive ? 'bg-parchment text-ink' : 'text-ink/80 hover:bg-cream'
                      }`
                    }
                  >
                    {t(g.sw, g.en)}
                    <Icon name="next" className="h-4 w-4 text-gold-500" />
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-line px-3 py-2">
            <Link to="/akaunti" className="flex items-center gap-2 px-1 py-2 text-sm font-semibold text-ink">
              <Icon name="user" className="h-4 w-4 text-gold-600" />
              {user ? t('Akaunti yangu', 'My account') : t('Ingia kwenye akaunti', 'Member sign in')}
            </Link>
            <PrefToggles compact />
          </div>
        </div>
      </div>
    </header>
  )
}
