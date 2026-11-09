import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function PageHeader({ crumbs = [] }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-r from-parchment via-white to-navy-50">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold-200/30 blur-3xl" />
      <div className="container-x relative py-5 md:py-6">
        <nav className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-soft">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 transition-colors hover:border-gold-400 hover:text-ink"
          >
            Nyumbani
          </Link>
          {crumbs.map((c) => (
            <span key={c} className="flex items-center gap-2">
              <Icon name="next" className="h-3.5 w-3.5 text-gold-500" />
              <span className="font-semibold text-ink">{c}</span>
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}
