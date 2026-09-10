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
}

export default function Icon({ name, className = 'h-6 w-6', strokeWidth = 1.75, ...props }) {
  if (brand[name]) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
