import { useState } from 'react'
import { useSite } from '../content.jsx'

const LOGO = '/logo.png'
const LOGO_FALLBACK = '/logo.svg'

/**
 * Nembo ya kanisa. Hujaribu kupakia faili rasmi (public/logo.png);
 * ikikosekana hutumia nembo ya SVG ya muda (public/logo.svg).
 */
export default function Logo({ className = 'h-11 w-auto max-w-[66px]', showText = true, light = false }) {
  const { church } = useSite()
  const [src, setSrc] = useState(LOGO)

  return (
    <span className="flex items-center gap-3">
      <img
        src={src}
        onError={() => src !== LOGO_FALLBACK && setSrc(LOGO_FALLBACK)}
        alt={`Nembo ya ${church.name}`}
        className={`${className} shrink-0 object-contain`}
      />
      {showText && (
        <span className="leading-tight">
          <span
            className={`block whitespace-nowrap font-display text-[13px] font-bold uppercase tracking-[0.16em] ${
              light ? 'text-white' : 'text-ink'
            }`}
          >
            {church.name}
          </span>
          <span
            className={`block whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.18em] ${
              light ? 'text-cream/60' : 'text-ink/45'
            }`}
          >
            {church.parish}
          </span>
        </span>
      )}
    </span>
  )
}
