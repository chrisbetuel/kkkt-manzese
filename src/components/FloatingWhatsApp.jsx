import Icon from './Icon.jsx'
import { useSite } from '../content.jsx'
import { waLink } from '../lib/wa.js'

/** Kitufe cha WhatsApp kinachoelea kona ya chini kulia (tovuti nzima). */
export default function FloatingWhatsApp() {
  const { church } = useSite()
  const href = waLink(
    church.whatsapp || church.phone,
    `Habari, natoka kwenye tovuti ya ${church.name}. Nina swali:`,
  )
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Wasiliana nasi kwa WhatsApp"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <Icon name="whatsapp" className="h-6 w-6" />
      <span className="hidden text-xs font-semibold uppercase tracking-[0.12em] sm:inline">
        WhatsApp
      </span>
    </a>
  )
}
