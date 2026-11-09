import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'

/** Kitufe cha usajili wa washirika kinachoelea juu ya kile cha WhatsApp (tovuti nzima). */
export default function FloatingRegister() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/jisajili')) return null

  return (
    <Link
      to="/jisajili"
      aria-label="Jisajili kama mshirika / Member Registration"
      className="group fixed bottom-[4.75rem] right-4 z-40 flex items-center gap-2.5 rounded-full border border-gold-500/60 bg-ink py-2.5 pl-2.5 pr-4 text-cream shadow-lg transition-transform duration-200 hover:-translate-y-0.5 motion-safe:animate-soft-pulse sm:bottom-[5.75rem] sm:right-6"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-ink transition-colors group-hover:bg-gold-300">
        <Icon name="church" className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <span className="leading-tight">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em]">Jisajili</span>
        <span className="hidden text-[10px] text-cream/60 sm:block">Member Registration</span>
      </span>
    </Link>
  )
}
