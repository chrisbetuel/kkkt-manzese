import { Link } from 'react-router-dom'

export default function PageHeader({ crumbs = [] }) {
  return (
    <section className="relative overflow-hidden border-b border-ink/12 bg-cream">
      {/* decor */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(23,21,18,0.07) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(to right, #000, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to right, #000, transparent 70%)',
          }}
        />
        <span className="absolute left-[9px] top-[7px] text-[12px] text-gold-500 sm:left-4 sm:top-2.5">
          ✦
        </span>
        <span className="absolute bottom-[5px] right-[9px] text-[12px] text-gold-500 sm:bottom-2.5 sm:right-4">
          ✦
        </span>
      </div>

      <div className="container-x relative py-5 md:py-6">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
          <Link to="/" className="transition-colors hover:text-ink">
            Nyumbani
          </Link>
          {crumbs.map((c) => (
            <span key={c} className="flex items-center gap-2">
              <span className="text-gold-500">/</span>
              <span className="text-ink/75">{c}</span>
            </span>
          ))}
        </nav>
      </div>
    </section>
  )
}
