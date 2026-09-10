import {
  ArrowRight,
  Baby,
  BookOpen,
  CalendarDays,
  Clock,
  Cross,
  Flower2,
  HandCoins,
  Heart,
  HeartHandshake,
  Images,
  Landmark,
  Mail,
  MapPin,
  Music,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Share2,
  UserRound,
  X,
} from 'lucide-react'

// Ramani ya majina yetu -> aikoni za Lucide (seti ya kitaalamu)
const map = {
  book: BookOpen,
  cross: Cross,
  hands: HeartHandshake,
  heart: Heart,
  music: Music,
  spark: Sparkles,
  flower: Flower2,
  shield: ShieldCheck,
  child: Baby,
  phone: Smartphone,
  bank: Landmark,
  hand: HandCoins,
  clock: Clock,
  pin: MapPin,
  mail: Mail,
  calendar: CalendarDays,
  play: Play,
  gallery: Images,
  arrow: ArrowRight,
  user: UserRound,
  share: Share2,
  x: X,
}

// Aikoni za mitandao ya kijamii (Lucide haina tena alama za bidhaa)
const brand = {
  facebook: (
    <path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.2" />
    </>
  ),
  youtube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M11 9.5v5l4-2.5z" />
    </>
  ),
  whatsapp: (
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3zm4.2 12.3c-.2.5-1 1-1.5 1-.4 0-.9.2-3-.9-2.5-1.3-4-3.9-4.2-4.1-.1-.2-1-1.3-1-2.4s.6-1.7.8-1.9c.2-.2.4-.3.6-.3h.5c.1 0 .3 0 .5.4l.7 1.7c.1.2.1.4 0 .5l-.3.5-.3.3c-.1.1-.3.3-.1.5.2.4.8 1.2 1.6 1.9 1 .9 1.8 1.1 2 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l1.6.8c.3.1.4.2.5.3v1z" />
  ),
}

const brandFilled = new Set(['facebook', 'whatsapp'])

export default function Icon({ name, className = 'h-6 w-6', strokeWidth = 1.75, ...props }) {
  if (brand[name]) {
    const filled = brandFilled.has(name)
    return (
      <svg
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        {...props}
      >
        {brand[name]}
      </svg>
    )
  }

  const Cmp = map[name]
  if (!Cmp) return null
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" {...props} />
}
